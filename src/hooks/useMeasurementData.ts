import { useState, useEffect, useCallback, useRef } from 'react';
import { APP_CONFIG } from '../config/app-config';

// Data structure from server
export interface MeasurementData {
  state: string;
  time: string;
  thrust: number;
  samples: number;
  rate: number;
  rssi: number;
}

// Data history for graphing
export interface ThrustDataPoint {
  time: number;
  thrust: number;
}

const SERVER_URL = APP_CONFIG.server.url;
const FETCH_INTERVAL = APP_CONFIG.server.fetchInterval;
const MAX_RETRY_INTERVAL = 5000; // Maximum backoff: 5 seconds
const BACKOFF_MULTIPLIER = 1.5; // Increase interval by 50% on each failure

export function useMeasurementData() {
  const [data, setData] = useState<MeasurementData | null>(null);
  const [thrustHistory, setThrustHistory] = useState<ThrustDataPoint[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Track consecutive failures for exponential backoff
  const consecutiveFailures = useRef(0);
  const currentInterval = useRef(FETCH_INTERVAL);
  const lastErrorLogged = useRef<string | null>(null);

  // Fetch data from server
  const fetchData = useCallback(async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), APP_CONFIG.server.timeout);

      // Simplified fetch to avoid CORS preflight - only use basic GET request
      const fetchOptions: RequestInit = {
        method: 'GET',
        signal: controller.signal,
      };

      // Only add CORS mode if server supports it (configured in app-config)
      if (APP_CONFIG.server.useCors) {
        fetchOptions.mode = 'cors';
        fetchOptions.cache = 'no-cache';
      }

      const response = await fetch(SERVER_URL, fetchOptions);

      clearTimeout(timeoutId);

      if (response.ok) {
        const jsonData: MeasurementData = await response.json();
        setData(jsonData);
        setIsConnected(true);
        setError(null);
        
        // Reset backoff on successful connection
        consecutiveFailures.current = 0;
        currentInterval.current = FETCH_INTERVAL;
        lastErrorLogged.current = null;

        // Add to thrust history for graph
        setThrustHistory((prev) => {
          const newPoint: ThrustDataPoint = {
            time: Date.now(),
            thrust: jsonData.thrust,
          };
          // Keep last N data points based on config
          const updated = [...prev, newPoint];
          return updated.slice(-APP_CONFIG.graph.maxDataPoints);
        });
      } else {
        handleConnectionFailure('Server responded with error');
      }
    } catch (err) {
      // Only log first occurrence and changes in error type to reduce console noise
      const errorMessage = err instanceof Error ? err.message : 'Connection failed';
      if (lastErrorLogged.current !== errorMessage) {
        console.warn(`Connection to ${SERVER_URL} failed:`, errorMessage);
        lastErrorLogged.current = errorMessage;
      }
      handleConnectionFailure(errorMessage);
    }
  }, []);

  // Handle connection failures with exponential backoff
  const handleConnectionFailure = (errorMessage: string) => {
    setIsConnected(false);
    setError(errorMessage);
    consecutiveFailures.current += 1;

    // Implement exponential backoff
    if (consecutiveFailures.current > 3) {
      currentInterval.current = Math.min(
        currentInterval.current * BACKOFF_MULTIPLIER,
        MAX_RETRY_INTERVAL
      );
    }
  };

  // Setup polling interval with dynamic backoff
  useEffect(() => {
    // Fetch immediately on mount
    fetchData();

    // Setup interval for continuous fetching with dynamic interval
    let intervalId: NodeJS.Timeout;
    
    const scheduleNext = () => {
      intervalId = setTimeout(() => {
        fetchData();
        scheduleNext();
      }, currentInterval.current);
    };
    
    scheduleNext();

    return () => {
      clearTimeout(intervalId);
    };
  }, [fetchData]);

  return {
    data,
    thrustHistory,
    isConnected,
    error,
  };
}

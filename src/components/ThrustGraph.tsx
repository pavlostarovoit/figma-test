import { useEffect, useRef } from 'react';
import { ThrustDataPoint } from '../hooks/useMeasurementData';
import { APP_CONFIG } from '../config/app-config';

interface ThrustGraphProps {
  data: ThrustDataPoint[];
  maxThrust?: number;
}

export function ThrustGraph({ data, maxThrust = APP_CONFIG.graph.maxThrust }: ThrustGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate dimensions
    const width = canvas.width;
    const height = canvas.height;
    const padding = 0;

    // Calculate max time range from config
    const timeRange = APP_CONFIG.graph.timeWindow;
    const currentTime = Date.now();
    const minTime = currentTime - timeRange;

    // Filter data to only show last 14 seconds
    const visibleData = data.filter(d => d.time >= minTime);

    if (visibleData.length < 2) return;

    // Draw the thrust line
    ctx.beginPath();
    ctx.strokeStyle = '#545454';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 4]);

    visibleData.forEach((point, index) => {
      // Calculate x position based on time
      const timePercent = (point.time - minTime) / timeRange;
      const x = padding + timePercent * (width - 2 * padding);

      // Calculate y position based on thrust (inverted because canvas Y goes down)
      const thrustPercent = Math.min(point.thrust / maxThrust, 1);
      const y = height - (thrustPercent * height);

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();
    ctx.setLineDash([]);
  }, [data, maxThrust]);

  return (
    <canvas
      ref={canvasRef}
      width={320}
      height={100}
      className="absolute bottom-[16px] left-[16px] right-[-8px] top-0 pointer-events-none"
      style={{ width: '100%', height: '100%' }}
    />
  );
}

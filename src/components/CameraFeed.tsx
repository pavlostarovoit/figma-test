import { useEffect, useRef, useState } from 'react';
import svgPaths from '../imports/svg-6eos6lj7at';
import { APP_CONFIG } from '../config/app-config';

interface CameraFeedProps {
  className?: string;
}

export function CameraFeed({ className }: CameraFeedProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [zoom, setZoom] = useState(1);

  // Initialize camera
  useEffect(() => {
    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: APP_CONFIG.camera.facingMode,
            width: { ideal: APP_CONFIG.camera.idealWidth },
            height: { ideal: APP_CONFIG.camera.idealHeight },
          },
          audio: true,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        setStream(mediaStream);
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    }

    startCamera();

    return () => {
      // Cleanup: stop all tracks when component unmounts
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Apply zoom effect
  useEffect(() => {
    if (videoRef.current && stream) {
      const videoTrack = stream.getVideoTracks()[0];
      const capabilities = videoTrack.getCapabilities() as any;

      if ('zoom' in capabilities) {
        const constraints = {
          advanced: [{ zoom: zoom }],
        };
        videoTrack.applyConstraints(constraints).catch(console.error);
      }
    }
  }, [zoom, stream]);

  // Toggle recording
  const toggleRecording = () => {
    if (!stream) return;

    if (isRecording) {
      // Stop recording
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
      }
    } else {
      // Start recording
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm',
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks((prev) => [...prev, event.data]);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `thrust-test-${Date.now()}.webm`;
        a.click();
        setRecordedChunks([]);
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
    }
  };

  // Increase zoom
  const handleZoom = () => {
    setZoom((prev) => Math.min(prev + APP_CONFIG.camera.zoomStep, APP_CONFIG.camera.maxZoom));
  };

  return (
    <div className={className}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 max-w-none object-cover pointer-events-none size-full object-center"
      />
      <div aria-hidden="true" className="absolute border-[#efefef] border-[1px_0px_0px] border-solid bottom-0 left-0 pointer-events-none right-0 top-[-1px]" />
      
      {/* Record Button */}
      <button
        onClick={toggleRecording}
        className="absolute bottom-[16px] box-border content-stretch flex gap-[8px] items-center justify-center overflow-clip p-[16px] right-[16px] rounded-[4px]"
        style={{ backgroundColor: isRecording ? '#c13211' : '#000000' }}
      >
        <div className="relative shrink-0 size-[20px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
            <g>
              <path d={svgPaths.p3cd9f000} fill="white" />
            </g>
          </svg>
        </div>
        <div className="flex flex-col font-['Noto_Sans'] justify-center leading-[0] not-italic relative shrink-0 text-center text-nowrap text-white" style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--text-lg)' }}>
          <p className="leading-[20px] whitespace-pre">{isRecording ? 'Stop' : 'Record'}</p>
        </div>
      </button>

      {/* Zoom Control */}
      <button
        onClick={handleZoom}
        className="absolute bg-[#3d3c3c] box-border content-stretch flex flex-col gap-[4px] items-center justify-center p-[16px] right-[16.46px] rounded-[4px] top-[16px] w-[52px]"
      >
        <div className="relative shrink-0 size-[20px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
            <g>
              <path d={svgPaths.p8685080} fill="white" />
            </g>
          </svg>
        </div>
      </button>

      {/* Zoom indicator */}
      {zoom > 1 && (
        <div className="absolute top-[70px] right-[16px] bg-black/70 text-white px-[8px] py-[4px] rounded-[4px]" style={{ fontSize: 'var(--text-sm)' }}>
          {zoom.toFixed(1)}x
        </div>
      )}
    </div>
  );
}

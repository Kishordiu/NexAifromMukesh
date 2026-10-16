import React, { useRef, useEffect } from 'react';

export function CameraPreview({ 
  stream, 
  className = '', 
  mirrored = true,
  onFrame 
}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const requestRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // Optional: Frame extraction loop for computer vision/rPPG
  useEffect(() => {
    if (!onFrame || !stream) return;

    const processFrame = () => {
      if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          
          if (ctx) {
            // If mirrored, flip the canvas context before drawing
            if (mirrored) {
              ctx.translate(canvas.width, 0);
              ctx.scale(-1, 1);
            }
            
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            // Reset transform if mirrored
            if (mirrored) {
              ctx.setTransform(1, 0, 0, 1, 0, 0);
            }
            
            // Pass the image data to the callback
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            onFrame(imageData);
          }
        }
      }
      requestRef.current = requestAnimationFrame(processFrame);
    };

    requestRef.current = requestAnimationFrame(processFrame);
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [stream, onFrame, mirrored]);

  if (!stream) return null;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
        style={{ transform: mirrored ? 'scaleX(-1)' : 'none' }}
      />
      {/* Hidden canvas used only for frame extraction */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

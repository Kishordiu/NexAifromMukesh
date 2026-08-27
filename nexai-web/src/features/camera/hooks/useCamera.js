import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook to manage camera access, stream, and permissions.
 * @param {Object} options
 * @param {boolean} options.autoStart - Whether to request camera immediately on mount
 * @param {boolean} options.facingMode - 'user' or 'environment'
 * @param {Object} options.resolution - { width, height } target resolution
 */
export function useCamera({
  autoStart = false,
  facingMode = 'user',
  resolution = { width: { ideal: 1280 }, height: { ideal: 720 } }
} = {}) {
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const [permissionState, setPermissionState] = useState('prompt'); // 'prompt', 'granted', 'denied'
  const [isInitializing, setIsInitializing] = useState(false);
  const streamRef = useRef(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = null;
      setStream(null);
    }
  }, []);

  const startCamera = useCallback(async () => {
    setIsInitializing(true);
    setError(null);
    
    try {
      // First check if API is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported in this browser');
      }

      // Stop any existing stream before starting a new one
      stopCamera();

      const constraints = {
        video: {
          facingMode,
          ...resolution,
          // Optimization for computer vision/rPPG
          frameRate: { ideal: 30, max: 60 }
        },
        audio: false // We only need video for health scans
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      streamRef.current = mediaStream;
      setStream(mediaStream);
      setPermissionState('granted');
    } catch (err) {
      console.error('Camera initialization error:', err);
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setPermissionState('denied');
        setError('Camera permission denied. Please enable it in your browser settings.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setError('No camera device found on this device.');
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setError('Camera is already in use by another application.');
      } else {
        setError(err.message || 'Failed to initialize camera.');
      }
    } finally {
      setIsInitializing(false);
    }
  }, [facingMode, resolution, stopCamera]);

  useEffect(() => {
    // Optional: Check initial permission status if the browser supports it
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'camera' })
        .then(permissionStatus => {
          setPermissionState(permissionStatus.state);
          permissionStatus.onchange = () => {
            setPermissionState(permissionStatus.state);
            if (permissionStatus.state === 'denied') {
              stopCamera();
            }
          };
        })
        .catch(() => {
          // Ignore, some browsers don't support querying camera permission
        });
    }

    if (autoStart) {
      startCamera();
    }

    return () => {
      stopCamera();
    };
  }, [autoStart, startCamera, stopCamera]);

  return {
    stream,
    error,
    permissionState,
    isInitializing,
    startCamera,
    stopCamera
  };
}

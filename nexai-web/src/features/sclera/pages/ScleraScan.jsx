import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCamera } from '../../camera/hooks/useCamera';
import { CameraPreview } from '../../camera/components/CameraPreview';
import { PermissionGate } from '../../camera/components/PermissionGate';
import GlassSurface from '../../../components/ui/GlassSurface';
import Button from '../../../components/ui/Button';
import { api } from '../../../lib/api';

/**
 * Sclera Jaundice Scanner — analyses yellow tint in the sclera (white of eye).
 * Uses a simple yellow-channel ratio heuristic on a central ROI.
 */
export default function ScleraScan() {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const scanDataRef = useRef({ yellowSum: 0, count: 0 });
  const startTimeRef = useRef(null);

  const { stream, permissionState, error: cameraError, startCamera } = useCamera({ autoStart: true, facingMode: 'user' });

  const processFrame = useCallback((imageData) => {
    if (!isScanning || !startTimeRef.current) return;

    const now = performance.now();
    const elapsed = now - startTimeRef.current;
    setProgress(Math.min(100, Math.round((elapsed / 5000) * 100)));

    const { data, width, height } = imageData;
    const roiW = Math.floor(width * 0.08);
    const roiH = Math.floor(height * 0.08);
    const startX = Math.floor((width - roiW) / 2);
    const startY = Math.floor((height - roiH) / 2);

    for (let y = startY; y < startY + roiH; y += 2) {
      for (let x = startX; x < startX + roiW; x += 2) {
        const i = (y * width + x) * 4;
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Yellow = high R + high G, low B
        const yellowness = ((r + g) / 2) / (b || 1);
        scanDataRef.current.yellowSum += yellowness;
        scanDataRef.current.count++;
      }
    }

    if (elapsed > 5000) {
      setIsScanning(false);
      const avgYellowness = scanDataRef.current.yellowSum / scanDataRef.current.count;

      if (avgYellowness > 3.0) {
        setResult('ELEVATED_BILIRUBIN');
      } else if (avgYellowness > 2.2) {
        setResult('MILD_ICTERUS');
      } else if (avgYellowness > 0) {
        setResult('NORMAL');
      } else {
        setError('Scan failed. Please ensure good lighting.');
      }
    }
  }, [isScanning]);

  const startScan = () => {
    scanDataRef.current = { yellowSum: 0, count: 0 };
    setResult(null);
    setError(null);
    setProgress(0);
    setIsScanning(true);
    startTimeRef.current = performance.now();
  };

  const handleSave = async () => {
    try {
      await api.patient.saveMeasurement({
        type: 'jaundice_risk',
        value: result === 'NORMAL' ? 'Low' : 'High',
        unit: 'risk',
        confidence: 0.7,
        signal_quality: 'GOOD',
        metadata: { source: 'vision_sclera', rawResult: result }
      });
      navigate('/home');
    } catch (err) {
      alert('Failed to save.');
    }
  };

  return (
    <div className="pt-8 pb-32 space-y-6">
      <header className="mb-6 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/50 rounded-full shadow-sm">
          <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-800">Sclera Scanner</h1>
          <p className="text-xs text-slate-500 font-medium">Jaundice / Icterus Detection</p>
        </div>
      </header>

      <PermissionGate permissionState={permissionState} error={cameraError} onRequestPermission={startCamera} onRetry={startCamera}>
        <div className="relative w-full aspect-[3/4] bg-slate-900 rounded-[36px] overflow-hidden shadow-2xl mb-6">
          <CameraPreview stream={stream} onFrame={processFrame} className="absolute inset-0" />

          {/* Eye ROI guide */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className={`w-20 h-20 border-2 rounded-full ${isScanning ? 'border-yellow-400 animate-pulse' : 'border-white/50 border-dashed'} transition-colors`} />
          </div>

          <div className="absolute inset-0 border-[40px] border-black/40 rounded-[36px] pointer-events-none" />

          {!isScanning && !result && (
            <div className="absolute bottom-10 w-full text-center px-6 z-20">
              <p className="text-white text-sm drop-shadow-md">Look straight at the camera. Position your eye inside the circle.</p>
            </div>
          )}

          {isScanning && (
            <div className="absolute top-10 w-full flex justify-center z-20">
              <div className="bg-black/50 backdrop-blur-md px-6 py-2 rounded-full border border-white/20">
                <span className="text-yellow-400 font-bold">{progress}% Analyzing Sclera</span>
              </div>
            </div>
          )}
        </div>

        <GlassSurface level={3} className="p-6 rounded-3xl text-center">
          {error ? (
            <p className="text-red-500 font-medium mb-4">{error}</p>
          ) : result ? (
            <div className="mb-6 space-y-2">
              <h3 className="text-lg font-bold text-slate-800">Scan Complete</h3>
              <p className={`text-xl font-black ${result === 'NORMAL' ? 'text-emerald-500' : 'text-amber-500'}`}>
                {result.replace(/_/g, ' ')}
              </p>
              <p className="text-xs text-slate-500">Based on scleral yellowness analysis. This is a research prototype — not a clinical diagnosis.</p>
            </div>
          ) : null}

          {!isScanning && !result && (
            <Button variant="primary" className="w-full py-4" onClick={startScan}>Begin Scan</Button>
          )}

          {!isScanning && result && (
            <div className="flex gap-4">
              <Button variant="secondary" className="flex-1" onClick={startScan}>Retake</Button>
              <Button variant="primary" className="flex-1" onClick={handleSave}>Save</Button>
            </div>
          )}
        </GlassSurface>
      </PermissionGate>
    </div>
  );
}

import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCamera } from '../../camera/hooks/useCamera';
import { CameraPreview } from '../../camera/components/CameraPreview';
import { PermissionGate } from '../../camera/components/PermissionGate';
import GlassSurface from '../../../components/ui/GlassSurface';
<<<<<<< HEAD
import Button from '../../../components/ui/Button';
import { api } from '../../../lib/api';
import { motion } from 'framer-motion';
=======
import MotionReveal from '../../../components/ui/MotionReveal';
import { api } from '../../../lib/api';
import { ArrowLeft, Save, RefreshCw, Eye } from 'lucide-react';
>>>>>>> 04fdc8ee73d6254fc60450a5b14882f2da59d927

export default function AnemiaScan() {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null); // 'NORMAL', 'MILD_PALLOR', 'SEVERE_PALLOR'
  const [error, setError] = useState(null);
  
  const scanDataRef = useRef({ redSum: 0, count: 0 });
  const startTimeRef = useRef(null);
  
  const { stream, permissionState, error: cameraError, startCamera } = useCamera({ autoStart: true, facingMode: 'user' });

  const processFrame = useCallback((imageData) => {
    if (!isScanning || !startTimeRef.current) return;

    const now = performance.now();
    const elapsed = now - startTimeRef.current;
    setProgress(Math.min(100, Math.round((elapsed / 5000) * 100)));

<<<<<<< HEAD
    // Analyze red vs green/blue in the center (simulating eyelid conjunctiva check)
=======
>>>>>>> 04fdc8ee73d6254fc60450a5b14882f2da59d927
    const { data, width, height } = imageData;
    const roiWidth = Math.floor(width * 0.1);
    const roiHeight = Math.floor(height * 0.05);
    const startX = Math.floor((width - roiWidth) / 2);
    const startY = Math.floor((height - roiHeight) / 2);

    for (let y = startY; y < startY + roiHeight; y += 2) {
      for (let x = startX; x < startX + roiWidth; x += 2) {
        const i = (y * width + x) * 4;
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
<<<<<<< HEAD
        // Simple redness ratio
=======
>>>>>>> 04fdc8ee73d6254fc60450a5b14882f2da59d927
        const redness = r / ((g + b) / 2 || 1);
        scanDataRef.current.redSum += redness;
        scanDataRef.current.count++;
      }
    }

    if (elapsed > 5000) {
      setIsScanning(false);
      const avgRedness = scanDataRef.current.redSum / scanDataRef.current.count;
      
<<<<<<< HEAD
      // Heuristic thresholds
=======
>>>>>>> 04fdc8ee73d6254fc60450a5b14882f2da59d927
      if (avgRedness > 1.8) {
        setResult('NORMAL');
      } else if (avgRedness > 1.5) {
        setResult('MILD_PALLOR');
      } else if (avgRedness > 0) {
        setResult('SEVERE_PALLOR');
      } else {
        setError('Scan failed. Lighting too poor.');
      }
    }
  }, [isScanning]);

  const startScan = () => {
    scanDataRef.current = { redSum: 0, count: 0 };
    setResult(null);
    setError(null);
    setProgress(0);
    setIsScanning(true);
    startTimeRef.current = performance.now();
  };

  const handleSave = async () => {
    try {
      await api.patient.saveMeasurement({
        type: 'anemia_risk',
        value: result === 'NORMAL' ? 'Low' : 'High',
        unit: 'risk',
        confidence: 0.75,
        signal_quality: 'GOOD',
        metadata: { source: 'vision_conjunctiva', rawResult: result }
      });
      navigate('/home');
    } catch (err) {
      alert('Failed to save.');
    }
  };

  return (
<<<<<<< HEAD
    <div className="pt-8 pb-32 space-y-6">
      <header className="mb-6 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/50 rounded-full shadow-sm">
          <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-800">Anemia Scanner</h1>
          <p className="text-xs text-slate-500 font-medium">Lower Eyelid Analysis</p>
        </div>
      </header>

      <PermissionGate permissionState={permissionState} error={cameraError} onRequestPermission={startCamera} onRetry={startCamera}>
        <div className="relative w-full aspect-[3/4] bg-slate-900 rounded-[36px] overflow-hidden shadow-2xl mb-6">
          <CameraPreview stream={stream} onFrame={processFrame} className="absolute inset-0" />
          
          {/* ROI Guide - small rectangle for eyelid */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className={`w-32 h-16 border-2 border-dashed ${isScanning ? 'border-red-400' : 'border-white/50'} rounded-lg transition-colors`} />
          </div>

          <div className="absolute inset-0 border-[40px] border-black/40 rounded-[36px] pointer-events-none" />

          {!isScanning && !result && (
            <div className="absolute bottom-10 w-full text-center px-6 z-20">
              <p className="text-white text-sm drop-shadow-md">Gently pull down your lower eyelid and align it inside the box.</p>
            </div>
          )}
          
          {isScanning && (
            <div className="absolute top-10 w-full flex justify-center z-20">
              <div className="bg-black/50 backdrop-blur-md px-6 py-2 rounded-full border border-white/20">
                <span className="text-red-400 font-bold">{progress}% Analyzing Tissue</span>
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
              <p className={`text-xl font-black ${result === 'NORMAL' ? 'text-emerald-500' : 'text-orange-500'}`}>
                {result.replace('_', ' ')}
              </p>
              <p className="text-xs text-slate-500">Based on conjunctival pallor analysis.</p>
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
=======
    <div className="pt-8 pb-32 space-y-6 w-full max-w-lg mx-auto">
      <MotionReveal delay={0}>
        <header className="mb-6 flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="w-10 h-10 flex items-center justify-center bg-white/50 hover:bg-white rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Anemia Scan</h1>
            <p className="text-sm text-slate-500 font-medium">Lower Eyelid Analysis</p>
          </div>
        </header>
      </MotionReveal>

      <PermissionGate permissionState={permissionState} error={cameraError} onRequestPermission={startCamera} onRetry={startCamera}>
        <MotionReveal delay={0.1}>
          <div className="relative w-full aspect-[3/4] bg-slate-900 rounded-[36px] overflow-hidden shadow-[0_16px_48px_rgba(0,0,0,0.15)] mb-6 ring-1 ring-white/20">
            <CameraPreview stream={stream} onFrame={processFrame} className="absolute inset-0" />
            
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <div className={`w-32 h-16 border-2 border-dashed ${isScanning ? 'border-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.5)]' : 'border-white/50'} rounded-lg transition-all duration-300`} />
            </div>

            <div className="absolute inset-0 border-[32px] border-black/30 rounded-[36px] pointer-events-none mix-blend-overlay" />

            {!isScanning && !result && (
              <div className="absolute bottom-10 w-full text-center px-8 z-20">
                <div className="bg-black/40 backdrop-blur-md text-white text-sm py-3 px-4 rounded-2xl border border-white/20 shadow-lg">
                  Gently pull down your lower eyelid and align it inside the box.
                </div>
              </div>
            )}
            
            {isScanning && (
              <div className="absolute top-10 w-full flex justify-center z-20">
                <div className="bg-black/50 backdrop-blur-md px-6 py-2.5 rounded-full border border-white/20 shadow-lg flex items-center gap-3">
                  <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                  <span className="text-white font-bold tracking-wider text-sm">{progress}% Analyzing</span>
                </div>
              </div>
            )}
          </div>
        </MotionReveal>

        <MotionReveal delay={0.2}>
          <GlassSurface level={3} className="p-6 rounded-3xl text-center">
            {error ? (
              <p className="text-rose-500 font-medium mb-4">{error}</p>
            ) : result ? (
              <div className="mb-6 space-y-2">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Analysis Complete</h3>
                <p className={`text-2xl font-black tracking-tight ${result === 'NORMAL' ? 'text-emerald-500' : 'text-amber-500'}`}>
                  {result.replace('_', ' ')}
                </p>
                <p className="text-sm text-slate-500">Based on conjunctival pallor algorithms.</p>
              </div>
            ) : null}

            {!isScanning && !result && (
              <button 
                onClick={startScan}
                className="w-full bg-[var(--accent)] text-white py-4 rounded-xl font-bold shadow-[0_8px_24px_rgba(14,165,233,0.25)] hover:bg-opacity-90 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Eye className="w-5 h-5" /> Begin Analysis
              </button>
            )}

            {!isScanning && result && (
              <div className="flex gap-4">
                <button 
                  onClick={startScan}
                  className="flex-1 bg-white/50 text-slate-700 py-4 rounded-xl font-bold border border-white/60 hover:bg-white transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" /> Retake
                </button>
                <button 
                  onClick={handleSave}
                  className="flex-1 bg-[var(--accent)] text-white py-4 rounded-xl font-bold shadow-[0_8px_24px_rgba(14,165,233,0.25)] hover:bg-opacity-90 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" /> Save
                </button>
              </div>
            )}
          </GlassSurface>
        </MotionReveal>
>>>>>>> 04fdc8ee73d6254fc60450a5b14882f2da59d927
      </PermissionGate>
    </div>
  );
}

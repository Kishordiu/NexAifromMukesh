import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCamera } from '../../camera/hooks/useCamera';
import { CameraPreview } from '../../camera/components/CameraPreview';
import { PermissionGate } from '../../camera/components/PermissionGate';
import { useRPPG } from '../hooks/useRPPG';
import { BioAuraVisualizer } from '../components/BioAuraVisualizer';
import GlassSurface from '../../../components/ui/GlassSurface';
import Button from '../../../components/ui/Button';
import { api } from '../../../lib/api';

export default function VitalsScan() {
<<<<<<< HEAD
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  
  const { 
    stream, 
    permissionState, 
    error: cameraError, 
    startCamera 
  } = useCamera({ autoStart: true, facingMode: 'user' });
  
  const { 
    bpm, 
    signalQuality, 
    progress, 
    isScanning, 
    error: rppgError, 
    startScan, 
    reset, 
    processFrame 
  } = useRPPG();

  const handleSave = async () => {
    if (!bpm) return;
    
    setIsSaving(true);
    try {
      await api.patient.saveMeasurement({
        type: 'heart_rate',
        value: bpm,
        unit: 'bpm',
        confidence: signalQuality === 'GOOD' ? 0.9 : 0.6,
        signal_quality: signalQuality,
        metadata: { source: 'bio_aura_rppg' }
      });
      navigate('/home');
    } catch (err) {
      console.error('Failed to save measurement:', err);
      alert('Failed to save. Please try again.');
    } finally {
      setIsSaving(false);
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
          <h1 className="text-xl font-bold text-slate-800">Bio-Aura Scan</h1>
          <p className="text-xs text-slate-500 font-medium">Contactless Vitals</p>
        </div>
      </header>

      <PermissionGate 
        permissionState={permissionState} 
        error={cameraError} 
        onRequestPermission={startCamera}
        onRetry={startCamera}
      >
        <div className="relative w-full aspect-[3/4] bg-slate-900 rounded-[36px] overflow-hidden shadow-2xl mb-6">
          <CameraPreview 
            stream={stream} 
            onFrame={processFrame}
            className="absolute inset-0"
          />
          
          {/* Overlay mask to guide the user */}
          <div className="absolute inset-0 pointer-events-none border-[40px] border-black/40 rounded-[36px]" />
          
          {/* Scan UI Overlay */}
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6">
            <BioAuraVisualizer 
              progress={progress}
              isScanning={isScanning}
              bpm={bpm}
              signalQuality={signalQuality}
            />
          </div>

          {/* Instructions overlay */}
          {!isScanning && !bpm && (
            <div className="absolute bottom-10 left-0 w-full text-center px-8 z-20">
              <p className="text-white text-sm font-medium drop-shadow-md">
                Position your face in the center. Ensure good lighting. Hold still for 15 seconds.
              </p>
            </div>
          )}
        </div>

        {/* Controls */}
        <GlassSurface level={3} className="p-6 rounded-3xl">
          {rppgError && (
            <div className="mb-4 p-3 bg-red-50/80 border border-red-200 rounded-xl text-red-600 text-sm font-medium text-center">
              {rppgError}
            </div>
          )}

          {!isScanning && !bpm && (
            <Button variant="primary" size="lg" className="w-full py-4" onClick={startScan}>
              Start Scan
            </Button>
          )}

          {isScanning && (
            <div className="text-center">
              <p className="text-slate-600 font-medium animate-pulse">Scanning... Please hold still.</p>
            </div>
          )}

          {!isScanning && bpm && (
            <div className="flex gap-4">
              <Button variant="secondary" className="flex-1 py-4" onClick={reset}>
                Retake
              </Button>
              <Button variant="primary" className="flex-1 py-4" onClick={handleSave} isLoading={isSaving}>
                Save Vitals
              </Button>
            </div>
          )}
        </GlassSurface>
      </PermissionGate>
    </div>
  );
=======
 const navigate = useNavigate();
 const [isSaving, setIsSaving] = useState(false);
 
 const { 
 stream, 
 permissionState, 
 error: cameraError, 
 startCamera 
 } = useCamera({ autoStart: true, facingMode: 'user' });
 
 const { 
 bpm, 
 signalQuality, 
 progress, 
 isScanning, 
 error: rppgError, 
 startScan, 
 reset, 
 processFrame 
 } = useRPPG();

 const handleSave = async () => {
 if (!bpm) return;
 
 setIsSaving(true);
 try {
 await api.patient.saveMeasurement({
 type: 'heart_rate',
 value: bpm,
 unit: 'bpm',
 confidence: signalQuality === 'GOOD' ? 0.9 : 0.6,
 signal_quality: signalQuality,
 metadata: { source: 'bio_aura_rppg' }
 });
 navigate('/home');
 } catch (err) {
 console.error('Failed to save measurement:', err);
 alert('Failed to save. Please try again.');
 } finally {
 setIsSaving(false);
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
 <h1 className="text-xl font-bold text-slate-800">Bio-Aura Scan</h1>
 <p className="text-xs text-slate-500 font-medium">Contactless Vitals</p>
 </div>
 </header>

 <PermissionGate 
 permissionState={permissionState} 
 error={cameraError} 
 onRequestPermission={startCamera}
 onRetry={startCamera}
 >
 <div className="relative w-full aspect-[3/4] bg-slate-900 rounded-[36px] overflow-hidden shadow-2xl mb-6">
 <CameraPreview 
 stream={stream} 
 onFrame={processFrame}
 className="absolute inset-0"
 />
 
 {/* Overlay mask to guide the user */}
 <div className="absolute inset-0 pointer-events-none border-[40px] border-black/40 rounded-[36px]" />
 
 {/* Scan UI Overlay */}
 <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6">
 <BioAuraVisualizer 
 progress={progress}
 isScanning={isScanning}
 bpm={bpm}
 signalQuality={signalQuality}
 />
 </div>

 {/* Instructions overlay */}
 {!isScanning && !bpm && (
 <div className="absolute bottom-10 left-0 w-full text-center px-8 z-20">
 <p className="text-white text-sm font-medium drop-shadow-md">
 Position your face in the center. Ensure good lighting. Hold still for 15 seconds.
 </p>
 </div>
 )}
 </div>

 {/* Controls */}
 <GlassSurface level={3} className="p-6 rounded-3xl">
 {rppgError && (
 <div className="mb-4 p-3 bg-red-50/80 border border-red-200 rounded-xl text-red-600 text-sm font-medium text-center">
 {rppgError}
 </div>
 )}

 {!isScanning && !bpm && (
 <Button variant="primary" size="lg" className="w-full py-4" onClick={startScan}>
 Start Scan
 </Button>
 )}

 {isScanning && (
 <div className="text-center">
 <p className="text-slate-600 font-medium animate-pulse">Scanning... Please hold still.</p>
 </div>
 )}

 {!isScanning && bpm && (
 <div className="flex gap-4">
 <Button variant="secondary" className="flex-1 py-4" onClick={reset}>
 Retake
 </Button>
 <Button variant="primary" className="flex-1 py-4" onClick={handleSave} isLoading={isSaving}>
 Save Vitals
 </Button>
 </div>
 )}
 </GlassSurface>
 </PermissionGate>
 </div>
 );
>>>>>>> 04fdc8ee73d6254fc60450a5b14882f2da59d927
}

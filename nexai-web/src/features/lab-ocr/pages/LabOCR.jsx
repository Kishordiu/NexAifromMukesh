import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCamera } from '../../camera/hooks/useCamera';
import { CameraPreview } from '../../camera/components/CameraPreview';
import { PermissionGate } from '../../camera/components/PermissionGate';
import { useOCR } from '../hooks/useOCR';
import { LabResultsEditor } from '../components/LabResultsEditor';
import GlassSurface from '../../../components/ui/GlassSurface';
import Button from '../../../components/ui/Button';
import { api } from '../../../lib/api';

export default function LabOCR() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const { stream, permissionState, error: cameraError, startCamera } = useCamera({ autoStart: false, facingMode: 'environment' });
  const { isProcessing, progress, results, error: ocrError, processImage, reset: resetOCR } = useOCR();

  const handleCapture = () => {
    if (!stream) return;
    const video = document.querySelector('video');
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageUrl = canvas.toDataURL('image/jpeg');
    setCapturedImage(imageUrl);
    processImage(imageUrl);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCapturedImage(event.target.result);
        processImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    resetOCR();
  };

  const handleSave = async (formData) => {
    setIsSaving(true);
    try {
      // Save valid measurements
      if (formData.hemoglobin) {
        await api.patient.saveMeasurement({ type: 'hemoglobin', value: parseFloat(formData.hemoglobin), unit: 'g/dL', confidence: 0.9, signal_quality: 'GOOD', metadata: { source: 'ocr' } });
      }
      if (formData.glucose) {
        await api.patient.saveMeasurement({ type: 'glucose', value: parseFloat(formData.glucose), unit: 'mg/dL', confidence: 0.9, signal_quality: 'GOOD', metadata: { source: 'ocr' } });
      }
      if (formData.systolic && formData.diastolic) {
        await api.patient.saveMeasurement({ type: 'blood_pressure', value: `${formData.systolic}/${formData.diastolic}`, unit: 'mmHg', confidence: 0.9, signal_quality: 'GOOD', metadata: { source: 'ocr' } });
      }
      
      // Save raw text as a lab report entry
      if (results?.rawText) {
        await api.patient.saveLabReport({
          report_type: 'General Blood Panel',
          raw_text: results.rawText,
          parsed_data: JSON.stringify(formData)
        });
      }
      
      navigate('/home');
    } catch (err) {
      console.error('Save failed', err);
      alert('Failed to save results.');
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
          <h1 className="text-xl font-bold text-slate-800">Lab Report OCR</h1>
          <p className="text-xs text-slate-500 font-medium">Auto-extract medical values</p>
        </div>
      </header>

      {ocrError && (
        <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium mb-4">
          {ocrError}
        </div>
      )}

      {!capturedImage ? (
        <div className="space-y-6">
          <GlassSurface level={3} className="p-6 rounded-3xl text-center">
            <h3 className="font-bold text-slate-800 mb-2">Upload or Scan Report</h3>
            <p className="text-sm text-slate-500 mb-6">
              Take a clear photo of your lab results or upload an existing image.
            </p>
            
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
            />
            
            <div className="flex flex-col gap-3">
              <Button variant="primary" className="py-4" onClick={() => startCamera()}>
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                Open Camera
              </Button>
              <Button variant="secondary" className="py-4" onClick={() => fileInputRef.current?.click()}>
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                Upload Image
              </Button>
            </div>
          </GlassSurface>

          {stream && (
            <PermissionGate permissionState={permissionState} error={cameraError} onRequestPermission={startCamera} onRetry={startCamera}>
              <div className="relative w-full aspect-[3/4] bg-slate-900 rounded-[30px] overflow-hidden shadow-xl">
                <CameraPreview stream={stream} mirrored={false} className="absolute inset-0" />
                <div className="absolute inset-x-8 top-1/4 bottom-1/4 border-2 border-dashed border-white/50 rounded-xl" />
                <div className="absolute bottom-6 left-0 w-full flex justify-center">
                  <button onClick={handleCapture} className="w-16 h-16 rounded-full bg-white/20 border-4 border-white backdrop-blur-sm active:scale-95 transition-transform" />
                </div>
              </div>
            </PermissionGate>
          )}
        </div>
      ) : isProcessing ? (
        <GlassSurface level={3} className="p-8 rounded-3xl text-center space-y-6 flex flex-col items-center">
          <div className="relative w-24 h-24">
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle cx="48" cy="48" r="44" stroke="currentColor" strokeWidth="4" fill="none" className="text-slate-100" />
              <circle cx="48" cy="48" r="44" stroke="currentColor" strokeWidth="4" fill="none" className="text-blue-500 transition-all duration-300" strokeDasharray="276" strokeDashoffset={276 - (276 * progress) / 100} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-bold text-slate-700">{progress}%</span>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-slate-800">Extracting Text</h3>
            <p className="text-sm text-slate-500 mt-1">Our AI is reading your lab report. This runs entirely on your device for privacy.</p>
          </div>
        </GlassSurface>
      ) : results ? (
        <LabResultsEditor initialData={results.extracted} onSave={handleSave} onCancel={handleRetake} isSaving={isSaving} />
      ) : null}
    </div>
  );
}

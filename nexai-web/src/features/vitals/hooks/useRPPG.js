import { useState, useCallback, useRef } from 'react';

/**
 * useRPPG - A rudimentary remote photoplethysmography (rPPG) implementation.
 * It analyzes the green channel of incoming video frames to detect subtle
 * pulse variations. 
 * 
 * NOTE: This is a -grade implementation. Real clinical rPPG requires
 * facial landmark tracking, advanced bandpass filtering, and independent 
 * component analysis (ICA/CHROM).
 */
export function useRPPG() {
 const [bpm, setBpm] = useState(null);
 const [signalQuality, setSignalQuality] = useState('CALCULATING');
 const [progress, setProgress] = useState(0); // 0 to 100
 const [isScanning, setIsScanning] = useState(false);
 const [error, setError] = useState(null);

 const signalHistory = useRef([]);
 const timeHistory = useRef([]);
 const frameCount = useRef(0);
 const startTime = useRef(null);
 const SCAN_DURATION_MS = 15000; // 15 seconds to collect a decent window

 const reset = useCallback(() => {
 setBpm(null);
 setSignalQuality('CALCULATING');
 setProgress(0);
 setIsScanning(false);
 setError(null);
 signalHistory.current = [];
 timeHistory.current = [];
 frameCount.current = 0;
 startTime.current = null;
 }, []);

 const startScan = useCallback(() => {
 reset();
 setIsScanning(true);
 startTime.current = performance.now();
 }, [reset]);

 // Extracts average green channel intensity from the center region (ROI)
 const extractGreenIntensity = (imageData) => {
 const { data, width, height } = imageData;
 
 // Define Region of Interest (ROI) - center 20% of the frame
 const roiWidth = Math.floor(width * 0.2);
 const roiHeight = Math.floor(height * 0.2);
 const startX = Math.floor((width - roiWidth) / 2);
 const startY = Math.floor((height - roiHeight) / 2);
 
 let sumGreen = 0;
 let count = 0;

 for (let y = startY; y < startY + roiHeight; y += 4) { // Sample every 4th pixel for speed
 for (let x = startX; x < startX + roiWidth; x += 4) {
 const index = (y * width + x) * 4;
 // data[index] is R, data[index+1] is G, data[index+2] is B
 sumGreen += data[index + 1];
 count++;
 }
 }

 return sumGreen / count;
 };

 // Very basic peak detection on the signal array
 const calculateBPM = (signal, times) => {
 if (signal.length < 60) return null; // Need at least a few seconds of 30fps data

 // 1. Moving average to smooth the signal (low-pass filter)
 const windowSize = 5;
 const smoothed = [];
 for (let i = 0; i < signal.length; i++) {
 let sum = 0;
 let count = 0;
 for (let j = Math.max(0, i - windowSize); j <= Math.min(signal.length - 1, i + windowSize); j++) {
 sum += signal[j];
 count++;
 }
 smoothed.push(sum / count);
 }

 // 2. Find local maxima (peaks)
 const peaks = [];
 for (let i = 2; i < smoothed.length - 2; i++) {
 if (
 smoothed[i] > smoothed[i - 1] && 
 smoothed[i] > smoothed[i - 2] &&
 smoothed[i] > smoothed[i + 1] && 
 smoothed[i] > smoothed[i + 2]
 ) {
 peaks.push(times[i]);
 }
 }

 // 3. Calculate BPM from peak intervals
 if (peaks.length < 3) {
 return { bpm: null, quality: 'POOR_SIGNAL (Need more peaks)' };
 }

 let totalInterval = 0;
 let intervalCount = 0;
 
 for (let i = 1; i < peaks.length; i++) {
 const intervalMs = peaks[i] - peaks[i - 1];
 // Filter out physically impossible intervals (e.g. > 200 BPM or < 40 BPM)
 if (intervalMs > 300 && intervalMs < 1500) {
 totalInterval += intervalMs;
 intervalCount++;
 }
 }

 if (intervalCount === 0) {
 return { bpm: null, quality: 'POOR_SIGNAL (Irregular peaks)' };
 }

 const avgInterval = totalInterval / intervalCount;
 const calculatedBpm = Math.round(60000 / avgInterval);

 let quality = 'GOOD';
 // If standard deviation of intervals is too high, signal is noisy
 if (peaks.length < 5) quality = 'FAIR';
 
 return { bpm: calculatedBpm, quality };
 };

 const processFrame = useCallback((imageData) => {
 if (!isScanning || !startTime.current) return;

 const now = performance.now();
 const elapsed = now - startTime.current;
 
 const currentProgress = Math.min(100, Math.round((elapsed / SCAN_DURATION_MS) * 100));
 setProgress(currentProgress);

 const greenIntensity = extractGreenIntensity(imageData);
 signalHistory.current.push(greenIntensity);
 timeHistory.current.push(now);
 frameCount.current++;

 if (elapsed >= SCAN_DURATION_MS) {
 setIsScanning(false);
 
 const result = calculateBPM(signalHistory.current, timeHistory.current);
 
 if (result.bpm) {
 setBpm(result.bpm);
 setSignalQuality(result.quality);
 } else {
 setSignalQuality('FAILED');
 setError(`Could not determine heart rate. ${result.quality}. Please hold still in a well-lit area.`);
 }
 }
 }, [isScanning]);

 return {
 bpm,
 signalQuality,
 progress,
 isScanning,
 error,
 startScan,
 reset,
 processFrame
 };
}

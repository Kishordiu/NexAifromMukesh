import { useState, useCallback } from 'react';
import Tesseract from 'tesseract.js';

export function useOCR() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  // Common maternal health lab markers to extract
  const extractLabValues = (text) => {
    const extracted = {};
    const lines = text.split('\n');

    lines.forEach(line => {
      const lower = line.toLowerCase();
      
      if (lower.includes('hemoglobin') || lower.includes('hgb')) {
        const match = line.match(/[\d.]+/);
        if (match) extracted.hemoglobin = parseFloat(match[0]);
      }
      
      if (lower.includes('glucose') || lower.includes('sugar')) {
        const match = line.match(/[\d.]+/);
        if (match) extracted.glucose = parseFloat(match[0]);
      }
      
      if (lower.includes('pressure') || lower.includes('bp')) {
        const match = line.match(/(\d+)\s*\/\s*(\d+)/);
        if (match) {
          extracted.systolic = parseInt(match[1]);
          extracted.diastolic = parseInt(match[2]);
        }
      }
    });

    return extracted;
  };

  const processImage = useCallback(async (imageSource) => {
    setIsProcessing(true);
    setProgress(0);
    setError(null);
    setResults(null);

    try {
      const worker = await Tesseract.createWorker('eng', 1, {
        logger: m => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
          }
        }
      });

      const { data: { text } } = await worker.recognize(imageSource);
      await worker.terminate();

      const extractedData = extractLabValues(text);
      setResults({
        rawText: text,
        extracted: extractedData
      });

    } catch (err) {
      console.error('OCR Error:', err);
      setError('Failed to process image. Please try again with a clearer photo.');
    } finally {
      setIsProcessing(false);
      setProgress(100);
    }
  }, []);

  const reset = () => {
    setResults(null);
    setProgress(0);
    setError(null);
  };

  return {
    isProcessing,
    progress,
    results,
    error,
    processImage,
    reset
  };
}

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { TriageResponse } from '../components/TriageResponse';
import GlassSurface from '../../../components/ui/GlassSurface';
import Button from '../../../components/ui/Button';
import { api } from '../../../lib/api';

export default function VoiceTriage() {
<<<<<<< HEAD
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [manualText, setManualText] = useState('');
  const [triageResult, setTriageResult] = useState(null);
  const [error, setError] = useState(null);
  const [useManual, setUseManual] = useState(false);

  const recognitionRef = useRef(null);

  // Check for Web Speech API support
  const hasSpeechAPI = typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  const startRecording = () => {
    setError(null);
    setTranscript('');
    setTriageResult(null);

    if (!hasSpeechAPI) {
      setError('Speech recognition is not supported in this browser. Please type your symptoms below.');
      setUseManual(true);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setTranscript(prev => prev + finalTranscript + interimTranscript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        setError('Microphone permission denied. Please enable it in your browser settings, or type your symptoms below.');
        setUseManual(true);
      } else {
        setError(`Speech error: ${event.error}. You can type your symptoms instead.`);
        setUseManual(true);
      }
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  const submitTriage = async (text) => {
    const triageText = text || transcript;
    if (!triageText.trim()) {
      setError('Please describe your symptoms before submitting.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const response = await api.triage.submit(triageText, 'en');
      setTriageResult(response.triage || response);
    } catch (err) {
      console.error('Triage error:', err);
      setError('Triage service unavailable. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetAll = () => {
    setTranscript('');
    setManualText('');
    setTriageResult(null);
    setError(null);
    setUseManual(false);
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
          <h1 className="text-xl font-bold text-slate-800">Voice Triage</h1>
          <p className="text-xs text-slate-500 font-medium">Describe symptoms by voice or text</p>
        </div>
      </header>

      {/* Voice recording UI */}
      {!triageResult && (
        <GlassSurface level={3} className="p-6 rounded-3xl text-center space-y-6">
          {!useManual ? (
            <>
              <div className="flex flex-col items-center gap-4">
                <motion.button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`w-20 h-20 rounded-full flex items-center justify-center transition-colors ${
                    isRecording 
                      ? 'bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)]' 
                      : 'bg-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.3)]'
                  }`}
                  animate={isRecording ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 1.2, repeat: Infinity }}
                >
                  {isRecording ? (
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <rect x="6" y="6" width="12" height="12" rx="2" />
                    </svg>
                  ) : (
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a3 3 0 00-3 3v7a3 3 0 006 0V5a3 3 0 00-3-3z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 10v2a7 7 0 01-14 0v-2" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19v4M8 23h8" />
                    </svg>
                  )}
                </motion.button>

                <p className="text-sm text-slate-500 font-medium">
                  {isRecording ? 'Listening... Tap to stop.' : 'Tap to describe your symptoms'}
                </p>
              </div>

              {transcript && (
                <div className="bg-white/50 p-4 rounded-2xl text-left">
                  <p className="text-xs text-slate-400 uppercase font-bold mb-1">Transcript</p>
                  <p className="text-sm text-slate-700">{transcript}</p>
                </div>
              )}

              {transcript && !isRecording && (
                <Button variant="primary" className="w-full py-4" onClick={() => submitTriage()} isLoading={isProcessing}>
                  Analyze Symptoms
                </Button>
              )}

              <button onClick={() => setUseManual(true)} className="text-xs text-blue-500 underline">
                Or type your symptoms instead
              </button>
            </>
          ) : (
            <>
              <div className="text-left">
                <label className="text-sm font-bold text-slate-700 mb-2 block">Describe your symptoms</label>
                <textarea
                  value={manualText}
                  onChange={(e) => setManualText(e.target.value)}
                  rows={4}
                  className="w-full bg-white/60 border border-white/40 rounded-2xl p-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
                  placeholder="e.g. I have a headache and slight fever since yesterday..."
                />
              </div>

              <Button variant="primary" className="w-full py-4" onClick={() => submitTriage(manualText)} isLoading={isProcessing}>
                Analyze Symptoms
              </Button>

              {hasSpeechAPI && (
                <button onClick={() => setUseManual(false)} className="text-xs text-blue-500 underline">
                  Use voice instead
                </button>
              )}
            </>
          )}

          {error && (
            <p className="text-sm text-red-500 font-medium">{error}</p>
          )}
        </GlassSurface>
      )}

      {/* Triage Result */}
      <AnimatePresence>
        {triageResult && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <TriageResponse data={triageResult} />
            <div className="mt-4">
              <Button variant="secondary" className="w-full py-4" onClick={resetAll}>
                New Assessment
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
=======
 const navigate = useNavigate();
 const [isRecording, setIsRecording] = useState(false);
 const [isProcessing, setIsProcessing] = useState(false);
 const [transcript, setTranscript] = useState('');
 const [manualText, setManualText] = useState('');
 const [triageResult, setTriageResult] = useState(null);
 const [error, setError] = useState(null);
 const [useManual, setUseManual] = useState(false);

 const recognitionRef = useRef(null);

 // Check for Web Speech API support
 const hasSpeechAPI = typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

 const startRecording = () => {
 setError(null);
 setTranscript('');
 setTriageResult(null);

 if (!hasSpeechAPI) {
 setError('Speech recognition is not supported in this browser. Please type your symptoms below.');
 setUseManual(true);
 return;
 }

 const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
 const recognition = new SpeechRecognition();
 recognition.continuous = true;
 recognition.interimResults = true;
 recognition.lang = 'en-US';

 recognition.onresult = (event) => {
 let finalTranscript = '';
 let interimTranscript = '';
 for (let i = event.resultIndex; i < event.results.length; i++) {
 if (event.results[i].isFinal) {
 finalTranscript += event.results[i][0].transcript;
 } else {
 interimTranscript += event.results[i][0].transcript;
 }
 }
 setTranscript(prev => prev + finalTranscript + interimTranscript);
 };

 recognition.onerror = (event) => {
 console.error('Speech recognition error:', event.error);
 if (event.error === 'not-allowed') {
 setError('Microphone permission denied. Please enable it in your browser settings, or type your symptoms below.');
 setUseManual(true);
 } else {
 setError(`Speech error: ${event.error}. You can type your symptoms instead.`);
 setUseManual(true);
 }
 setIsRecording(false);
 };

 recognition.onend = () => {
 setIsRecording(false);
 };

 recognitionRef.current = recognition;
 recognition.start();
 setIsRecording(true);
 };

 const stopRecording = () => {
 if (recognitionRef.current) {
 recognitionRef.current.stop();
 }
 setIsRecording(false);
 };

 const submitTriage = async (text) => {
 const triageText = text || transcript;
 if (!triageText.trim()) {
 setError('Please describe your symptoms before submitting.');
 return;
 }

 setIsProcessing(true);
 setError(null);

 try {
 const response = await api.triage.submit(triageText, 'en');
 setTriageResult(response.triage || response);
 } catch (err) {
 console.error('Triage error:', err);
 setError('Triage service unavailable. Please try again.');
 } finally {
 setIsProcessing(false);
 }
 };

 const resetAll = () => {
 setTranscript('');
 setManualText('');
 setTriageResult(null);
 setError(null);
 setUseManual(false);
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
 <h1 className="text-xl font-bold text-slate-800">Voice Triage</h1>
 <p className="text-xs text-slate-500 font-medium">Describe symptoms by voice or text</p>
 </div>
 </header>

 {/* Voice recording UI */}
 {!triageResult && (
 <GlassSurface level={3} className="p-6 rounded-3xl text-center space-y-6">
 {!useManual ? (
 <>
 <div className="flex flex-col items-center gap-4">
 <motion.button
 onClick={isRecording ? stopRecording : startRecording}
 className={`w-20 h-20 rounded-full flex items-center justify-center transition-colors ${
 isRecording 
 ? 'bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)]' 
 : 'bg-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.3)]'
 }`}
 animate={isRecording ? { scale: [1, 1.1, 1] } : {}}
 transition={{ duration: 1.2, repeat: Infinity }}
 >
 {isRecording ? (
 <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
 <rect x="6" y="6" width="12" height="12" rx="2" />
 </svg>
 ) : (
 <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
 <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a3 3 0 00-3 3v7a3 3 0 006 0V5a3 3 0 00-3-3z" />
 <path strokeLinecap="round" strokeLinejoin="round" d="M19 10v2a7 7 0 01-14 0v-2" />
 <path strokeLinecap="round" strokeLinejoin="round" d="M12 19v4M8 23h8" />
 </svg>
 )}
 </motion.button>

 <p className="text-sm text-slate-500 font-medium">
 {isRecording ? 'Listening... Tap to stop.' : 'Tap to describe your symptoms'}
 </p>
 </div>

 {transcript && (
 <div className="bg-white/50 p-4 rounded-2xl text-left">
 <p className="text-xs text-slate-400 uppercase font-bold mb-1">Transcript</p>
 <p className="text-sm text-slate-700">{transcript}</p>
 </div>
 )}

 {transcript && !isRecording && (
 <Button variant="primary" className="w-full py-4" onClick={() => submitTriage()} isLoading={isProcessing}>
 Analyze Symptoms
 </Button>
 )}

 <button onClick={() => setUseManual(true)} className="text-xs text-blue-500 underline">
 Or type your symptoms instead
 </button>
 </>
 ) : (
 <>
 <div className="text-left">
 <label className="text-sm font-bold text-slate-700 mb-2 block">Describe your symptoms</label>
 <textarea
 value={manualText}
 onChange={(e) => setManualText(e.target.value)}
 rows={4}
 className="w-full bg-white/60 border border-white/40 rounded-2xl p-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
 placeholder="e.g. I have a headache and slight fever since yesterday..."
 />
 </div>

 <Button variant="primary" className="w-full py-4" onClick={() => submitTriage(manualText)} isLoading={isProcessing}>
 Analyze Symptoms
 </Button>

 {hasSpeechAPI && (
 <button onClick={() => setUseManual(false)} className="text-xs text-blue-500 underline">
 Use voice instead
 </button>
 )}
 </>
 )}

 {error && (
 <p className="text-sm text-red-500 font-medium">{error}</p>
 )}
 </GlassSurface>
 )}

 {/* Triage Result */}
 <AnimatePresence>
 {triageResult && (
 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
 <TriageResponse data={triageResult} />
 <div className="mt-4">
 <Button variant="secondary" className="w-full py-4" onClick={resetAll}>
 New Assessment
 </Button>
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 );
>>>>>>> 04fdc8ee73d6254fc60450a5b14882f2da59d927
}

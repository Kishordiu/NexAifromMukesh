import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmergency } from '../hooks/useEmergency';
import { useAuth } from '../../../contexts/AuthContext';
import { api } from '../../../lib/api';
import GlassSurface from '../../../components/ui/GlassSurface';
import Button from '../../../components/ui/Button';
import { motion } from 'framer-motion';

export default function EmergencyFlow() {
 const navigate = useNavigate();
 const { user } = useAuth();
 const { triggerSOS, isLocating, error: locError } = useEmergency();
 
 const [countdown, setCountdown] = useState(5);
 const [isCanceled, setIsCanceled] = useState(false);
 const [hasFired, setHasFired] = useState(false);
 
 const [profile, setProfile] = useState(null);
 const [measurements, setMeasurements] = useState([]);

 // Fetch patient data for the SOS message payload
 useEffect(() => {
 const fetchData = async () => {
 try {
 const prof = await api.patient.getProfile();
 const meas = await api.patient.getLatestMeasurements();
 setProfile(prof);
 setMeasurements(meas);
 } catch (e) {
 console.error("Failed to fetch data for SOS", e);
 }
 };
 fetchData();
 }, []);

 // Countdown timer logic
 useEffect(() => {
 if (isCanceled || hasFired) return;

 if (countdown > 0) {
 const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
 return () => clearTimeout(timer);
 } else {
 // Trigger!
 setHasFired(true);
 triggerSOS(profile, measurements);
 }
 }, [countdown, isCanceled, hasFired, triggerSOS, profile, measurements]);

 const handleCancel = () => {
 setIsCanceled(true);
 };

 const handleManualTrigger = () => {
 setCountdown(0);
 setHasFired(true);
 triggerSOS(profile, measurements);
 };

 return (
 <div className="min-h-screen bg-red-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
 
 {/* Background pulsing alerts */}
 <motion.div 
 className="absolute inset-0 bg-red-600/30"
 animate={{ opacity: [0.1, 0.4, 0.1] }}
 transition={{ duration: 1, repeat: Infinity }}
 />
 
 <GlassSurface level={3} className="w-full max-w-sm p-8 rounded-[40px] text-center relative z-10 border-red-500/50 shadow-[0_0_80px_rgba(239,68,68,0.3)]">
 
 <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-6 shadow-inner">
 <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
 <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
 </svg>
 </div>

 <h1 className="text-2xl font-black text-slate-900 uppercase tracking-widest mb-2">Emergency SOS</h1>
 
 {hasFired ? (
 <div className="space-y-4 my-8">
 <p className="text-lg font-bold text-red-600">SOS Triggered</p>
 <p className="text-sm text-slate-700 font-medium">Opening your SMS app with location and vitals...</p>
 {isLocating && <p className="text-xs text-slate-500">Acquiring precise GPS coordinates...</p>}
 
 <Button variant="secondary" className="w-full mt-6" onClick={() => navigate('/home')}>
 Return to Dashboard
 </Button>
 </div>
 ) : isCanceled ? (
 <div className="space-y-4 my-8">
 <p className="text-lg font-bold text-slate-700">SOS Canceled</p>
 <Button variant="primary" className="w-full" onClick={() => navigate('/home')}>
 Return to Dashboard
 </Button>
 </div>
 ) : (
 <div className="space-y-6 my-8">
 <p className="text-sm text-slate-600 font-medium">Alerting emergency contacts in...</p>
 
 <motion.div 
 key={countdown}
 initial={{ scale: 1.5, opacity: 0 }}
 animate={{ scale: 1, opacity: 1 }}
 className="text-7xl font-black text-red-500 tabular-nums"
 >
 {countdown}
 </motion.div>

 <div className="flex flex-col gap-3 mt-8">
 <button 
 onClick={handleManualTrigger}
 className="w-full py-4 bg-red-600 text-white font-bold rounded-2xl active:scale-95 transition-transform shadow-lg shadow-red-600/30"
 >
 Trigger Now
 </button>
 
 <button 
 onClick={handleCancel}
 className="w-full py-4 bg-slate-200 text-slate-700 font-bold rounded-2xl active:scale-95 transition-transform"
 >
 Cancel
 </button>
 </div>
 </div>
 )}

 {locError && <p className="text-xs text-red-500 mt-4">{locError}</p>}
 </GlassSurface>
 </div>
 );
}

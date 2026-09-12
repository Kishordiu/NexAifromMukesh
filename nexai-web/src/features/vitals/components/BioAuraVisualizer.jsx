import React from 'react';
import { motion } from 'framer-motion';

export function BioAuraVisualizer({ progress, isScanning, bpm, signalQuality }) {
 // Determine color based on state
 let auraColor = 'border-blue-500/50';
 let glowColor = 'shadow-[0_0_40px_rgba(59,130,246,0.3)]';
 
 if (!isScanning && bpm) {
 auraColor = 'border-emerald-500/50';
 glowColor = 'shadow-[0_0_40px_rgba(16,185,129,0.3)]';
 } else if (!isScanning && signalQuality === 'FAILED') {
 auraColor = 'border-red-500/50';
 glowColor = 'shadow-[0_0_40px_rgba(239,68,68,0.3)]';
 }

 return (
 <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
 {/* Outer pulsing ring during scan */}
 {isScanning && (
 <motion.div
 className="absolute inset-0 rounded-full border-2 border-blue-400"
 animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0, 0.2] }}
 transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
 />
 )}

 {/* Progress Ring */}
 <svg className="absolute inset-0 w-full h-full -rotate-90">
 <circle
 cx="128"
 cy="128"
 r="120"
 stroke="currentColor"
 strokeWidth="6"
 fill="none"
 className="text-slate-200/20"
 />
 <motion.circle
 cx="128"
 cy="128"
 r="120"
 stroke="currentColor"
 strokeWidth="6"
 fill="none"
 strokeLinecap="round"
 className={isScanning ? "text-blue-500" : (bpm ? "text-emerald-500" : "text-slate-200/20")}
 strokeDasharray="754"
 initial={{ strokeDashoffset: 754 }}
 animate={{ strokeDashoffset: 754 - (754 * progress) / 100 }}
 transition={{ duration: 0.3, ease: "easeOut" }}
 />
 </svg>

 {/* Center content */}
 <div className={`relative z-10 w-48 h-48 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex flex-col items-center justify-center ${auraColor} ${glowColor} transition-all duration-500`}>
 {isScanning ? (
 <>
 <motion.div
 animate={{ scale: [0.95, 1.05, 0.95] }}
 transition={{ duration: 1, repeat: Infinity }}
 >
 <svg className="w-10 h-10 text-blue-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
 <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
 </svg>
 </motion.div>
 <span className="text-3xl font-bold text-white">{progress}%</span>
 <span className="text-xs text-white/70 uppercase tracking-widest mt-1">Analyzing</span>
 </>
 ) : bpm ? (
 <>
 <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
 <span className="text-5xl font-black text-white">{bpm}</span>
 </motion.div>
 <span className="text-sm font-bold text-emerald-400 uppercase tracking-widest mt-1">BPM</span>
 <span className="text-[10px] text-white/50 mt-1 uppercase">Signal: {signalQuality}</span>
 </>
 ) : (
 <div className="text-center px-4">
 <svg className="w-10 h-10 text-white/50 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
 <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
 </svg>
 <span className="text-sm text-white/70">Ready for Scan</span>
 </div>
 )}
 </div>
 </div>
 );
}

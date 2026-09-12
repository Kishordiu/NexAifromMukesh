import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../ui/Input';
import Button from '../ui/Button';

/**
 * HuskyLogin — Interactive SVG husky mascot login form.
 * 
 * The husky's pupils track the cursor. When the password field is focused,
 * the husky covers its eyes with paws. Toggling password visibility makes
 * the husky peek. Authentication uses a real API via AuthContext.
 */
export default function HuskyLogin() {
 const navigate = useNavigate();
 const location = useLocation();
 const { login, register, isAuthenticated } = useAuth();

 const leftPupilRef = useRef(null);
 const rightPupilRef = useRef(null);
 const leftEyeSocketRef = useRef(null);
 const rightEyeSocketRef = useRef(null);

 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [isPasswordFocused, setIsPasswordFocused] = useState(false);
 const [isPeeking, setIsPeeking] = useState(false);
 const [isSubmitting, setIsSubmitting] = useState(false);
 const [error, setError] = useState('');
 const [isRegisterMode, setIsRegisterMode] = useState(false);
 const [huskyMood, setHuskyMood] = useState('happy'); // happy, sad, excited

 const MAX_PUPIL_RADIUS = 6;

 // Redirect if already authenticated
 useEffect(() => {
 if (isAuthenticated) {
 const from = location.state?.from?.pathname || '/home';
 navigate(from, { replace: true });
 }
 }, [isAuthenticated, navigate, location]);

 // Eye tracking
 useEffect(() => {
 const calculatePupilOffset = (eyeElement, targetX, targetY) => {
 if (!eyeElement) return { x: 0, y: 0 };
 const rect = eyeElement.getBoundingClientRect();
 const eyeCenterX = rect.left + rect.width / 2;
 const eyeCenterY = rect.top + rect.height / 2;

 const deltaX = targetX - eyeCenterX;
 const deltaY = targetY - eyeCenterY;

 const angle = Math.atan2(deltaY, deltaX);
 const distance = Math.min(MAX_PUPIL_RADIUS, Math.hypot(deltaX, deltaY) / 20);

 return {
 x: Math.cos(angle) * distance,
 y: Math.sin(angle) * distance,
 };
 };

 const handlePointerMove = (e) => {
 if (isPasswordFocused && !isPeeking) return;

 const clientX = e.touches ? e.touches[0].clientX : e.clientX;
 const clientY = e.touches ? e.touches[0].clientY : e.clientY;

 const leftOffset = calculatePupilOffset(leftEyeSocketRef.current, clientX, clientY);
 const rightOffset = calculatePupilOffset(rightEyeSocketRef.current, clientX, clientY);

 if (leftPupilRef.current && rightPupilRef.current) {
 leftPupilRef.current.style.transform = `translate(${leftOffset.x}px, ${leftOffset.y}px)`;
 rightPupilRef.current.style.transform = `translate(${rightOffset.x}px, ${rightOffset.y}px)`;
 }
 };

 window.addEventListener('mousemove', handlePointerMove);
 window.addEventListener('touchmove', handlePointerMove, { passive: true });
 return () => {
 window.removeEventListener('mousemove', handlePointerMove);
 window.removeEventListener('touchmove', handlePointerMove);
 };
 }, [isPasswordFocused, isPeeking]);

 // Center pupils when password focused / peeking
 useEffect(() => {
 if (isPasswordFocused && !isPeeking && leftPupilRef.current && rightPupilRef.current) {
 leftPupilRef.current.style.transform = 'translate(0px, 0px)';
 rightPupilRef.current.style.transform = 'translate(0px, 0px)';
 } else if (isPeeking && leftPupilRef.current && rightPupilRef.current) {
 leftPupilRef.current.style.transform = 'translate(-3px, -4px)';
 rightPupilRef.current.style.transform = 'translate(3px, -4px)';
 }
 }, [isPasswordFocused, isPeeking]);

 const handleSubmit = useCallback(async (e) => {
 e.preventDefault();
 setError('');

 if (!email.trim() || !password.trim()) {
 setError('Please enter both email and password.');
 setHuskyMood('sad');
 return;
 }

 setIsSubmitting(true);
 setHuskyMood('happy');

 try {
 if (isRegisterMode) {
 await register(email.trim(), password);
 } else {
 await login(email.trim(), password);
 }
 setHuskyMood('excited');
 // Navigation happens via the isAuthenticated useEffect
 } catch (err) {
 setHuskyMood('sad');
 setError(err.message || 'Authentication failed. Please try again.');
 // Reset mood after 3s
 setTimeout(() => setHuskyMood('happy'), 3000);
 } finally {
 setIsSubmitting(false);
 }
 }, [email, password, login, register, isRegisterMode]);

 return (
 <div className="w-full flex flex-col items-center">
 {/* Interactive Husky Character */}
 <div className="relative z-20 w-44 -mb-4 pointer-events-none select-none" aria-hidden="true">
 <svg viewBox="0 0 240 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto overflow-visible">
 <defs>
 <clipPath id="left-eye-clip"><ellipse cx="90" cy="98" rx="14" ry="16" /></clipPath>
 <clipPath id="right-eye-clip"><ellipse cx="150" cy="98" rx="14" ry="16" /></clipPath>
 <radialGradient id="husky-iris" cx="50%" cy="50%" r="50%">
 <stop offset="0%" stopColor="#70d6ff" />
 <stop offset="70%" stopColor="#0096c7" />
 <stop offset="100%" stopColor="#023e8a" />
 </radialGradient>
 <filter id="paw-shadow" x="-10%" y="-10%" width="130%" height="130%">
 <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.25"/>
 </filter>
 </defs>

 {/* Body */}
 <path d="M 60 200 C 60 150, 180 150, 180 200 Z" fill="#2c3e50" />
 <path d="M 85 200 C 85 165, 155 165, 155 200 Z" fill="#edf2f4" />

 {/* Ears */}
 <g className={`transition-transform duration-300 ${huskyMood === 'sad' ? '' : 'animate-[ear-wiggle_6s_ease-in-out_infinite]'}`}>
 <g className="origin-[60px_65px]">
 <polygon points="50,75 25,15 80,45" fill="#2b2d42" stroke="#1d1e2c" strokeWidth="2" strokeLinejoin="round" />
 <polygon points="48,70 32,25 72,48" fill="#e0a96d" opacity="0.85" />
 <polygon points="48,70 38,35 68,52" fill="#edf2f4" />
 </g>
 </g>
 <g className="transition-transform duration-300">
 <g className="origin-[180px_65px]" style={{ transform: huskyMood === 'sad' ? 'rotate(-5deg)' : 'rotate(0deg)' }}>
 <polygon points="190,75 215,15 160,45" fill="#2b2d42" stroke="#1d1e2c" strokeWidth="2" strokeLinejoin="round" />
 <polygon points="192,70 208,25 168,48" fill="#e0a96d" opacity="0.85" />
 <polygon points="192,70 202,35 172,52" fill="#edf2f4" />
 </g>
 </g>

 {/* Head Base */}
 <path d="M 50,110 C 45,55 195,55 190,110 C 190,155 50,155 50,110 Z" fill="#2b2d42" />
 <path d="M 120,65 C 105,65 95,85 70,95 C 60,100 60,130 85,145 C 105,155 135,155 155,145 C 180,130 180,100 170,95 C 145,85 135,65 120,65 Z" fill="#f8f9fa" />
 <polygon points="120,72 113,92 127,92" fill="#2b2d42" />

 {/* Eyes — blink only when not password focused and not sad */}
 <g className={huskyMood !== 'sad' && !isPasswordFocused ? 'animate-[blink_4.5s_infinite] origin-[120px_98px]' : ''}>
 {/* Sad squint for error state */}
 {huskyMood === 'sad' ? (
 <>
 <path d="M 76,96 Q 90,104 104,96" stroke="#2b2d42" strokeWidth="3" fill="none" strokeLinecap="round" />
 <path d="M 136,96 Q 150,104 164,96" stroke="#2b2d42" strokeWidth="3" fill="none" strokeLinecap="round" />
 </>
 ) : (
 <>
 <g ref={leftEyeSocketRef}>
 <ellipse cx="90" cy="98" rx="14" ry="16" fill="#ffffff" stroke="#2b2d42" strokeWidth="2.5" />
 <g clipPath="url(#left-eye-clip)">
 <g ref={leftPupilRef} className="transition-transform duration-75 ease-out">
 <circle cx="90" cy="98" r="8" fill="url(#husky-iris)" />
 <circle cx="90" cy="98" r="4.5" fill="#111111" />
 <circle cx="87" cy="94" r="2.5" fill="#ffffff" />
 </g>
 </g>
 <path d="M 75,80 Q 90,74 102,82" stroke="#2b2d42" strokeWidth="3.5" fill="none" strokeLinecap="round" />
 <ellipse cx="88" cy="74" rx="4" ry="2.5" fill="#8d99ae" />
 </g>

 <g ref={rightEyeSocketRef}>
 <ellipse cx="150" cy="98" rx="14" ry="16" fill="#ffffff" stroke="#2b2d42" strokeWidth="2.5" />
 <g clipPath="url(#right-eye-clip)">
 <g ref={rightPupilRef} className="transition-transform duration-75 ease-out">
 <circle cx="150" cy="98" r="8" fill="url(#husky-iris)" />
 <circle cx="150" cy="98" r="4.5" fill="#111111" />
 <circle cx="147" cy="94" r="2.5" fill="#ffffff" />
 </g>
 </g>
 <path d="M 165,80 Q 150,74 138,82" stroke="#2b2d42" strokeWidth="3.5" fill="none" strokeLinecap="round" />
 <ellipse cx="152" cy="74" rx="4" ry="2.5" fill="#8d99ae" />
 </g>
 </>
 )}
 </g>

 {/* Snout */}
 <ellipse cx="120" cy="130" rx="26" ry="18" fill="#edf2f4" />
 <path d="M 110,122 C 110,118 130,118 130,122 C 130,128 123,133 120,133 C 117,133 110,128 110,122 Z" fill="#1d1e2c" />
 <ellipse cx="116" cy="122" rx="2" ry="1" fill="#4a4e69" />
 <path d="M 120,133 L 120,140 Q 112,144 105,138 M 120,140 Q 128,144 135,138" stroke="#1d1e2c" strokeWidth="2" fill="none" strokeLinecap="round" />
 
 {/* Mouth - happy tongue or sad droop */}
 {huskyMood === 'sad' ? (
 <path d="M 112,144 Q 120,140 128,144" stroke="#1d1e2c" strokeWidth="1.5" fill="none" strokeLinecap="round" />
 ) : (
 <path className={`transition-opacity duration-300 ${!isPasswordFocused ? 'opacity-100' : 'opacity-0'}`} d="M 116,140 C 116,147 124,147 124,140 Z" fill="#ff758f" />
 )}

 {/* Paws — cover eyes during password input */}
 <g filter="url(#paw-shadow)">
 <g className="origin-bottom transition-transform duration-500 ease-out" style={{ transform: isPasswordFocused && !isPeeking ? 'translateY(-98px) translateX(12px) rotate(18deg)' : isPeeking ? 'translateY(-80px) translateX(-6px) rotate(-10deg)' : 'translateY(30px)' }}>
 <ellipse cx="75" cy="210" rx="22" ry="18" fill="#edf2f4" stroke="#2b2d42" strokeWidth="2" />
 <circle cx="68" cy="204" r="3.5" fill="#8d99ae" />
 <circle cx="75" cy="200" r="3.5" fill="#8d99ae" />
 <circle cx="82" cy="204" r="3.5" fill="#8d99ae" />
 <ellipse cx="75" cy="214" rx="7" ry="5" fill="#8d99ae" />
 </g>
 <g className="origin-bottom transition-transform duration-500 ease-out" style={{ transform: isPasswordFocused && !isPeeking ? 'translateY(-98px) translateX(-12px) rotate(-18deg)' : isPeeking ? 'translateY(-80px) translateX(6px) rotate(10deg)' : 'translateY(30px)' }}>
 <ellipse cx="165" cy="210" rx="22" ry="18" fill="#edf2f4" stroke="#2b2d42" strokeWidth="2" />
 <circle cx="158" cy="204" r="3.5" fill="#8d99ae" />
 <circle cx="165" cy="200" r="3.5" fill="#8d99ae" />
 <circle cx="172" cy="204" r="3.5" fill="#8d99ae" />
 <ellipse cx="165" cy="214" rx="7" ry="5" fill="#8d99ae" />
 </g>
 </g>
 </svg>
 </div>

 {/* Login Form */}
 <form
 onSubmit={handleSubmit}
 className="w-full glass-surface rounded-[30px] p-6 pt-8 relative z-10"
 noValidate
 >
 <h1 className="text-2xl font-bold text-center text-slate-800">
 {isRegisterMode ? 'Create Account' : 'Welcome Back'}
 </h1>
 <p className="text-center text-sm text-slate-500 mb-6 font-medium">
 {isRegisterMode ? 'Your husky will guard your data.' : 'Your husky is keeping watch.'}
 </p>

 {error && (
 <div className="mb-4 p-3 rounded-[14px] bg-red-50/80 border border-red-200 text-red-700 text-sm font-medium text-center" role="alert">
 {error}
 </div>
 )}

 <div className="space-y-4">
 <Input
 label="Email"
 type="email"
 value={email}
 onChange={(e) => { setEmail(e.target.value); setError(''); }}
 onFocus={() => { setIsPasswordFocused(false); setIsPeeking(false); }}
 placeholder="you@example.com"
 autoComplete="email"
 required
 />

 <Input
 label="Password"
 type="password"
 value={password}
 onChange={(e) => { setPassword(e.target.value); setError(''); }}
 onFocus={() => setIsPasswordFocused(true)}
 onBlur={() => { setIsPasswordFocused(false); setIsPeeking(false); }}
 placeholder="Enter your password"
 autoComplete={isRegisterMode ? 'new-password' : 'current-password'}
 required
 />
 </div>

 <Button
 type="submit"
 variant="primary"
 size="lg"
 isLoading={isSubmitting}
 className="w-full mt-6"
 >
 {isRegisterMode ? 'Create Account' : 'Sign In'}
 </Button>

 <p className="text-center text-sm text-slate-500 mt-4">
 {isRegisterMode ? 'Already have an account?' : "Don't have an account?"}{' '}
 <button
 type="button"
 onClick={() => { setIsRegisterMode(!isRegisterMode); setError(''); }}
 className="text-blue-500 font-semibold hover:text-blue-600 focus:outline-none focus:underline"
 >
 {isRegisterMode ? 'Sign In' : 'Create Account'}
 </button>
 </p>
 </form>

 {/* Keyframes for husky animations */}
 <style>{`
 @keyframes blink { 0%, 96%, 100% { transform: scaleY(1); } 98% { transform: scaleY(0.1); } }
 @keyframes ear-wiggle { 0%, 90%, 100% { transform: rotate(0deg); } 93% { transform: rotate(-8deg); } 96% { transform: rotate(4deg); } }
 `}</style>
 </div>
 );
}

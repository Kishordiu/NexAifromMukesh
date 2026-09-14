import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

const TABS = [
<<<<<<< HEAD
  { id: 'home', path: '/home', icon: 'M5 11.5 12 5l7 6.5V19a1 1 0 0 1-1 1h-3.5v-5h-5v5H6a1 1 0 0 1-1-1v-7.5Z', label: 'Home' },
  { id: 'scan', path: '/scan', icon: 'M4 7V5a1 1 0 0 1 1-1h2m9 0h2a1 1 0 0 1 1 1v2m0 10v2a1 1 0 0 1-1 1h-2m-9 0H5a1 1 0 0 1-1-1v-2M8 12a4 4 0 1 0 8 0 4 4 0 0 0-8 0Z', label: 'Scan' },
  { id: 'triage', path: '/triage', icon: 'M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z M19 10v2a7 7 0 0 1-14 0v-2 M12 19v4 M8 23h8', label: 'Triage' },
  { id: 'reports', path: '/reports', icon: 'M7 3h7l3 3v15H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm7 0v4h4M8 12h8M8 16h6', label: 'Reports' },
  { id: 'settings', path: '/settings', icon: 'M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Zm7.2-3.2a7.2 7.2 0 0 0-.1-1l1.6-1.2-1.8-3.1-1.9.8a7 7 0 0 0-1.8-1L15 4.5h-3.6l-.3 2a7 7 0 0 0-1.8 1l-1.9-.8-1.8 3.1L7.2 11a7.2 7.2 0 0 0 0 2l-1.6 1.2 1.8 3.1 1.9-.8a7 7 0 0 0 1.8 1l.3 2H15l.3-2a7 7 0 0 0 1.8-1l1.9.8 1.8-3.1-1.6-1.2c.1-.3.1-.7.1-1Z', label: 'Settings' }
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(0);
  const containerRef = useRef(null);
  
  const [dimensions, setDimensions] = useState({ 
    width: typeof window !== 'undefined' ? Math.min(window.innerWidth, 500) : 380, 
    height: 75 
  });
  
  const socketRadius = 42;
  const socketDepth = 28;
  const cpOffset = socketRadius * 0.45;

  const x = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 25 });

  // Sync active tab from URL
  useEffect(() => {
    const currentIndex = TABS.findIndex(t => location.pathname.startsWith(t.path));
    if (currentIndex !== -1) setActiveTab(currentIndex);
  }, [location]);

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const slotWidth = dimensions.width / TABS.length;

  useEffect(() => {
    const targetX = (activeTab * slotWidth) + (slotWidth / 2);
    x.set(targetX);
  }, [activeTab, slotWidth, x]);

  const generatePath = (currentX) => {
    const left = Math.max(0, currentX - socketRadius);
    const right = Math.min(dimensions.width, currentX + socketRadius);
    
    return `
      M 0,0
      L ${left},0
      C ${currentX - cpOffset},0 ${currentX - cpOffset},${socketDepth} ${currentX},${socketDepth}
      C ${currentX + cpOffset},${socketDepth} ${currentX + cpOffset},0 ${right},0
      L ${dimensions.width},0
      L ${dimensions.width},${dimensions.height}
      L 0,${dimensions.height}
      Z
    `.replace(/\s+/g, ' ').trim();
  };

  const pathContent = useTransform(springX, (latestX) => generatePath(latestX));
  const beadX = useTransform(springX, (latestX) => latestX - 22);

  const handleDragEnd = (event, info) => {
    const predictedX = x.get() + info.offset.x + (info.velocity.x * 0.2);
    let closestIdx = 0;
    let minDistance = Infinity;

    for (let i = 0; i < TABS.length; i++) {
      const targetX = (i * slotWidth) + (slotWidth / 2);
      const distance = Math.abs(predictedX - targetX);
      if (distance < minDistance) {
        minDistance = distance;
        closestIdx = i;
      }
    }

    setActiveTab(closestIdx);
    navigate(TABS[closestIdx].path);
    x.set((closestIdx * slotWidth) + (slotWidth / 2));
  };

  // Haptic feedback
  const triggerHaptic = () => {
    if (navigator.vibrate) navigator.vibrate(8);
  };

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 px-2 pb-2 pointer-events-none flex justify-center">
      <div 
        ref={containerRef}
        className="relative w-full max-w-lg h-[75px] pointer-events-auto filter drop-shadow-xl"
        role="navigation"
        aria-label="Bottom Navigation"
      >
        <svg 
          width="100%" 
          height="100%" 
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          preserveAspectRatio="none"
          className="absolute inset-0"
        >
          <defs>
            <linearGradient id="nav-glass" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.55)" />
              <stop offset="100%" stopColor="rgba(255, 255, 255, 0.35)" />
            </linearGradient>
          </defs>
          
          <motion.path
            d={pathContent}
            fill="url(#nav-glass)"
            stroke="rgba(255, 255, 255, 0.7)"
            strokeWidth="1"
            style={{ backdropFilter: 'blur(24px)' }}
          />
        </svg>

        {/* Draggable Bead */}
        <motion.div
          className="absolute top-0 w-11 h-11 rounded-full cursor-grab active:cursor-grabbing z-20 flex items-center justify-center bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.6)] border-2 border-white/80"
          style={{ x: beadX, y: -20 }}
          drag="x"
          dragConstraints={containerRef}
          dragElastic={0.15}
          dragMomentum={false}
          onDragEnd={handleDragEnd}
          whileTap={{ scale: 1.12 }}
        >
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d={TABS[activeTab].icon} />
          </svg>
        </motion.div>

        {/* Tab buttons with labels */}
        <div className="absolute inset-0 flex" role="tablist">
          {TABS.map((tab, idx) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === idx}
              onClick={() => {
                triggerHaptic();
                setActiveTab(idx);
                navigate(tab.path);
              }}
              className="flex-1 h-full flex flex-col items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 rounded-t-3xl transition-colors group"
              style={{ WebkitTapHighlightColor: 'transparent' }}
              aria-label={tab.label}
            >
              <motion.div 
                initial={false}
                animate={{ 
                  y: activeTab === idx ? 24 : 0, 
                  opacity: activeTab === idx ? 0 : 0.55,
                  scale: activeTab === idx ? 0.5 : 1
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="flex flex-col items-center gap-0.5"
              >
                <svg className="w-5 h-5 text-slate-700 group-hover:text-slate-900 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
                </svg>
                <span className="text-[9px] font-semibold text-slate-500 group-hover:text-slate-700 uppercase tracking-wider">{tab.label}</span>
              </motion.div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
=======
 { id: 'home', path: '/home', icon: 'M5 11.5 12 5l7 6.5V19a1 1 0 0 1-1 1h-3.5v-5h-5v5H6a1 1 0 0 1-1-1v-7.5Z', label: 'Home' },
 { id: 'scan', path: '/scan', icon: 'M4 7V5a1 1 0 0 1 1-1h2m9 0h2a1 1 0 0 1 1 1v2m0 10v2a1 1 0 0 1-1 1h-2m-9 0H5a1 1 0 0 1-1-1v-2M8 12a4 4 0 1 0 8 0 4 4 0 0 0-8 0Z', label: 'Scan' },
 { id: 'triage', path: '/triage', icon: 'M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z M19 10v2a7 7 0 0 1-14 0v-2 M12 19v4 M8 23h8', label: 'Triage' },
 { id: 'reports', path: '/reports', icon: 'M7 3h7l3 3v15H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm7 0v4h4M8 12h8M8 16h6', label: 'Reports' },
 { id: 'settings', path: '/settings', icon: 'M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Zm7.2-3.2a7.2 7.2 0 0 0-.1-1l1.6-1.2-1.8-3.1-1.9.8a7 7 0 0 0-1.8-1L15 4.5h-3.6l-.3 2a7 7 0 0 0-1.8 1l-1.9-.8-1.8 3.1L7.2 11a7.2 7.2 0 0 0 0 2l-1.6 1.2 1.8 3.1 1.9-.8a7 7 0 0 0 1.8 1l.3 2H15l.3-2a7 7 0 0 0 1.8-1l1.9.8 1.8-3.1-1.6-1.2c.1-.3.1-.7.1-1Z', label: 'Settings' }
];

export default function BottomNav() {
 const navigate = useNavigate();
 const location = useLocation();
 const [activeTab, setActiveTab] = useState(0);
 const containerRef = useRef(null);
 
 const [dimensions, setDimensions] = useState({ 
 width: typeof window !== 'undefined' ? Math.min(window.innerWidth, 500) : 380, 
 height: 75 
 });
 
 const socketRadius = 42;
 const socketDepth = 28;
 const cpOffset = socketRadius * 0.45;

 const x = useMotionValue(0);
 const springX = useSpring(x, { stiffness: 200, damping: 25 });

 // Sync active tab from URL
 useEffect(() => {
 const currentIndex = TABS.findIndex(t => location.pathname.startsWith(t.path));
 if (currentIndex !== -1) setActiveTab(currentIndex);
 }, [location]);

 // Resize handler
 useEffect(() => {
 const handleResize = () => {
 if (containerRef.current) {
 setDimensions({
 width: containerRef.current.offsetWidth,
 height: containerRef.current.offsetHeight
 });
 }
 };
 handleResize();
 window.addEventListener('resize', handleResize);
 return () => window.removeEventListener('resize', handleResize);
 }, []);

 const slotWidth = dimensions.width / TABS.length;

 useEffect(() => {
 const targetX = (activeTab * slotWidth) + (slotWidth / 2);
 x.set(targetX);
 }, [activeTab, slotWidth, x]);

 const generatePath = (currentX) => {
 const left = Math.max(0, currentX - socketRadius);
 const right = Math.min(dimensions.width, currentX + socketRadius);
 
 return `
 M 0,0
 L ${left},0
 C ${currentX - cpOffset},0 ${currentX - cpOffset},${socketDepth} ${currentX},${socketDepth}
 C ${currentX + cpOffset},${socketDepth} ${currentX + cpOffset},0 ${right},0
 L ${dimensions.width},0
 L ${dimensions.width},${dimensions.height}
 L 0,${dimensions.height}
 Z
 `.replace(/\s+/g, ' ').trim();
 };

 const pathContent = useTransform(springX, (latestX) => generatePath(latestX));
 const beadX = useTransform(springX, (latestX) => latestX - 22);

 const handleDragEnd = (event, info) => {
 const predictedX = x.get() + info.offset.x + (info.velocity.x * 0.2);
 let closestIdx = 0;
 let minDistance = Infinity;

 for (let i = 0; i < TABS.length; i++) {
 const targetX = (i * slotWidth) + (slotWidth / 2);
 const distance = Math.abs(predictedX - targetX);
 if (distance < minDistance) {
 minDistance = distance;
 closestIdx = i;
 }
 }

 setActiveTab(closestIdx);
 navigate(TABS[closestIdx].path);
 x.set((closestIdx * slotWidth) + (slotWidth / 2));
 };

 // Haptic feedback
 const triggerHaptic = () => {
 if (navigator.vibrate) navigator.vibrate(8);
 };

 return (
 <div className="fixed bottom-0 left-0 w-full z-50 px-2 pb-2 pointer-events-none flex justify-center">
 <div 
 ref={containerRef}
 className="relative w-full max-w-lg h-[75px] pointer-events-auto filter drop-shadow-xl"
 role="navigation"
 aria-label="Bottom Navigation"
 >
 <svg 
 width="100%" 
 height="100%" 
 viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
 preserveAspectRatio="none"
 className="absolute inset-0"
 >
 <defs>
 <linearGradient id="nav-glass" x1="0" y1="0" x2="1" y2="1">
 <stop offset="0%" stopColor="rgba(255, 255, 255, 0.55)" />
 <stop offset="100%" stopColor="rgba(255, 255, 255, 0.35)" />
 </linearGradient>
 </defs>
 
 <motion.path
 d={pathContent}
 fill="url(#nav-glass)"
 stroke="rgba(255, 255, 255, 0.7)"
 strokeWidth="1"
 style={{ backdropFilter: 'blur(24px)' }}
 />
 </svg>

 {/* Draggable Bead */}
 <motion.div
 className="absolute top-0 w-11 h-11 rounded-full cursor-grab active:cursor-grabbing z-20 flex items-center justify-center bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.6)] border-2 border-white/80"
 style={{ x: beadX, y: -20 }}
 drag="x"
 dragConstraints={containerRef}
 dragElastic={0.15}
 dragMomentum={false}
 onDragEnd={handleDragEnd}
 whileTap={{ scale: 1.12 }}
 >
 <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
 <path strokeLinecap="round" strokeLinejoin="round" d={TABS[activeTab].icon} />
 </svg>
 </motion.div>

 {/* Tab buttons with labels */}
 <div className="absolute inset-0 flex" role="tablist">
 {TABS.map((tab, idx) => (
 <button
 key={tab.id}
 role="tab"
 aria-selected={activeTab === idx}
 onClick={() => {
 triggerHaptic();
 setActiveTab(idx);
 navigate(tab.path);
 }}
 className="flex-1 h-full flex flex-col items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 rounded-t-3xl transition-colors group"
 style={{ WebkitTapHighlightColor: 'transparent' }}
 aria-label={tab.label}
 >
 <motion.div 
 initial={false}
 animate={{ 
 y: activeTab === idx ? 24 : 0, 
 opacity: activeTab === idx ? 0 : 0.55,
 scale: activeTab === idx ? 0.5 : 1
 }}
 transition={{ type: 'spring', stiffness: 300, damping: 30 }}
 className="flex flex-col items-center gap-0.5"
 >
 <svg className="w-5 h-5 text-slate-700 group-hover:text-slate-900 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
 <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
 </svg>
 <span className="text-[9px] font-semibold text-slate-500 group-hover:text-slate-700 uppercase tracking-wider">{tab.label}</span>
 </motion.div>
 </button>
 ))}
 </div>
 </div>
 </div>
 );
>>>>>>> 04fdc8ee73d6254fc60450a5b14882f2da59d927
}

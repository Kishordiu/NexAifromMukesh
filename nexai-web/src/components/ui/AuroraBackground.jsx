import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

export default function AuroraBackground({ children }) {
  const { accent } = useTheme();

  return (
    <div className="relative min-h-screen w-full bg-[#f8fafc] overflow-hidden">
      {/* Background Noise for texture */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.015] mix-blend-multiply pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />
      
      {/* Aurora Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{
            x: ['-5%', '5%', '-5%'],
            y: ['-5%', '5%', '-5%'],
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-[20%] -right-[10%] w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] rounded-full mix-blend-multiply filter blur-[100px] opacity-20"
          style={{ background: `radial-gradient(circle, ${accent} 0%, transparent 70%)` }}
        />
        <motion.div
          animate={{
            x: ['5%', '-5%', '5%'],
            y: ['5%', '-5%', '5%'],
            scale: [1.05, 1, 1.05],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-[20%] -left-[10%] w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] rounded-full mix-blend-multiply filter blur-[120px] opacity-[0.15]"
          style={{ background: `radial-gradient(circle, #8B5CF6 0%, transparent 70%)` }}
        />
      </div>

      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}

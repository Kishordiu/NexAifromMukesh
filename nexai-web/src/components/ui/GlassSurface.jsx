import React from 'react';
import { motion } from 'framer-motion';

/**
 * Reusable GlassSurface primitive.
 * @param {Object} props
 * @param {1|2|3|4} props.level - Glass blur/shadow hierarchy level
 * @param {string} props.className - Additional Tailwind classes
 * @param {boolean} props.hover - Enable hover elevation
 * @param {boolean} props.glow - Enable subtle color glow
 * @param {boolean} props.interactive - If true, renders as a button or motion.button
 */
export default function GlassSurface({
  children,
  level = 2,
  className = '',
  hover = false,
  glow = false,
  interactive = false,
  onClick,
  ...props
}) {
  const blurClasses = {
    1: 'backdrop-blur-[12px]',
    2: 'backdrop-blur-[16px]',
    3: 'backdrop-blur-[24px]',
    4: 'backdrop-blur-[36px]',
  };

  const shadowClasses = {
    1: 'shadow-[0_4px_20px_rgba(0,0,0,0.03)]',
    2: 'shadow-[0_8px_32px_rgba(0,0,0,0.06)]',
    3: 'shadow-[0_16px_48px_rgba(0,0,0,0.08)]',
    4: 'shadow-[0_24px_64px_rgba(0,0,0,0.12)]',
  };

  const baseClasses = `
    relative overflow-hidden
    bg-white/45 border border-white/70 
    ${blurClasses[level]} ${shadowClasses[level]}
    shadow-[inset_0_2px_4px_rgba(255,255,255,0.9)]
    ${hover ? 'transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.1)]' : ''}
    ${className}
  `;

  // Optional subtle background glow
  const renderGlow = () => {
    if (!glow) return null;
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none" />
    );
  };

  if (interactive) {
    return (
      <motion.button 
        className={baseClasses}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        {...props}
      >
        {renderGlow()}
        <div className="relative z-10 w-full text-left">{children}</div>
      </motion.button>
    );
  }

  return (
    <div className={baseClasses} {...props}>
      {renderGlow()}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

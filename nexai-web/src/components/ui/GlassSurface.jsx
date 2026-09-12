import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Reusable GlassSurface primitive for DiuMed.
 * Follows NordPixel-inspired "Frosted Crystal + Soft Light" aesthetic.
 * 
 * @param {Object} props
 * @param {1|2|3|4} props.level - Glass hierarchy (1: inputs/badges, 2: cards, 3: panels, 4: modals)
 * @param {boolean} props.interactive - If true, renders as a motion.button
 * @param {boolean} props.hover - Enable subtle hover tilt/highlight (desktop mostly)
 * @param {boolean} props.glow - Enable subtle aurora glow
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
  const cn = (...inputs) => twMerge(clsx(inputs));

  const levelStyles = {
    1: 'bg-white/60 backdrop-blur-[8px] border-white/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)]',
    2: 'bg-white/40 backdrop-blur-[16px] border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)]',
    3: 'bg-white/30 backdrop-blur-[24px] border-white/50 shadow-[0_16px_48px_rgba(0,0,0,0.06)]',
    4: 'bg-white/20 backdrop-blur-[32px] border-white/40 shadow-[0_24px_64px_rgba(0,0,0,0.08)]'
  };

  const baseClasses = cn(
    'relative overflow-hidden border',
    'shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),inset_0_2px_4px_rgba(255,255,255,0.4)]',
    levelStyles[level],
    hover && 'transition-all duration-500 ease-out hover:shadow-[0_16px_48px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.9)] hover:-translate-y-[2px]',
    className
  );

  const renderGlow = () => {
    if (!glow) return null;
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/5 to-transparent pointer-events-none opacity-50 mix-blend-overlay" />
    );
  };

  if (interactive) {
    return (
      <motion.button 
        className={baseClasses}
        whileTap={{ scale: 0.985 }}
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

import React from 'react';
import { motion } from 'framer-motion';

/**
 * Reusable motion wrapper for staged reveals.
 * Follows NordPixel's "restrained animation" rule.
 * 
 * @param {Object} props
 * @param {number} props.delay - Delay before starting animation (seconds)
 * @param {string} props.direction - 'up', 'down', 'left', 'right', 'none'
 * @param {number} props.distance - Distance to slide (pixels)
 * @param {number} props.duration - Duration of the animation
 */
export default function MotionReveal({ 
  children, 
  delay = 0, 
  direction = 'up',
  distance = 20,
  duration = 0.8,
  className = ''
}) {
  const getInitialOffset = () => {
    switch (direction) {
      case 'up': return { y: distance };
      case 'down': return { y: -distance };
      case 'left': return { x: distance };
      case 'right': return { x: -distance };
      default: return {};
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...getInitialOffset() }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ 
        duration, 
        delay, 
        ease: [0.16, 1, 0.3, 1] // Custom refined spring-like easing without the bounce
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

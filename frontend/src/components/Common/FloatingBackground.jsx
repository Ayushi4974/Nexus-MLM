import React from 'react';
import { motion } from 'framer-motion';

export const FloatingBackground = () => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      {/* Glowing Orb 1 - Neon Cyan */}
      <motion.div
        className="glowing-orb orb-cyan"
        style={{ top: '8%', left: '4%' }}
        animate={{
          x: [0, 90, -40, 0],
          y: [0, -60, 70, 0],
          scale: [1, 1.15, 0.9, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Glowing Orb 2 - Electric Indigo */}
      <motion.div
        className="glowing-orb orb-purple"
        style={{ bottom: '15%', right: '8%' }}
        animate={{
          x: [0, -110, 60, 0],
          y: [0, 70, -90, 0],
          scale: [1, 0.85, 1.15, 1],
        }}
        transition={{
          duration: 26,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Glowing Orb 3 - Soft Emerald */}
      <motion.div
        className="glowing-orb orb-green"
        style={{ top: '50%', left: '40%' }}
        animate={{
          x: [0, 50, -60, 0],
          y: [0, 80, -40, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{
          duration: 19,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Futuristic Grid Layer */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'radial-gradient(rgba(0, 229, 255, 0.015) 1.5px, transparent 1.5px)',
          backgroundSize: '32px 32px',
          opacity: 0.85,
        }}
      />
    </div>
  );
};

export default FloatingBackground;

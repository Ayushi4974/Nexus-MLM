import React, { useEffect, useRef } from 'react';
import { useMotionValue, useSpring, useInView } from 'framer-motion';

export const AnimatedCounter = ({ value, to, decimals, suffix = '', prefix = '' }) => {
  const ref = useRef(null);
  
  const targetVal = value !== undefined ? value : to;
  const stringValue = targetVal != null ? targetVal.toString() : '0';
  const numericString = stringValue.replace(/[^0-9.]/g, '');
  const numericValue = parseFloat(numericString) || 0;
  
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 25,
    stiffness: 75,
  });
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (isInView) {
      motionValue.set(numericValue);
    }
  }, [isInView, numericValue, motionValue]);

  useEffect(() => {
    return springValue.on('change', (latest) => {
      if (ref.current) {
        let displayValue;
        if (decimals !== undefined) {
          displayValue = latest.toFixed(decimals);
        } else {
          displayValue = Number.isInteger(numericValue) 
            ? Math.floor(latest) 
            : latest.toFixed(1);
        }
          
        ref.current.textContent = `${prefix}${parseFloat(displayValue).toLocaleString(undefined, {
          minimumFractionDigits: decimals !== undefined ? decimals : (Number.isInteger(numericValue) ? 0 : 1),
          maximumFractionDigits: decimals !== undefined ? decimals : (Number.isInteger(numericValue) ? 0 : 1),
        })}${suffix}`;
      }
    });
  }, [springValue, prefix, suffix, numericValue, decimals]);

  return <span ref={ref}>{prefix}0{suffix}</span>;
};

export default AnimatedCounter;

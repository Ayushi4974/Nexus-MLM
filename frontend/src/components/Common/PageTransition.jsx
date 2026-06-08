import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';

export const PageTransition = ({ children }) => {
  const containerRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    // Reset window scroll position on route change
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      // Animate the container entrance smoothly
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 15, scale: 0.99 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: 'power3.out',
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [location.pathname]);

  return (
    <div ref={containerRef} style={{ width: '100%', display: 'flex', flexDirection: 'column', minHeight: '100vh', opacity: 0 }}>
      {children}
    </div>
  );
};

export default PageTransition;

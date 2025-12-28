import React, { useEffect, useRef } from 'react';
import { ReactLenis } from 'lenis/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import 'lenis/dist/lenis.css'; // Optional: Basic css for lenis if needed

const SmoothScroll = ({ children }) => {
  const lenisRef = useRef();

  useEffect(() => {
    // ⚡ CRITICAL FIX: Sync Lenis Scroll with GSAP ScrollTrigger
    // Yeh code batata hai GSAP ko ki Lenis scroll update hua hai
    function update(time) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);

    // Disable default GSAP lag smoothing to avoid conflicts
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
    };
  }, []);

  return (
    <ReactLenis 
        ref={lenisRef} 
        root 
        options={{ 
            lerp: 0.08,   // Thoda aur smooth (Lower = Smoother/Slower)
            duration: 1.2, 
            smoothTouch: true, // Mobile pe bhi smooth
            wheelMultiplier: 1 // Scroll speed control
        }}
    >
      {children}
    </ReactLenis>
  );
};

export default SmoothScroll;
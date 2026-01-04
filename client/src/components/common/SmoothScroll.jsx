import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SmoothScroll = ({ children }) => {
  const lenisRef = useRef(null);

  useEffect(() => {
    // 1. Optimized Lenis Settings (Performance Focus)
    const lenis = new Lenis({
      duration: 1.2,             // 1.5 se kam kiya taaki lag feel na ho
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 0.8,      // Thoda kam sensitivity for better control
      smoothTouch: false,        // Mobile pe native scroll hi best hai
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;

    // 2. Sync ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // 3. Optimized Ticker
    // lagSmoothing(0) hata diya kyunki ye kabhi-kabhi jump maarta hai
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    // Cleanup
    return () => {
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
      lenis.destroy();
    };
  }, []);

  return (
    <div className="w-full min-h-screen">
      {children}
    </div>
  );
};

export default SmoothScroll;
import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger to keep everything in sync
gsap.registerPlugin(ScrollTrigger);

const SmoothScroll = ({ children }) => {
  const lenisRef = useRef(null);

  useEffect(() => {
    // 1. Initialize Lenis with "Premium" Feel Settings
    const lenis = new Lenis({
      duration: 1.5,             // Scroll duration (Higher = Smoother/Slower)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential easing function
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,        // Mouse sensitivity
      smoothTouch: false,        // Mobile pe native scroll better lagta hai (Performance)
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    // 2. Sync Lenis scroll with GSAP ScrollTrigger
    // Har bar jab Lenis scroll kare, ScrollTrigger ko update karo
    lenis.on('scroll', ScrollTrigger.update);

    // 3. Connect GSAP Ticker to Lenis (The "Heartbeat" Optimization)
    // Isse React state updates aur scroll loop clash nahi karenge
    const update = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(update);

    // Disable lag smoothing in GSAP to prevent jumpy scroll on heavy loads
    gsap.ticker.lagSmoothing(0);

    // Cleanup
    return () => {
      gsap.ticker.remove(update);
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
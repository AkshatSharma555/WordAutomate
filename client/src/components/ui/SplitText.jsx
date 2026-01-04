import React, { useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SplitText = ({ 
  text, 
  className = '', 
  delay = 0, 
  duration = 1.0, // Thoda lamba duration for elegance
  stagger = 0.02, // Fast stagger for fluidity (Lag fix)
  startFrom = 'top 90%' 
}) => {
  const containerRef = useRef(null);

  // Text Splitting Logic
  const splitContent = useMemo(() => {
    return text.split('').map((char, index) => (
      <span 
        key={index} 
        className="inline-block will-change-transform opacity-0 translate-y-4" // Initial CSS State (prevents flash)
        style={{ whiteSpace: 'pre' }} 
      >
        {char}
      </span>
    ));
  }, [text]);

  useGSAP(() => {
    const el = containerRef.current;
    if (!el) return;

    const chars = el.querySelectorAll('span');

    // Kill any existing animations to prevent conflict
    gsap.killTweensOf(chars);

    // Smooth Animation Logic
    gsap.to(chars, {
        y: 0,
        opacity: 1,
        duration: duration,
        stagger: stagger,
        ease: 'power3.out', // Smoothest ease (Butter feel)
        delay: delay,
        scrollTrigger: {
          trigger: el,
          start: startFrom,
          toggleActions: 'play none none reverse'
        }
    });

  }, { scope: containerRef, dependencies: [text, delay] });

  return (
    <div ref={containerRef} className={`${className} inline-block overflow-hidden`}>
      {splitContent}
    </div>
  );
};

export default SplitText;
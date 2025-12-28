import React, { useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SplitText = ({ 
  text, 
  className = '', 
  delay = 0, 
  duration = 0.8, // Thoda slow aur smooth
  stagger = 0.04, // Har letter ke beech ka gap
  startFrom = 'top 80%' // Kab start ho
}) => {
  const containerRef = useRef(null);

  // Text ko characters mein todna (Free Logic)
  const splitContent = useMemo(() => {
    return text.split('').map((char, index) => (
      <span 
        key={index} 
        className="inline-block will-change-transform opacity-0" // Default hidden
        style={{ whiteSpace: 'pre' }} // Spaces preserve karne ke liye
      >
        {char}
      </span>
    ));
  }, [text]);

  useGSAP(() => {
    const el = containerRef.current;
    if (!el) return;

    const chars = el.querySelectorAll('span');

    gsap.fromTo(chars, 
      { 
        y: 50, // Neeche se aayega
        opacity: 0,
        rotateX: -90 // Thoda 3D effect
      },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        duration: duration,
        stagger: stagger,
        ease: 'back.out(1.7)', // Bounce effect
        delay: delay, // Agar wait karana ho
        scrollTrigger: {
          trigger: el,
          start: startFrom,
          toggleActions: 'play none none reverse'
        }
      }
    );

  }, { scope: containerRef, dependencies: [text, delay, duration] });

  return (
    <div ref={containerRef} className={`${className} inline-block`}>
      {splitContent}
    </div>
  );
};

export default SplitText;
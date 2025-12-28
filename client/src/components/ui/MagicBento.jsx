import { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { cn } from '../../utils/cn'; 

const DEFAULT_PARTICLE_COUNT = 6; // Optimized count
const DEFAULT_SPOTLIGHT_RADIUS = 300;
const MOBILE_BREAKPOINT = 768;

// --- Helper Functions (Same as before) ---
const createParticleElement = (x, y, color) => {
  const el = document.createElement('div');
  el.className = 'particle';
  el.style.cssText = `position:absolute;width:4px;height:4px;border-radius:50%;background:rgba(${color},1);box-shadow:0 0 6px rgba(${color},0.6);pointer-events:none;z-index:100;left:${x}px;top:${y}px;`;
  return el;
};

const calculateSpotlightValues = radius => ({ proximity: radius * 0.5, fadeDistance: radius * 0.75 });

const updateCardGlowProperties = (card, mouseX, mouseY, glow, radius) => {
  const rect = card.getBoundingClientRect();
  const relativeX = ((mouseX - rect.left) / rect.width) * 100;
  const relativeY = ((mouseY - rect.top) / rect.height) * 100;
  card.style.setProperty('--glow-x', `${relativeX}%`);
  card.style.setProperty('--glow-y', `${relativeY}%`);
  card.style.setProperty('--glow-intensity', glow.toString());
  card.style.setProperty('--glow-radius', `${radius}px`);
};

// --- Particle Card ---
const ParticleCard = ({ children, className = '', disableAnimations = false, style, particleCount, glowColor, enableTilt, clickEffect, enableMagnetism }) => {
  const cardRef = useRef(null);
  const particlesRef = useRef([]);
  const timeoutsRef = useRef([]);
  const isHoveredRef = useRef(false);
  const memoizedParticles = useRef([]);
  const particlesInitialized = useRef(false);
  const magnetismAnimationRef = useRef(null);

  const initializeParticles = useCallback(() => {
    if (particlesInitialized.current || !cardRef.current) return;
    const { width, height } = cardRef.current.getBoundingClientRect();
    memoizedParticles.current = Array.from({ length: particleCount }, () => createParticleElement(Math.random() * width, Math.random() * height, glowColor));
    particlesInitialized.current = true;
  }, [particleCount, glowColor]);

  const clearAllParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    magnetismAnimationRef.current?.kill();
    particlesRef.current.forEach(particle => {
      gsap.to(particle, { scale: 0, opacity: 0, duration: 0.3, ease: 'back.in(1.7)', onComplete: () => particle.remove() });
    });
    particlesRef.current = [];
  }, []);

  const animateParticles = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current) return;
    if (!particlesInitialized.current) initializeParticles();
    memoizedParticles.current.forEach((particle, index) => {
      const timeoutId = setTimeout(() => {
        if (!isHoveredRef.current || !cardRef.current) return;
        const clone = particle.cloneNode(true);
        cardRef.current.appendChild(clone);
        particlesRef.current.push(clone);
        gsap.fromTo(clone, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' });
        gsap.to(clone, { x: (Math.random() - 0.5) * 100, y: (Math.random() - 0.5) * 100, rotation: Math.random() * 360, duration: 2 + Math.random() * 2, ease: 'none', repeat: -1, yoyo: true });
        gsap.to(clone, { opacity: 0.3, duration: 1.5, ease: 'power2.inOut', repeat: -1, yoyo: true });
      }, index * 100);
      timeoutsRef.current.push(timeoutId);
    });
  }, [initializeParticles]);

  useEffect(() => {
    if (disableAnimations || !cardRef.current) return;
    const element = cardRef.current;
    const handleMouseEnter = () => { isHoveredRef.current = true; animateParticles(); if (enableTilt) gsap.to(element, { rotateX: 5, rotateY: 5, duration: 0.3, ease: 'power2.out', transformPerspective: 1000 }); };
    const handleMouseLeave = () => { isHoveredRef.current = false; clearAllParticles(); if (enableTilt) gsap.to(element, { rotateX: 0, rotateY: 0, duration: 0.3, ease: 'power2.out' }); if (enableMagnetism) gsap.to(element, { x: 0, y: 0, duration: 0.3, ease: 'power2.out' }); };
    const handleMouseMove = e => {
      if (!enableTilt && !enableMagnetism) return;
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top, centerX = rect.width / 2, centerY = rect.height / 2;
      if (enableTilt) gsap.to(element, { rotateX: ((y - centerY) / centerY) * -10, rotateY: ((x - centerX) / centerX) * 10, duration: 0.1, ease: 'power2.out', transformPerspective: 1000 });
      if (enableMagnetism) magnetismAnimationRef.current = gsap.to(element, { x: (x - centerX) * 0.05, y: (y - centerY) * 0.05, duration: 0.3, ease: 'power2.out' });
    };
    const handleClick = e => {
        if (!clickEffect) return;
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left, y = e.clientY - rect.top;
        const maxDist = Math.max(Math.hypot(x, y), Math.hypot(x - rect.width, y));
        const ripple = document.createElement('div');
        ripple.style.cssText = `position:absolute;width:${maxDist * 2}px;height:${maxDist * 2}px;border-radius:50%;background:radial-gradient(circle,rgba(${glowColor},0.4) 0%,transparent 70%);left:${x - maxDist}px;top:${y - maxDist}px;pointer-events:none;z-index:1000;`;
        element.appendChild(ripple);
        gsap.fromTo(ripple, { scale: 0, opacity: 1 }, { scale: 1, opacity: 0, duration: 0.8, ease: 'power2.out', onComplete: () => ripple.remove() });
    };

    element.addEventListener('mouseenter', handleMouseEnter); element.addEventListener('mouseleave', handleMouseLeave); element.addEventListener('mousemove', handleMouseMove); element.addEventListener('click', handleClick);
    return () => { isHoveredRef.current = false; if(element) { element.removeEventListener('mouseenter', handleMouseEnter); element.removeEventListener('mouseleave', handleMouseLeave); element.removeEventListener('mousemove', handleMouseMove); element.removeEventListener('click', handleClick); } clearAllParticles(); };
  }, [animateParticles, clearAllParticles, disableAnimations, enableTilt, enableMagnetism, clickEffect, glowColor]);
  return <div ref={cardRef} className={`${className} relative overflow-hidden`} style={style}>{children}</div>;
};

// --- Global Spotlight ---
const GlobalSpotlight = ({ gridRef, disableAnimations, enabled, spotlightRadius, glowColor }) => {
  const spotlightRef = useRef(null);
  useEffect(() => {
    if (disableAnimations || !gridRef?.current || !enabled) return;
    const spotlight = document.createElement('div');
    spotlight.className = 'global-spotlight';
    spotlight.style.cssText = `position:fixed;width:800px;height:800px;border-radius:50%;pointer-events:none;background:radial-gradient(circle,rgba(${glowColor},0.15) 0%,transparent 70%);z-index:200;opacity:0;transform:translate(-50%,-50%);mix-blend-mode:screen;`;
    document.body.appendChild(spotlight);
    spotlightRef.current = spotlight;
    const handleMouseMove = e => {
      if (!spotlightRef.current || !gridRef.current) return;
      const section = gridRef.current.closest('.bento-section');
      const rect = section?.getBoundingClientRect();
      if (!rect || !(e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom)) {
        gsap.to(spotlightRef.current, { opacity: 0, duration: 0.3 });
        gridRef.current.querySelectorAll('.card').forEach(card => card.style.setProperty('--glow-intensity', '0'));
        return;
      }
      const { proximity, fadeDistance } = calculateSpotlightValues(spotlightRadius);
      gridRef.current.querySelectorAll('.card').forEach(card => {
        const r = card.getBoundingClientRect();
        const dist = Math.hypot(e.clientX - (r.left + r.width/2), e.clientY - (r.top + r.height/2)) - Math.max(r.width, r.height)/2;
        const effDist = Math.max(0, dist);
        let intensity = 0;
        if (effDist <= proximity) intensity = 1;
        else if (effDist <= fadeDistance) intensity = (fadeDistance - effDist) / (fadeDistance - proximity);
        updateCardGlowProperties(card, e.clientX, e.clientY, intensity, spotlightRadius);
      });
      gsap.to(spotlightRef.current, { left: e.clientX, top: e.clientY, duration: 0.1, ease: 'power2.out', opacity: 0.8 });
    };
    document.addEventListener('mousemove', handleMouseMove);
    return () => { document.removeEventListener('mousemove', handleMouseMove); spotlightRef.current?.remove(); };
  }, [gridRef, disableAnimations, enabled, spotlightRadius, glowColor]);
  return null;
};

// --- Main Component ---
const MagicBento = ({
  items = [], // Ab ye parent se data lega
  isDark = true,
  glowColor = "26, 163, 163",
  enableSpotlight = true,
  enableBorderGlow = true,
}) => {
  const gridRef = useRef(null);

  return (
    <>
      <style>{`
        .bento-section { --glow-radius: 300px; --glow-color: ${glowColor}; }
        .card--border-glow::after {
          content: ''; position: absolute; inset: 0; padding: 2px;
          background: radial-gradient(var(--glow-radius) circle at var(--glow-x) var(--glow-y), rgba(${glowColor}, var(--glow-intensity)) 0%, transparent 60%);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude; pointer-events: none;
        }
      `}</style>

      <div className="bento-section w-full h-full" ref={gridRef}>
        {enableSpotlight && <GlobalSpotlight gridRef={gridRef} enabled={enableSpotlight} glowColor={glowColor} />}
        
        {/* Simple Responsive Grid for 6 items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
          {items.map((item, index) => {
            const Icon = item.icon;
            
            const cardBgClass = isDark 
                ? "bg-slate-900/40 border-white/10" 
                : "bg-white border-slate-200 shadow-md shadow-orange-500/5";

            const textClass = isDark ? "text-white" : "text-slate-900";
            const descClass = isDark ? "text-slate-400" : "text-slate-500";

            return (
              <a 
                key={index}
                href={item.href} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block h-full"
              >
                <ParticleCard
                    className={cn(
                        "card relative flex flex-col justify-between p-6 rounded-2xl border transition-all duration-300 h-full hover:-translate-y-1 hover:shadow-lg",
                        cardBgClass,
                        enableBorderGlow && "card--border-glow"
                    )}
                    glowColor={glowColor}
                    enableTilt={true}
                    enableMagnetism={true}
                    clickEffect={true}
                    particleCount={6}
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className={cn(
                            "p-3 rounded-xl flex items-center justify-center transition-colors",
                            isDark ? "bg-white/5 text-primary group-hover:bg-primary/20" : "bg-orange-50 text-secondary"
                        )}>
                            {Icon && <Icon size={24} />}
                        </div>
                        <span className={cn("opacity-50", textClass)}>
                             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M17 7H7M17 7V17" /></svg>
                        </span>
                    </div>

                    <div>
                        <h3 className={cn("text-lg font-bold mb-1", textClass)}>{item.title}</h3>
                        <p className={cn("text-xs font-medium truncate", descClass)}>{item.description}</p>
                    </div>
                </ParticleCard>
              </a>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default MagicBento;
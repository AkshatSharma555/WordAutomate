import { useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { cn } from '../../utils/cn'; 
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

// --- Helper Functions ---
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
const ParticleCard = ({ children, className = '', disableAnimations = false, style, particleCount, glowColor, enableTilt, enableMagnetism }) => {
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
      if (enableTilt) gsap.to(element, { rotateX: ((y - centerY) / centerY) * -3, rotateY: ((x - centerX) / centerX) * 3, duration: 0.1, ease: 'power2.out', transformPerspective: 1000 });
      if (enableMagnetism) magnetismAnimationRef.current = gsap.to(element, { x: (x - centerX) * 0.02, y: (y - centerY) * 0.02, duration: 0.3, ease: 'power2.out' });
    };
    element.addEventListener('mouseenter', handleMouseEnter); element.addEventListener('mouseleave', handleMouseLeave); element.addEventListener('mousemove', handleMouseMove); 
    return () => { isHoveredRef.current = false; if(element) { element.removeEventListener('mouseenter', handleMouseEnter); element.removeEventListener('mouseleave', handleMouseLeave); element.removeEventListener('mousemove', handleMouseMove); } clearAllParticles(); };
  }, [animateParticles, clearAllParticles, disableAnimations, enableTilt, enableMagnetism, glowColor]);
  
  return <div ref={cardRef} className={`${className} relative overflow-hidden`} style={style}>{children}</div>;
};

// --- Global Spotlight ---
const GlobalSpotlight = ({ gridRef, disableAnimations, enabled, spotlightRadius, glowColor }) => {
  const spotlightRef = useRef(null);
  useEffect(() => {
    if (disableAnimations || !gridRef?.current || !enabled) return;
    const spotlight = document.createElement('div');
    spotlight.className = 'global-spotlight';
    spotlight.style.cssText = `position:fixed;width:800px;height:800px;border-radius:50%;pointer-events:none;background:radial-gradient(circle,rgba(${glowColor},0.12) 0%,transparent 70%);z-index:0;opacity:0;transform:translate(-50%,-50%);mix-blend-mode:screen;`;
    document.body.appendChild(spotlight);
    spotlightRef.current = spotlight;
    
    const handleMouseMove = e => {
      if (!spotlightRef.current) return;
      gsap.to(spotlightRef.current, { left: e.clientX, top: e.clientY, duration: 0.1, ease: 'power2.out', opacity: 0.6 });
      if(gridRef.current) {
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
      }
    };
    document.addEventListener('mousemove', handleMouseMove);
    return () => { document.removeEventListener('mousemove', handleMouseMove); spotlightRef.current?.remove(); };
  }, [gridRef, disableAnimations, enabled, spotlightRadius, glowColor]);
  return null;
};

// --- Main Component ---
const MagicBento = ({
  items = [],
  isDark = true,
  glowColor = "26, 163, 163",
  enableSpotlight = true,
  enableBorderGlow = true,
}) => {
  const gridRef = useRef(null);

  const containerClasses = isDark 
    ? "bg-slate-900/40 border-white/5 backdrop-blur-sm"
    : "bg-white border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]";

  return (
    <>
      <style>{`
        .bento-section { --glow-radius: 300px; --glow-color: ${glowColor}; }
        .card--border-glow::after {
          content: ''; position: absolute; inset: 0; padding: 1px; border-radius: inherit;
          background: radial-gradient(var(--glow-radius) circle at var(--glow-x) var(--glow-y), rgba(${glowColor}, var(--glow-intensity)) 0%, transparent 60%);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude; pointer-events: none;
        }
      `}</style>

      <div className="bento-section w-full" ref={gridRef}>
        {enableSpotlight && <GlobalSpotlight gridRef={gridRef} enabled={enableSpotlight} glowColor={glowColor} />}
        
        {/* LAYOUT: 3 Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(180px,auto)]">
          {items.map((item, index) => {
            const Icon = item.icon;
            const textClass = isDark ? "text-white" : "text-slate-800";
            const descClass = isDark ? "text-slate-400" : "text-slate-500";

            // Grid Spanning Logic
            let gridClass = "md:col-span-1 md:row-span-1";
            let heightClass = "min-h-[220px]";

            if (item.id === 'workspace') {
                gridClass = "md:col-span-2 md:row-span-1"; // Wide Card
                heightClass = "min-h-[260px]";
            } else if (item.id === 'generate') {
                gridClass = "md:col-span-1 md:row-span-2"; // Tall Card
                heightClass = "min-h-[500px] md:h-full";
            }

            const isGenerate = item.id === 'generate';
            const isWorkspace = item.id === 'workspace';

            return (
              <Link 
                key={index}
                to={item.href} 
                className={`block relative group h-full w-full ${gridClass}`}
              >
                <ParticleCard
                    className={cn(
                        "card relative flex flex-col p-8 rounded-[32px] border transition-all duration-300 h-full w-full",
                        // Generate Card (Tall) -> Text Top, Others -> Text Bottom
                        isGenerate ? "justify-start" : "justify-between",
                        containerClasses,
                        heightClass,
                        enableBorderGlow && "card--border-glow",
                        isDark ? "hover:bg-slate-800/50" : "hover:border-[#1AA3A3]/40 hover:shadow-lg hover:-translate-y-1"
                    )}
                    glowColor={glowColor}
                    enableTilt={true}
                    enableMagnetism={true}
                    particleCount={isWorkspace || isGenerate ? 8 : 4}
                >
                    {/* --- HEADER --- */}
                    <div className="flex justify-between items-start mb-6">
                        <div className={cn(
                            "p-4 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-105",
                            isDark ? "bg-white/5 text-[#1AA3A3] group-hover:bg-[#1AA3A3] group-hover:text-white" : "bg-[#1AA3A3]/10 text-[#1AA3A3] group-hover:bg-[#1AA3A3] group-hover:text-white"
                        )}>
                            {Icon && <Icon size={28} />}
                        </div>
                        
                        <div className={cn(
                            "p-2 rounded-full border transition-all duration-300 opacity-50 group-hover:opacity-100 group-hover:translate-x-1",
                            isDark ? "border-white/10 text-white" : "border-slate-200 text-slate-400"
                        )}>
                             <ArrowUpRight size={20} />
                        </div>
                    </div>

                    {/* --- CONTENT (Clean Title & Desc Only) --- */}
                    <div className="flex flex-col z-10">
                        <h3 className={cn("font-bold mb-3 transition-colors", 
                            (isWorkspace || isGenerate) ? "text-3xl" : "text-xl",
                            textClass
                        )}>
                            {item.title}
                        </h3>
                        <p className={cn("text-base font-medium leading-relaxed transition-opacity duration-300 opacity-80", descClass)}>
                            {item.description}
                        </p>
                    </div>
                </ParticleCard>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default MagicBento;
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const topHalfRef = useRef<HTMLDivElement>(null);
  const bottomHalfRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Reveal elements with a sophisticated staggered effect
      tl.fromTo('.ls-logo-box', 
        { scale: 0.8, opacity: 0, rotateX: -45, transformPerspective: 500 }, 
        { scale: 1, opacity: 1, rotateX: 0, duration: 1.2, ease: 'power3.out' }
      );
      
      tl.fromTo('.ls-logo-text',
        { opacity: 0, y: 10, filter: 'blur(5px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: 'power2.out', stagger: 0.1 },
        '-=0.8'
      );

      // Loading counter and progress bar animation
      const obj = { val: 0 };
      tl.to(obj, {
        val: 100,
        duration: 2.5,
        ease: 'power1.inOut',
        onUpdate: () => {
          const v = Math.round(obj.val);
          setCount(v);
          if (progressRef.current) progressRef.current.style.width = `${v}%`;
        },
      }, '-=0.4');

      // Add a subtle scanning effect over the logo while loading
      gsap.to('.ls-scan-line', {
        y: 80,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'linear'
      });

      // Exit sequence: Fade out content, then split the screen
      tl.to('.ls-content', {
        opacity: 0,
        scale: 0.95,
        filter: 'blur(10px)',
        duration: 0.5,
        ease: 'power2.in',
      }, '+=0.2');

      tl.to(topHalfRef.current, {
        yPercent: -100,
        duration: 1.2,
        ease: 'expo.inOut',
      }, 'split');
      
      tl.to(bottomHalfRef.current, {
        yPercent: 100,
        duration: 1.2,
        ease: 'expo.inOut',
        onComplete,
      }, 'split');

    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div ref={containerRef} className="fixed inset-0 z-[9999] pointer-events-none flex flex-col">
      {/* Top Door */}
      <div ref={topHalfRef} className="relative w-full h-1/2 overflow-hidden" style={{ background: 'var(--c-bg)' }}>
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(var(--c-t50) 1px, transparent 1px), linear-gradient(90deg, var(--c-t50) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }} />

      </div>
      
      {/* Bottom Door */}
      <div ref={bottomHalfRef} className="relative w-full h-1/2 overflow-hidden" style={{ background: 'var(--c-bg)' }}>
        <div className="absolute inset-0 -top-full opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(var(--c-t50) 1px, transparent 1px), linear-gradient(90deg, var(--c-t50) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }} />

      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
        <div ref={contentRef} className="ls-content flex flex-col items-center justify-center gap-10">
          
          {/* Logo Section */}
          <div className="relative flex flex-col items-center gap-6">
            <div className="ls-logo-box relative w-24 h-24 rounded-2xl flex items-center justify-center overflow-hidden" 
                 style={{ border: '1px solid var(--c-t15)', background: 'var(--c-t04)', boxShadow: '0 10px 40px -10px var(--c-t10)' }}>
              {/* Scan line */}
              <div className="ls-scan-line absolute top-[-100%] left-0 w-full h-1 bg-white/20 blur-[2px]"></div>
              
              <span className="text-5xl font-black relative z-10" style={{ color: 'var(--c-text)' }}>G</span>
              
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/30 rounded-tl-lg m-2"></div>
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/30 rounded-tr-lg m-2"></div>
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/30 rounded-bl-lg m-2"></div>
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/30 rounded-br-lg m-2"></div>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <div className="ls-logo-text text-[10px] tracking-[0.4em] uppercase font-bold text-center" style={{ color: 'var(--c-text)' }}>
                Guilherme E. Schlickmann
              </div>
              <div className="ls-logo-text text-[9px] tracking-[0.2em] uppercase text-center" style={{ color: 'var(--c-t40)' }}>
                System Boot Sequence
              </div>
            </div>
          </div>

          {/* Progress Section */}
          <div className="w-64 flex flex-col gap-3">
            <div className="flex justify-between items-end px-1">
              <span className="ls-logo-text text-[10px] uppercase tracking-widest font-medium" style={{ color: 'var(--c-t50)' }}>
                Initializing...
              </span>
              <div className="ls-logo-text flex items-baseline">
                <span className="text-2xl font-black tabular-nums tracking-tighter" style={{ color: 'var(--c-text)' }}>{count}</span>
                <span className="text-xs font-medium ml-[2px]" style={{ color: 'var(--c-t40)' }}>%</span>
              </div>
            </div>
            
            <div className="ls-logo-text w-full h-[3px] rounded-full overflow-hidden relative" style={{ background: 'var(--c-t08)' }}>
              <div ref={progressRef} className="absolute top-0 left-0 h-full rounded-full" 
                   style={{ background: 'var(--c-text)', width: '0%', boxShadow: '0 0 12px var(--c-t60)' }}>
                <div className="absolute right-0 top-0 h-full w-4 bg-white/80 blur-[2px]"></div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

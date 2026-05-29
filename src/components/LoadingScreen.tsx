import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.fromTo('.ls-logo', { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.7, ease: 'power3.out' });
      tl.fromTo('.ls-label', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3');

      const obj = { val: 0 };
      tl.to(obj, {
        val: 100,
        duration: 2.2,
        ease: 'power2.inOut',
        onUpdate: () => {
          const v = Math.round(obj.val);
          setCount(v);
          if (progressRef.current) progressRef.current.style.width = `${v}%`;
        },
      }, '-=0.2');

      tl.to(containerRef.current, {
        yPercent: -100,
        duration: 0.8,
        ease: 'power4.inOut',
        delay: 0.2,
        onComplete,
      });
    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div ref={containerRef} className="fixed inset-0 z-[9999] flex flex-col items-center justify-center" style={{ background: 'var(--c-bg)' }}>
      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(var(--c-t50) 1px, transparent 1px), linear-gradient(90deg, var(--c-t50) 1px, transparent 1px)`,
        backgroundSize: '80px 80px',
      }} />

      <div className="ls-logo mb-10 flex flex-col items-center gap-3">
        <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ border: '1px solid var(--c-t15)', background: 'var(--c-t04)' }}>
          <span className="text-2xl font-black" style={{ color: 'var(--c-text)' }}>G</span>
        </div>
        <div className="ls-label text-[11px] tracking-[0.5em] uppercase" style={{ color: 'var(--c-t30)' }}>
          Guilherme Espaniol
        </div>
      </div>

      {/* Counter */}
      <div className="text-center mb-6">
        <span className="text-6xl font-black tabular-nums" style={{ color: 'var(--c-text)' }}>{count}</span>
        <span className="text-2xl font-light ml-1" style={{ color: 'var(--c-t30)' }}>%</span>
      </div>

      {/* Progress */}
      <div className="w-48 h-px rounded-full overflow-hidden" style={{ background: 'var(--c-t08)' }}>
        <div ref={progressRef} className="h-full rounded-full" style={{ background: 'var(--c-inv)', width: '0%' }} />
      </div>
    </div>
  );
}

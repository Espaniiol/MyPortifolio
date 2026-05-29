import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { techStack } from '../data/portfolio';
import { useApp } from '../contexts/AppContext';

gsap.registerPlugin(ScrollTrigger);

export default function TechStack() {
  const { t } = useApp();
  const sectionRef = useRef<HTMLElement>(null);
  const barRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.stack-header', { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.8, scrollTrigger: { trigger: sectionRef.current, start: 'top 76%' } });
      gsap.fromTo('.tech-item', { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power3.out', scrollTrigger: { trigger: '.tech-grid', start: 'top 78%' } });

      techStack.forEach((tech, i) => {
        const bar = barRefs.current[i];
        if (!bar) return;
        gsap.fromTo(bar, { width: '0%' }, {
          width: `${tech.level}%`, duration: 1.2, ease: 'power2.out', delay: i * 0.04,
          scrollTrigger: { trigger: '.tech-grid', start: 'top 78%', once: true },
        });
      });

      gsap.to('.marquee-inner', { x: '-50%', duration: 22, ease: 'none', repeat: -1 });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="stack" className="py-32" style={{ background: 'var(--c-bg4)' }}>
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'var(--c-t05)' }} />
      <div className="max-w-6xl mx-auto px-6">
        <div className="stack-header mb-16">
          <div className="badge mb-4">{t('stack.badge')}</div>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight" style={{ color: 'var(--c-text)' }}>{t('stack.title')}</h2>
        </div>

        <div className="tech-grid grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mb-16">
          {techStack.map((tech, i) => (
            <div key={tech.name} className="tech-item p-5 rounded-2xl cursor-default transition-all duration-200"
              style={{
                background: hovered===tech.name ? 'var(--c-bg5)' : 'var(--c-bg2)',
                border: `1px solid ${hovered===tech.name ? 'var(--c-t10)' : 'var(--c-t06)'}`,
              }}
              onMouseEnter={() => setHovered(tech.name)}
              onMouseLeave={() => setHovered(null)}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{tech.icon}</span>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: 'var(--c-text)' }}>{tech.name}</div>
                    <div className="text-[11px] uppercase tracking-wider" style={{ color: 'var(--c-t25)' }}>{tech.category}</div>
                  </div>
                </div>
                <span className="text-sm font-bold tabular-nums" style={{ color: 'var(--c-t40)' }}>{tech.level}%</span>
              </div>
              <div className="h-px rounded-full overflow-hidden" style={{ background: 'var(--c-t06)' }}>
                <div ref={el => { barRefs.current[i] = el; }} className="h-full rounded-full" style={{ background: hovered===tech.name ? 'var(--c-inv)' : 'var(--c-t50)', width: '0%', transition: 'background 0.2s' }} />
              </div>
            </div>
          ))}
        </div>

        {/* Marquee */}
        <div className="relative overflow-hidden py-6 border-t border-b" style={{ borderColor: 'var(--c-t05)' }}>
          <div className="absolute inset-0 z-10 pointer-events-none" style={{ background: 'linear-gradient(90deg, var(--c-bg4) 0%, transparent 15%, transparent 85%, var(--c-bg4) 100%)' }} />
          <div className="marquee-inner flex gap-6 items-center whitespace-nowrap">
            {[...techStack, ...techStack].map((tech, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full flex-shrink-0" style={{ background: 'var(--c-t04)', border: '1px solid var(--c-t06)', color: 'var(--c-t40)' }}>
                <span className="text-sm">{tech.icon}</span>
                <span className="text-xs font-medium">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

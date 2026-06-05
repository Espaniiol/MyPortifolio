import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { journeyEvents } from '../data/portfolio';
import { useApp } from '../contexts/AppContext';

gsap.registerPlugin(ScrollTrigger);

export default function Journey() {
  const { t } = useApp();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.journey-header', { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.8, scrollTrigger: { trigger: sectionRef.current, start: 'top 76%' } });

      // Line grows left → right
      gsap.fromTo('.j-hline', { scaleX: 0, transformOrigin: 'left' },
        { scaleX: 1, duration: 1.4, ease: 'power2.inOut', scrollTrigger: { trigger: '.j-timeline', start: 'top 78%' } });

      // Top cards (even indices 0,2,4) fade down
      gsap.fromTo('.j-top', { opacity: 0, y: -28 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: '.j-timeline', start: 'top 78%' } });

      // Bottom cards (odd indices 1,3,5) fade up
      gsap.fromTo('.j-bot', { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: '.j-timeline', start: 'top 78%' } });

      // Dots pop in
      gsap.fromTo('.j-dot', { scale: 0 },
        { scale: 1, duration: 0.4, stagger: 0.08, ease: 'back.out(1.4)',
          scrollTrigger: { trigger: '.j-timeline', start: 'top 78%' } });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const cols = 'grid-cols-6';
  const gap  = 'gap-3';

  return (
    <section ref={sectionRef} id="journey" className="py-32" style={{ background: 'var(--c-bg)' }}>
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'var(--c-t05)' }} />
      <div className="max-w-7xl mx-auto px-6">

        <div className="journey-header mb-14">
          <div className="badge mb-4">{t('journey.badge')}</div>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight" style={{ color: 'var(--c-text)' }}>{t('journey.title')}</h2>
          <p className="mt-3 text-sm" style={{ color: 'var(--c-t30)' }}>{t('journey.subtitle')}</p>
        </div>

        {/* ── Desktop horizontal timeline ─────────────────── */}
        <div className="j-timeline hidden lg:block">

          {/* Top cards — even indices (0,2,4) */}
          <div className={`grid ${cols} ${gap}`}>
            {journeyEvents.map((e, i) =>
              i % 2 === 0 ? (
                <Card key={e.year} e={e} i={i} cls="j-top" />
              ) : (
                <div key={e.year} />
              )
            )}
          </div>

          {/* Top connectors */}
          <div className={`grid ${cols} ${gap} mt-0`}>
            {journeyEvents.map((_, i) => (
              <div key={i} className="flex justify-center">
                <div className="w-px" style={{ height: 20, background: i % 2 === 0 ? 'var(--c-t08)' : 'transparent' }} />
              </div>
            ))}
          </div>

          {/* Horizontal line + dots */}
          <div className="relative py-1">
            <div className="j-hline absolute top-1/2 left-0 right-0 h-px -translate-y-1/2"
              style={{ background: 'var(--c-t10)' }} />
            <div className={`grid ${cols} ${gap} relative z-10`}>
              {journeyEvents.map((e, i) => (
                <div key={i} className="flex justify-center">
                  <div className="j-dot w-2.5 h-2.5 rounded-full"
                    style={{
                      background: e.year === 'Futuro' ? 'var(--c-t20)' : 'var(--c-inv)',
                      border: '2px solid var(--c-bg)',
                      boxShadow: e.year !== 'Futuro' ? '0 0 6px rgba(255,255,255,0.18)' : 'none',
                    }} />
                </div>
              ))}
            </div>
          </div>

          {/* Bottom connectors */}
          <div className={`grid ${cols} ${gap}`}>
            {journeyEvents.map((_, i) => (
              <div key={i} className="flex justify-center">
                <div className="w-px" style={{ height: 20, background: i % 2 === 1 ? 'var(--c-t08)' : 'transparent' }} />
              </div>
            ))}
          </div>

          {/* Bottom cards — odd indices (1,3,5) */}
          <div className={`grid ${cols} ${gap}`}>
            {journeyEvents.map((e, i) =>
              i % 2 === 1 ? (
                <Card key={e.year} e={e} i={i} cls="j-bot" />
              ) : (
                <div key={e.year} />
              )
            )}
          </div>
        </div>

        {/* ── Mobile fallback grid ────────────────────────── */}
        <div className="lg:hidden grid sm:grid-cols-2 gap-4">
          {journeyEvents.map((e, i) => (
            <Card key={e.year} e={e} i={i} cls="j-top" />
          ))}
        </div>

      </div>
    </section>
  );
}

/* ── Card component ─────────────────────────────────────────── */
function Card({ e, i, cls }: { e: typeof journeyEvents[0]; i: number; cls: string }) {
  return (
    <div className={`${cls} relative p-4 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1`}
      style={{ background: 'var(--c-bg2)', border: '1px solid var(--c-t08)', boxShadow: '0 2px 8px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.03)' }}>

      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `var(--c-t0${Math.min(8, Math.round((0.05 + i * 0.025) * 100))})` }} />

      {/* Icon + year */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0"
          style={{ background: 'var(--c-t04)', border: '1px solid var(--c-t08)' }}>
          {e.icon}
        </div>
        <div>
          <div className="text-xl font-black tabular-nums leading-none"
            style={{ color: e.year === 'Futuro' ? 'var(--c-t35)' : 'var(--c-text)' }}>
            {e.year}
          </div>
          <div className="text-xs font-semibold mt-0.5" style={{ color: 'var(--c-t50)' }}>
            {e.title}
          </div>
        </div>
      </div>

      <p className="text-xs leading-relaxed" style={{ color: 'var(--c-t35)' }}>
        {e.description}
      </p>

      {/* Watermark */}
      <div className="absolute bottom-3 right-4 text-4xl font-black tabular-nums pointer-events-none select-none"
        style={{ color: 'var(--c-inv)', opacity: 0.04 }}>
        {String(i + 1).padStart(2, '0')}
      </div>
    </div>
  );
}

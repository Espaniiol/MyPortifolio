import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { experiences } from '../data/portfolio';
import { useApp } from '../contexts/AppContext';

gsap.registerPlugin(ScrollTrigger);

export default function Experience() {
  const { t, lang } = useApp();
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.exp-header', { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.8, scrollTrigger: { trigger: sectionRef.current, start: 'top 76%' } });
      gsap.fromTo('.timeline-line', { scaleY: 0, transformOrigin: 'top' },
        { scaleY: 1, duration: 1.5, ease: 'power2.inOut', scrollTrigger: { trigger: '.tl-wrap', start: 'top 76%' } });
      gsap.fromTo('.exp-card', { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: '.tl-wrap', start: 'top 74%' } });
      gsap.fromTo('.tl-dot', { scale: 0 },
        { scale: 1, duration: 0.45, stagger: 0.12, ease: 'back.out(1.4)', scrollTrigger: { trigger: '.tl-wrap', start: 'top 74%' } });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="experience" className="py-32 relative" style={{ background: 'var(--c-bg4)' }}>
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'var(--c-t05)' }} />
      <div className="max-w-4xl mx-auto px-6">
        <div className="exp-header mb-16">
          <div className="badge mb-4">{t('experience.badge')}</div>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight" style={{ color: 'var(--c-text)' }}>{t('experience.title')}</h2>
        </div>

        <div className="tl-wrap relative">
          {/* Line */}
          <div className="timeline-line absolute left-0 md:left-[calc(50%-0.5px)] top-0 bottom-0 w-px" style={{ background: 'var(--c-t10)' }} />

          <div className="space-y-10">
            {experiences[lang].map((exp, i) => (
              <div key={exp.id} className={`exp-card relative flex ${i%2===0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 pl-8 md:pl-0`}>
                {/* Dot */}
                <div className="tl-dot absolute left-0 md:left-1/2 top-6 -translate-x-1/2 w-3 h-3 rounded-full z-10 cursor-pointer" style={{ background: exp.color, border: '2px solid var(--c-bg)' }} onClick={() => setActive(active===exp.id ? null : exp.id)} />

                {/* Card */}
                <div className={`w-full md:w-[calc(50%-2rem)] ${i%2===0 ? 'md:pr-8' : 'md:pl-8'}`}>
                  <div className="p-6 rounded-2xl cursor-pointer transition-all duration-300" style={{
                    background: active===exp.id ? 'var(--c-bg5)' : 'var(--c-bg2)',
                    border: `1px solid ${active===exp.id ? 'var(--c-t15)' : 'var(--c-t08)'}`,
                    boxShadow: active===exp.id
                      ? '0 8px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.04)'
                      : '0 2px 8px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.03)',
                  }} onClick={() => setActive(active===exp.id ? null : exp.id)}>

                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="text-[11px] uppercase tracking-widest mb-1" style={{ color: 'var(--c-t30)' }}>{exp.period}</div>
                        <h3 className="text-base font-bold" style={{ color: 'var(--c-text)' }}>{exp.role}</h3>
                        <div className="text-sm mt-0.5" style={{ color: 'var(--c-t40)' }}>{exp.company}</div>
                      </div>
                      <svg className="w-4 h-4 flex-shrink-0 mt-1 transition-transform duration-300" style={{ color: 'var(--c-t25)', transform: active===exp.id ? 'rotate(180deg)' : 'none' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>

                    <div style={{ maxHeight: active===exp.id ? '240px' : '0', overflow: 'hidden', transition: 'max-height 0.45s cubic-bezier(0.4,0,0.2,1)' }}>
                      <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--c-t40)' }}>{exp.description}</p>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-2">
                      {exp.techs.map(tech => <span key={tech} className="tag">{tech}</span>)}
                    </div>
                  </div>
                </div>
                <div className="hidden md:block w-[calc(50%-2rem)]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

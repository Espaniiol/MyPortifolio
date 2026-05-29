import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { stats } from '../data/portfolio';
import { useApp } from '../contexts/AppContext';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const { t } = useApp();
  const sectionRef = useRef<HTMLElement>(null);
  const counterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.about-header', { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } });
      gsap.fromTo('.about-text', { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: '.about-body', start: 'top 78%' } });
      gsap.fromTo('.about-photo', { opacity: 0, scale: 0.96 },
        { opacity: 1, scale: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.about-photo', start: 'top 80%' } });
      gsap.fromTo('.stat-item', { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: '.stats-row', start: 'top 82%' } });

      stats.forEach((s, i) => {
        const el = counterRefs.current[i];
        if (!el) return;
        const o = { val: 0 };
        gsap.to(o, { val: s.value, duration: 1.8, ease: 'power2.out',
          onUpdate: () => { el.textContent = Math.round(o.val).toString(); },
          scrollTrigger: { trigger: '.stats-row', start: 'top 82%', once: true } });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const tags = ['Delphi', 'Oracle DB', 'PL/SQL', 'PostgreSQL', 'TypeScript', 'React', 'Python', 'Postman', 'Docker', 'Git'];

  return (
    <section ref={sectionRef} id="about" className="relative py-32" style={{ background: 'var(--c-bg)' }}>
      {/* Divider top */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'var(--c-t05)' }} />

      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="about-header mb-16">
          <div className="badge mb-4">{t('about.badge')}</div>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight" style={{ color: 'var(--c-text)' }}>
            {t('about.title')}
          </h2>
        </div>

        {/* Grid */}
        <div className="about-body grid lg:grid-cols-[1fr_340px] gap-16 items-start">
          {/* Text col */}
          <div className="space-y-5">
            <p className="about-text text-base leading-relaxed" style={{ color: 'var(--c-t50)' }}>
              Desenvolvedor com experiência em <span style={{ color: 'var(--c-text)', fontWeight: 600 }}>sistemas ERP e aplicações legadas</span>, atuando principalmente com Delphi e bancos de dados Oracle/PostgreSQL. Formado em Análise e Desenvolvimento de Sistemas pela <span style={{ color: 'var(--c-text)' }}>UNIPAR</span>.
            </p>
            <p className="about-text text-base leading-relaxed" style={{ color: 'var(--c-t50)' }}>
              Tenho expertise em desenvolvimento de <span style={{ color: 'var(--c-text)', fontWeight: 600 }}>stored procedures, triggers e integrações de APIs</span> corporativas. Atuo também em análise de código, validação de regras de negócio e melhoria de performance em rotinas críticas.
            </p>
            <p className="about-text text-base leading-relaxed" style={{ color: 'var(--c-t50)' }}>
              Familiaridade com metodologias ágeis e ferramentas como <span style={{ color: 'var(--c-text)' }}>Jira, Git, Postman e Swagger</span>. Sempre evoluindo no ecossistema moderno — React, TypeScript, Python e Docker fazem parte do meu repertório em constante crescimento.
            </p>

            {/* Tags */}
            <div className="about-text flex flex-wrap gap-2 pt-2">
              {tags.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>

            {/* Stats row */}
            <div className="stats-row grid grid-cols-4 gap-6 pt-8 border-t" style={{ borderColor: 'var(--c-t06)' }}>
              {stats.map((s, i) => (
                <div key={s.label} className="stat-item">
                  <div className="text-2xl font-black tabular-nums" style={{ color: 'var(--c-text)' }}>
                    <span ref={el => { counterRefs.current[i] = el; }}>0</span>{s.suffix}
                  </div>
                  <div className="text-[11px] uppercase tracking-wider mt-1" style={{ color: 'var(--c-t30)' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Photo */}
          <div className="about-photo">
            <div className="relative">
              {/* Photo frame */}
              <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden" style={{ border: '1px solid var(--c-t08)' }}>
                <img
                  src="/me.jpg"
                  alt="Guilherme E. Schlickmann"
                  className="w-full h-full object-cover object-center"
                  onError={(e) => {
                    const el = e.currentTarget as HTMLImageElement;
                    el.style.display = 'none';
                    const parent = el.parentElement!;
                    parent.style.background = 'var(--c-bg3)';
                    parent.innerHTML = `<div style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px">
                      <div style="width:60px;height:60px;border-radius:16px;background:var(--c-t06);border:1px solid var(--c-t10);display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:900;color:var(--c-inv)">G</div>
                      <div style="font-size:12px;color:var(--c-t30)">Coloque me.jpg em /public</div>
                    </div>`;
                  }}
                />
              </div>

              {/* Status badge */}
              <div className="absolute -bottom-4 -left-4 px-4 py-2.5 rounded-xl" style={{ background: 'var(--c-bg3)', border: '1px solid var(--c-t08)' }}>
                <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--c-t30)' }}>Status</div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse-soft" style={{ background: 'var(--c-inv)' }} />
                  <span className="text-sm font-semibold" style={{ color: 'var(--c-text)' }}>{t('about.available')}</span>
                </div>
              </div>

              {/* Location badge */}
              <div className="absolute -top-3 -right-3 px-3 py-2 rounded-xl" style={{ background: 'var(--c-bg3)', border: '1px solid var(--c-t08)' }}>
                <div className="text-[11px] font-medium" style={{ color: 'var(--c-t40)' }}>📍 Marmeleiro — PR</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

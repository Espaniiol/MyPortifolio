import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useApp } from '../contexts/AppContext';
import { personalInfo } from '../data/portfolio';

gsap.registerPlugin(ScrollTrigger);

/* Orb definitions — each floats with CSS animation + mouse parallax */
const ORBS = [
  { size: 560, top: '-10%', left: '-8%',  gradient: 'radial-gradient(circle at 40% 40%, rgba(100,130,255,0.55), rgba(80,60,200,0.15) 60%, transparent 80%)', duration: '22s', delay: '0s',   parallax: 0.025 },
  { size: 480, top:  '50%', left:  '65%', gradient: 'radial-gradient(circle at 55% 45%, rgba(160,80,255,0.50), rgba(120,40,200,0.12) 60%, transparent 80%)', duration: '28s', delay: '-8s',  parallax: -0.02 },
  { size: 420, top:  '60%', left:  '-5%', gradient: 'radial-gradient(circle at 50% 50%, rgba(60,180,255,0.40), rgba(40,120,220,0.10) 60%, transparent 80%)', duration: '20s', delay: '-14s', parallax: 0.018 },
  { size: 320, top:  '10%', left:  '70%', gradient: 'radial-gradient(circle at 45% 55%, rgba(200,100,255,0.35), rgba(150,60,200,0.08) 60%, transparent 80%)', duration: '26s', delay: '-5s',  parallax: -0.03 },
];

export default function Hero() {
  const { t, lang } = useApp();
  const info = personalInfo[lang];
  const sectionRef = useRef<HTMLElement>(null);
  const orbRefs    = useRef<(HTMLDivElement | null)[]>([]);

  /* Mouse parallax on orbs */
  useEffect(() => {
    let cx = window.innerWidth  / 2;
    let cy = window.innerHeight / 2;
    let tx = [0, 0, 0, 0], ty = [0, 0, 0, 0];
    let rx = [0, 0, 0, 0], ry = [0, 0, 0, 0];
    let rafId: number;

    const onMove = (e: MouseEvent) => {
      const dx = (e.clientX - cx);
      const dy = (e.clientY - cy);
      ORBS.forEach((o, i) => { tx[i] = dx * o.parallax; ty[i] = dy * o.parallax; });
    };
    const onResize = () => { cx = window.innerWidth / 2; cy = window.innerHeight / 2; };

    const tick = () => {
      rafId = requestAnimationFrame(tick);
      ORBS.forEach((_, i) => {
        rx[i] += (tx[i] - rx[i]) * 0.06;
        ry[i] += (ty[i] - ry[i]) * 0.06;
        const el = orbRefs.current[i];
        if (el) el.style.transform = `translate(${rx[i]}px, ${ry[i]}px)`;
      });
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('resize',    onResize, { passive: true });
    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize',    onResize);
    };
  }, []);

  /* GSAP entrance */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 3.0 });
      tl.fromTo('.hero-line', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.0, stagger: 0.08, ease: 'power3.out' });
      tl.fromTo('.hero-sub',  { opacity: 0, y: 12  }, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.4');
      tl.fromTo('.hero-desc', { opacity: 0, y: 8   }, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.4');
      tl.fromTo('.hero-cta',  { opacity: 0, y: 8   }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3');
      tl.fromTo('.hero-stats',{ opacity: 0          }, { opacity: 1,       duration: 0.6               },       '-=0.2');

      gsap.to('.hero-content', {
        yPercent: 20, ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: 'bottom top', scrub: 1 },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: 'var(--c-bg)' }}>

      {/* ── Floating orbs ── */}
      {ORBS.map((orb, i) => (
        <div
          key={i}
          ref={el => { orbRefs.current[i] = el; }}
          className="absolute pointer-events-none will-change-transform"
          style={{
            width:      orb.size,
            height:     orb.size,
            top:        orb.top,
            left:       orb.left,
            borderRadius: '50%',
            background: orb.gradient,
            filter:     'blur(72px)',
            animation:  `orbFloat ${orb.duration} ease-in-out ${orb.delay} infinite`,
            zIndex:     1,
          }}
        />
      ))}

      {/* Noise overlay — suaviza os orbs */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.04\'/%3E%3C/svg%3E")',
        backgroundSize: '180px',
        zIndex: 2,
        opacity: 0.35,
      }} />

      {/* Vinheta radial */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 80% 65% at 50% 50%, transparent 25%, var(--c-bg) 100%)',
        zIndex: 3,
      }} />

      {/* Grid pontilhado */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `radial-gradient(circle, var(--c-t08) 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
        zIndex: 2,
        opacity: 0.5,
      }} />

      {/* Content */}
      <div className="hero-content relative z-10 text-center px-6 max-w-5xl mx-auto">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-medium mb-10 hero-sub"
          style={{ background: 'var(--c-t04)', border: '1px solid var(--c-t10)', color: 'var(--c-t40)' }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse-soft" style={{ background: 'var(--c-inv)' }} />
          {t('hero.available')}
        </div>

        {/* Name */}
        <div className="overflow-hidden mb-2">
          <div className="hero-line text-sm font-light tracking-[0.5em] uppercase" style={{ color: 'var(--c-t30)' }}>
            Guilherme E. Schlickmann
          </div>
        </div>

        {/* Title */}
        <div className="mb-10">
          {info.heroTitle.map((word: string, i: number) => (
            <div key={i} style={{ lineHeight: 0.9 }}>
              <div className="hero-line inline-block text-[clamp(2.8rem,9vw,7rem)] font-black tracking-tighter"
                style={{ color: i === 0 ? 'var(--c-text)' : 'var(--c-inv)' }}>
                {word}
              </div>
            </div>
          ))}
        </div>

        {/* Subtitle */}
        <div className="hero-sub mb-8 flex flex-col items-center gap-3">
          <span className="text-xs tracking-[0.4em] uppercase" style={{ color: 'var(--c-t25)' }}>
            {info.heroSubtitle.replace(/ · /g, '  ·  ')}
          </span>
          <span className="inline-flex items-center gap-2 text-xs tracking-[0.3em] uppercase font-medium" style={{ color: 'var(--c-t40)' }}>
            <span style={{ color: 'var(--c-t15)' }}>—</span>
            {info.heroRole || personalInfo.pt.heroRole || 'Full Stack Developer'}
            <span style={{ color: 'var(--c-t15)' }}>—</span>
          </span>
        </div>

        {/* Desc */}
        <p className="hero-desc text-sm leading-relaxed max-w-lg mx-auto mb-10" style={{ color: 'var(--c-t35)' }}>
          {info.heroDesc || personalInfo.pt.heroDesc}
        </p>

        {/* CTAs */}
        <div className="hero-cta flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
          <button
            onClick={() => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-7 py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:bg-white hover:text-black"
            style={{ background: 'var(--c-t08)', border: '1px solid var(--c-t15)', color: 'var(--c-inv)' }}>
            {t('hero.viewProjects')}
          </button>
          <a href="https://wa.me/554699380542" target="_blank" rel="noreferrer"
            className="px-7 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2"
            style={{ border: '1px solid var(--c-t08)', color: 'var(--c-t50)' }}>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            {t('hero.whatsapp')}
          </a>
          <a href="https://github.com/Espaniiol" target="_blank" rel="noreferrer"
            className="p-3 rounded-xl transition-all duration-300"
            style={{ border: '1px solid var(--c-t08)', color: 'var(--c-t40)' }}>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>
        </div>

        {/* Stats */}
        <div className="hero-stats flex items-center justify-center gap-12">
          {[{ n: '5+', l: t('hero.yearsExp') }, { n: '10+', l: t('hero.technologies') }].map(s => (
            <div key={s.l} className="text-center">
              <div className="text-lg font-black" style={{ color: 'var(--c-text)' }}>{s.n}</div>
              <div className="text-[10px] uppercase tracking-widest mt-0.5" style={{ color: 'var(--c-t25)' }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

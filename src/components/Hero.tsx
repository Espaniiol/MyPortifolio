import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useApp } from '../contexts/AppContext';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const { t, theme } = useApp();
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /* Particle canvas — optimized */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let raf: number;
    let lastTime = 0;
    let visible = true;
    const FPS = 30;
    const INTERVAL = 1000 / FPS;
    const COUNT = 35;
    const MAX_DIST = 100;
    const MAX_DIST_SQ = MAX_DIST * MAX_DIST;

    const baseColor = theme === 'dark' ? '255,255,255' : '0,0,0';
    const dotFill  = `rgba(${baseColor},0.15)`;
    const lineFill = `rgba(${baseColor},0.04)`;

    type Pt = { x: number; y: number; vx: number; vy: number; s: number };
    const pts: Pt[] = [];

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    const init = () => {
      pts.length = 0;
      for (let i = 0; i < COUNT; i++)
        pts.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          s: Math.random() * 1.2 + 0.5,
        });
    };

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      if (!visible) return;
      const dt = now - lastTime;
      if (dt < INTERVAL) return;
      lastTime = now - (dt % INTERVAL);

      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      /* --- move & draw dots --- */
      ctx.fillStyle = dotFill;
      ctx.beginPath();
      for (let i = 0; i < COUNT; i++) {
        const p = pts[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; else if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; else if (p.y > h) p.y = 0;
        ctx.moveTo(p.x + p.s, p.y);
        ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
      }
      ctx.fill();

      /* --- draw lines in single batched path --- */
      ctx.strokeStyle = lineFill;
      ctx.lineWidth   = 0.5;
      ctx.beginPath();
      for (let i = 0; i < COUNT; i++) {
        for (let j = i + 1; j < COUNT; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          if (dx * dx + dy * dy < MAX_DIST_SQ) {
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
          }
        }
      }
      ctx.stroke();
    };

    /* Pause when tab hidden or hero off-screen */
    const onVisibility = () => { visible = document.visibilityState === 'visible'; };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 });
    io.observe(canvas);
    document.addEventListener('visibilitychange', onVisibility);

    const onResize = () => { resize(); init(); };
    window.addEventListener('resize', onResize, { passive: true });

    resize(); init();
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize', onResize);
    };
  }, [theme]);

  /* GSAP entrance */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 3.0 });
      tl.fromTo('.hero-line', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.0, stagger: 0.08, ease: 'power3.out' });
      tl.fromTo('.hero-sub', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.4');
      tl.fromTo('.hero-desc', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.4');
      tl.fromTo('.hero-cta', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3');
      tl.fromTo('.hero-stats', { opacity: 0 }, { opacity: 1, duration: 0.6 }, '-=0.2');

      gsap.to('.hero-content', {
        yPercent: 20, ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: 'bottom top', scrub: 1 },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: 'var(--c-bg)' }}>
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }} />

      {/* Vinheta central */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 90% 70% at 50% 50%, transparent 30%, var(--c-bg4) 100%)',
        zIndex: 2,
        opacity: 0.85,
      }} />

      {/* Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.025]" style={{
        backgroundImage: `linear-gradient(var(--c-t70) 1px, transparent 1px), linear-gradient(90deg, var(--c-t70) 1px, transparent 1px)`,
        backgroundSize: '80px 80px', zIndex: 1,
      }} />

      <div className="hero-content relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-medium mb-10 hero-sub" style={{ background: 'var(--c-t04)', border: '1px solid var(--c-t08)', color: 'var(--c-t40)' }}>
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
          {['Analista', 'Programador'].map((word, i) => (
            <div key={i} style={{ lineHeight: 0.9 }}>
              <div className="hero-line inline-block text-[clamp(2.8rem,9vw,7rem)] font-black tracking-tighter" style={{ color: i === 0 ? 'var(--c-text)' : 'var(--c-inv)' }}>
                {word}
              </div>
            </div>
          ))}
        </div>

        {/* Subtitle */}
        <div className="hero-sub mb-8 flex flex-col items-center gap-3">
          <span className="text-xs tracking-[0.4em] uppercase" style={{ color: 'var(--c-t25)' }}>
            Delphi &nbsp;·&nbsp; Oracle &nbsp;·&nbsp; ERP Systems
          </span>
          <span className="inline-flex items-center gap-2 text-xs tracking-[0.3em] uppercase font-medium" style={{ color: 'var(--c-t40)' }}>
            <span style={{ color: 'var(--c-t15)' }}>—</span>
            Full Stack Developer
            <span style={{ color: 'var(--c-t15)' }}>—</span>
          </span>
        </div>

        {/* Desc */}
        <p className="hero-desc text-sm leading-relaxed max-w-lg mx-auto mb-10" style={{ color: 'var(--c-t35)' }}>
          Desenvolvedor especializado em sistemas ERP corporativos e aplicações legadas, com expertise em Oracle, PL/SQL e integrações de APIs.
        </p>

        {/* CTAs */}
        <div className="hero-cta flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
          <button onClick={() => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })}
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

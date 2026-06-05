import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects } from '../data/portfolio';
import { useApp } from '../contexts/AppContext';

gsap.registerPlugin(ScrollTrigger);

/* ── AutoVideo: muted autoplay — browsers allow this without restrictions ── */
function AutoVideo({ src, poster, className, style }: { src: string; poster?: string; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    // Ensure play starts even if browser deferred it
    ref.current?.play().catch(() => {});
  }, []);
  return (
    <video ref={ref} src={src} poster={poster} autoPlay muted loop playsInline preload="auto"
      className={className} style={style} />
  );
}

interface Project {
  id: number; title: string; description: string; longDescription: string;
  image: string; video?: string; poster?: string; mobile?: boolean;
  techs: string[]; github: string; demo: string;
  featured: boolean; color: string; year: string;
}

/* ── Phone mockup shell ─────────────────────────────────────── */
function PhoneMockup({ src, small = false, autoplay = false }:
  { src: string; small?: boolean; autoplay?: boolean }) {
  const w = small ? 108 : 200;

  return (
    <div className="relative mx-auto select-none" style={{ width: w }}>
      <div className="relative" style={{
        background: '#0d0d0d',
        borderRadius: small ? 28 : 44,
        border: '2px solid rgba(255,255,255,0.12)',
        boxShadow: '0 0 0 1px rgba(255,255,255,0.04) inset, 0 24px 64px rgba(0,0,0,0.7)',
        padding: small ? '8px 3px 6px' : '14px 5px 10px',
      }}>
        {/* Dynamic island */}
        <div className="absolute left-1/2 -translate-x-1/2" style={{
          top: small ? 4 : 6, width: small ? 36 : 60, height: small ? 10 : 16,
          background: '#000', borderRadius: 99, zIndex: 2,
        }} />
        {/* Screen */}
        <div style={{ borderRadius: small ? 22 : 36, overflow: 'hidden', background: '#000' }}>
          {autoplay
            ? <AutoVideo src={src} style={{ width: '100%', display: 'block' }} />
            : <video src={src} autoPlay muted loop playsInline style={{ width: '100%', display: 'block' }} />
          }
        </div>
        {/* Home bar */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: small ? 4 : 7 }}>
          <div style={{ width: small ? 32 : 52, height: 3, borderRadius: 99, background: 'rgba(255,255,255,0.25)' }} />
        </div>
      </div>
      {/* Volume buttons */}
      {[70, 100].map(top => (
        <div key={top} style={{
          position: 'absolute', left: -3, top,
          width: 3, height: small ? 16 : 22,
          borderRadius: '3px 0 0 3px', background: 'rgba(255,255,255,0.08)',
        }} />
      ))}
      {/* Power button */}
      <div style={{
        position: 'absolute', right: -3, top: small ? 80 : 100,
        width: 3, height: small ? 24 : 36,
        borderRadius: '0 3px 3px 0', background: 'rgba(255,255,255,0.08)',
      }} />
    </div>
  );
}

/* ── Modal ──────────────────────────────────────────────────── */
function Modal({ p, onClose }: { p: Project; onClose: () => void }) {
  const bg  = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    gsap.fromTo(bg.current,  { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' });
    gsap.fromTo(box.current, { y: 20, scale: 0.97, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.4, ease: 'power3.out' });
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; document.removeEventListener('keydown', onKey); };
  }, []);

  const close = () => {
    gsap.to(box.current, { y: 16, scale: 0.97, opacity: 0, duration: 0.28, ease: 'power2.in' });
    gsap.to(bg.current,  { opacity: 0, duration: 0.28, ease: 'power2.in', onComplete: onClose });
  };

  return (
    <div ref={bg} className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(14px)' }}
      onClick={e => { if (e.target === bg.current) close(); }}>

      <div ref={box} className="relative w-full max-w-xl rounded-2xl overflow-hidden"
        style={{ background: 'var(--c-bg3)', border: '1px solid var(--c-t08)', maxHeight: '88vh', overflowY: 'auto' }}>

        {/* Media */}
        {p.mobile && p.video ? (
          <div className="flex items-center justify-center py-10"
            style={{ background: 'radial-gradient(ellipse 70% 80% at 50% 50%, var(--c-bg5), var(--c-bg))' }}>
            <PhoneMockup src={p.video} autoplay={false} />
          </div>
        ) : p.video ? (
          <div style={{ background: '#000' }}>
            <video src={p.video} autoPlay muted loop playsInline
              className="w-full" style={{ maxHeight: 320, objectFit: 'contain', display: 'block' }} />
          </div>
        ) : (
          <div className="relative h-48">
            <img src={p.image} alt={p.title} className="w-full h-full object-cover" style={{ filter: 'grayscale(40%)' }} />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent, var(--c-bg3))' }} />
          </div>
        )}

        <button onClick={close} className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-xs z-10"
          style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid var(--c-t10)', color: 'var(--c-inv)' }}>✕</button>
        <span className="absolute top-3 left-3 px-2 py-1 rounded-lg text-[10px] font-medium z-10"
          style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid var(--c-t10)', color: 'var(--c-t60)' }}>
          {p.video ? '▶ Demo' : p.year}
        </span>

        <div className="p-7">
          <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--c-text)' }}>{p.title}</h3>
          <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--c-t45)' }}>{p.longDescription}</p>
          <div className="flex flex-wrap gap-2 mb-6">{p.techs.map(tech => <span key={tech} className="tag">{tech}</span>)}</div>
          <div className="flex gap-3">
            <a href={p.github} target="_blank" rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-white/5"
              style={{ border: '1px solid var(--c-t10)', color: 'var(--c-t60)' }}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
              GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main ───────────────────────────────────────────────────── */
export default function Projects() {
  const { t } = useApp();
  const sectionRef = useRef<HTMLElement>(null);
  const [selected, setSelected] = useState<Project | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.proj-header', { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.8, scrollTrigger: { trigger: sectionRef.current, start: 'top 76%' } });
      gsap.fromTo('.proj-card', { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: '.proj-grid', start: 'top 76%' } });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const featured = projects.filter(p => p.featured) as Project[];
  const others   = projects.filter(p => !p.featured) as Project[];

  return (
    <section ref={sectionRef} id="projects" className="py-32" style={{ background: 'var(--c-bg)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="proj-header mb-16">
          <div className="badge mb-4">{t('projects.badge')}</div>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight" style={{ color: 'var(--c-text)' }}>{t('projects.title')}</h2>
        </div>

        <div className="proj-grid grid md:grid-cols-2 gap-5 mb-5">
          {featured.map(p => (
            <div key={p.id}
              className="proj-card group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_32px_rgba(0,0,0,0.35)]"
              style={{ background: 'var(--c-bg2)', border: '1px solid var(--c-t08)', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
              onClick={() => setSelected(p)}>

              {/* Mobile card */}
              {p.mobile && p.video ? (
                <div className="relative flex items-center justify-center overflow-hidden"
                  style={{ height: 220, background: 'radial-gradient(ellipse 80% 90% at 50% 60%, var(--c-bg5), var(--c-bg))' }}>
                  <PhoneMockup src={p.video} small autoplay />
                  <span className="absolute top-3 left-3 px-2 py-1 rounded-lg text-[10px] font-medium"
                    style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid var(--c-t08)', color: 'var(--c-t50)' }}>
                    📱 Mobile
                  </span>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ background: 'var(--c-t10)', backdropFilter: 'blur(4px)', border: '1px solid var(--c-t20)' }}>
                      <svg className="w-4 h-4 ml-0.5" style={{ color: 'var(--c-inv)' }} fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                  </div>
                </div>

              ) : (
                /* Desktop card */
                <div className="relative h-52 overflow-hidden" style={{ background: '#000' }}>
                  {p.video
                    ? <AutoVideo src={p.video} poster={p.poster} className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105" />
                    : <img src={p.image} alt={p.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" style={{ filter: 'grayscale(30%)' }} />
                  }
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 40%, var(--c-bg2) 100%)' }} />
                  <span className="absolute top-3 left-3 px-2 py-1 rounded-lg text-[10px] font-medium"
                    style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid var(--c-t08)', color: 'var(--c-t50)' }}>
                    {p.video ? '▶ Demo' : p.year}
                  </span>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ background: 'var(--c-t10)', backdropFilter: 'blur(4px)', border: '1px solid var(--c-t20)' }}>
                      <svg className="w-4 h-4 ml-0.5" style={{ color: 'var(--c-inv)' }} fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-5">
                <h3 className="text-base font-bold mb-2" style={{ color: 'var(--c-text)' }}>{p.title}</h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--c-t40)' }}>{p.description}</p>
                <div className="flex flex-wrap gap-1.5">{p.techs.map(tech => <span key={tech} className="tag">{tech}</span>)}</div>
              </div>
            </div>
          ))}
        </div>

        {others.length > 0 && (
          <div className="grid md:grid-cols-2 gap-5">
            {others.map(p => (
              <div key={p.id}
                className="proj-card group p-6 rounded-2xl cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-white/10"
                style={{ background: 'var(--c-bg2)', border: '1px solid var(--c-t06)' }}
                onClick={() => setSelected(p)}>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base"
                    style={{ background: 'var(--c-t04)', border: '1px solid var(--c-t08)' }}>💻</div>
                  <div className="flex gap-2">
                    <a href={p.github} onClick={e => e.stopPropagation()}
                      className="p-2 rounded-lg transition-colors hover:bg-white/5"
                      style={{ color: 'var(--c-t30)' }}>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
                    </a>
                  </div>
                </div>
                <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--c-text)' }}>{p.title}</h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--c-t35)' }}>{p.description}</p>
                <div className="flex flex-wrap gap-1.5">{p.techs.map(tech => <span key={tech} className="tag">{tech}</span>)}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selected && <Modal p={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}

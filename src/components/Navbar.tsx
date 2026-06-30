import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useApp } from '../contexts/AppContext';
import { type Lang } from '../i18n/translations';

const navKeys: { key: string; href: string; num: string }[] = [
  { key: 'nav.about',      href: '#about',      num: '01' },
  { key: 'nav.experience', href: '#experience', num: '02' },
  { key: 'nav.projects',   href: '#projects',   num: '03' },
  { key: 'nav.stack',      href: '#stack',      num: '04' },
  { key: 'nav.journey',    href: '#journey',    num: '05' },
  { key: 'nav.contact',    href: '#contact',    num: '06' },
];

function SunIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1.5M12 19.5V21M4.22 4.22l1.06 1.06M18.72 18.72l1.06 1.06M3 12h1.5M19.5 12H21M4.22 19.78l1.06-1.06M18.72 5.28l1.06-1.06M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  );
}

export default function Navbar() {
  const { t, theme, toggleTheme, lang, setLang } = useApp();
  const dockRef    = useRef<HTMLDivElement>(null);
  const logoRef    = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState('');
  const [isDockHovered, setIsDockHovered] = useState(false);
  const [menuOpen, setMenuOpen]           = useState(false);

  useEffect(() => {
    gsap.fromTo(dockRef.current,  { opacity: 0 }, { opacity: 1, duration: 0.8, ease: 'power3.out', delay: 3.0 });
    gsap.fromTo(logoRef.current,  { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 3.1 });

    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); }),
      { threshold: 0.3 }
    );
    document.querySelectorAll('section[id]').forEach(s => io.observe(s));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!overlayRef.current) return;
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
      gsap.fromTo('.mobile-nav-item', { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.07, duration: 0.4, ease: 'power3.out' });
    } else {
      document.body.style.overflow = '';
    }
  }, [menuOpen]);

  const handleDockEnter = () => setIsDockHovered(true);
  const handleDockLeave = () => setIsDockHovered(false);

  const go = (href: string) => {
    setMenuOpen(false);
    setTimeout(() => document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' }), menuOpen ? 200 : 0);
  };

  return (
    <>
      {/* Logo — top left floating */}
      <button ref={logoRef} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed top-7 left-7 z-50 flex items-center gap-2.5 group">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black transition-all duration-300 group-hover:bg-white group-hover:text-black"
          style={{ border: '1px solid var(--c-t12)', background: 'var(--c-t05)', color: 'var(--c-text)' }}>
          G
        </div>
        <span className="text-[11px] font-medium hidden sm:block transition-colors duration-200"
          style={{ color: 'var(--c-t25)', letterSpacing: '0.04em' }}>
          Guilherme<span style={{ color: 'var(--c-t10)' }} className="mx-1">·</span>E. Schlickmann
        </span>
      </button>

      {/* Theme toggle + Language switcher — top right, desktop only */}
      <div className="fixed top-7 right-7 z-50 hidden md:flex items-center gap-1 p-1 rounded-xl"
        style={{ background: 'var(--c-t04)', border: '1px solid var(--c-t08)' }}>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-200 hover:bg-white/10"
          style={{ color: 'var(--c-t50)' }}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>

        {/* Divider */}
        <div className="w-px h-4 mx-0.5" style={{ background: 'var(--c-t10)' }} />

        {/* Language switcher */}
        {(['pt', 'en', 'es'] as Lang[]).map(l => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className="text-[10px] font-bold uppercase px-2 py-1 rounded-lg transition-all"
            style={{
              color: lang === l ? 'var(--c-text)' : 'var(--c-t30)',
              background: lang === l ? 'var(--c-t08)' : 'transparent',
            }}
          >
            {l}
          </button>
        ))}
      </div>

      {/* Invisible edge trigger — reveals dock when mouse approaches left edge */}
      <div
        className="fixed top-0 left-0 w-4 h-full z-40 hidden md:block"
        onMouseEnter={handleDockEnter}
      />

      {/* Hint — subtle dots showing a menu lives on the left edge (fades out when revealed) */}
      <div className="fixed left-2 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-2 pointer-events-none transition-opacity duration-300"
        style={{ opacity: isDockHovered ? 0 : 0.5 }}>
        {navKeys.map(link => {
          const isActive = activeSection === link.href.replace('#', '');
          return (
            <span key={link.href} className="rounded-full transition-all duration-300"
              style={{
                width: isActive ? '6px' : '4px',
                height: isActive ? '6px' : '4px',
                background: isActive ? 'var(--c-inv)' : 'var(--c-t30)',
              }} />
          );
        })}
      </div>

      {/* Dock — left side, vertically centered, slides in on edge hover */}
      <div ref={dockRef}
        onMouseEnter={handleDockEnter}
        onMouseLeave={handleDockLeave}
        className="fixed left-0 top-1/2 z-50 hidden md:block"
        style={{
          transform: `translateY(-50%) translateX(${isDockHovered ? '14px' : '-110%'})`,
          transition: 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Glass background */}
        <div className="absolute inset-[-5px] rounded-2xl"
          style={{
            background: 'var(--c-glass)',
            border: '1px solid var(--c-t07)',
            backdropFilter: 'blur(28px)',
            boxShadow: '8px 0 32px rgba(0,0,0,0.4), inset 1px 0 0 rgba(255,255,255,0.03)',
          }}
        />

        {/* Items */}
        <div className="relative flex flex-col items-stretch py-2 px-1.5 gap-0.5">
          {navKeys.map(link => {
            const label    = t(link.key);
            const isActive = activeSection === link.href.replace('#', '');

            return (
              <button key={link.href}
                onClick={() => go(link.href)}
                className="group relative flex items-center gap-2.5 pl-3 pr-5 py-2 rounded-xl w-full transition-all duration-200 hover:translate-x-0.5"
                style={{ background: isActive ? 'var(--c-t08)' : 'transparent' }}>

                {/* Active bar indicator */}
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] rounded-r-full transition-all duration-300"
                  style={{ height: isActive ? '16px' : '0px', background: 'var(--c-inv)' }} />

                {/* Hover highlight */}
                <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                  style={{ background: 'var(--c-t05)' }} />

                {/* Number */}
                <span className="relative text-[10px] font-bold tabular-nums leading-none select-none transition-colors duration-200"
                  style={{ color: isActive ? 'var(--c-text)' : 'var(--c-t25)', minWidth: '14px' }}>
                  {link.num}
                </span>

                {/* Label */}
                <span className="relative text-[11px] font-semibold whitespace-nowrap leading-none select-none transition-colors duration-200"
                  style={{ color: isActive ? 'var(--c-text)' : 'var(--c-t45)' }}>
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile — hamburger top right */}
      <button
        className="fixed top-7 right-7 z-50 md:hidden w-9 h-9 flex flex-col items-center justify-center gap-[5px] rounded-xl transition-all duration-200"
        style={{ background: 'var(--c-glass2)', border: '1px solid var(--c-t07)', backdropFilter: 'blur(12px)' }}
        onClick={() => setMenuOpen(v => !v)}>
        {[0, 1, 2].map(i => (
          <span key={i} className="block rounded-full transition-all duration-300"
            style={{
              width: i === 1 ? '10px' : '14px', height: '1px',
              background: 'var(--c-t50)',
              transform:
                i === 0 && menuOpen ? 'rotate(45deg) translate(4px, 4px)' :
                i === 2 && menuOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none',
              opacity: i === 1 && menuOpen ? 0 : 1,
            }} />
        ))}
      </button>

      {/* Mobile overlay fullscreen */}
      {menuOpen && (
        <div ref={overlayRef} className="fixed inset-0 z-40 flex flex-col items-center justify-center md:hidden"
          style={{ background: 'var(--c-overlay)', backdropFilter: 'blur(16px)' }}>

          {/* Top bar inside overlay */}
          <div className="absolute top-7 left-7 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black"
              style={{ border: '1px solid var(--c-t12)', background: 'var(--c-t05)', color: 'var(--c-text)' }}>G</div>
          </div>

          <nav className="flex flex-col items-start gap-1 w-full px-10">
            {navKeys.map(link => {
              const label    = t(link.key);
              const isActive = activeSection === link.href.replace('#', '');
              return (
                <button key={link.href} onClick={() => go(link.href)}
                  className="mobile-nav-item flex items-baseline gap-5 py-4 w-full group transition-all duration-200">
                  <span className="text-xs font-bold tabular-nums" style={{ color: 'var(--c-t20)' }}>
                    {link.num}
                  </span>
                  <span className="text-4xl font-black tracking-tight transition-colors duration-200"
                    style={{ color: isActive ? 'var(--c-text)' : 'var(--c-t40)' }}>
                    {label}
                  </span>
                  {isActive && <span className="ml-auto text-xs" style={{ color: 'var(--c-t20)' }}>●</span>}
                </button>
              );
            })}
          </nav>

          {/* Bottom bar — socials + lang switcher */}
          <div className="absolute bottom-10 flex flex-col items-center gap-4">
            <div className="flex items-center gap-6">
              {['GitHub', 'LinkedIn'].map(s => (
                <a key={s} href={s === 'GitHub' ? 'https://github.com/Espaniiol' : 'https://linkedin.com/in/gulherme-espaniol'}
                  target="_blank" rel="noreferrer"
                  className="text-xs font-medium transition-colors duration-200 hover:text-white"
                  style={{ color: 'var(--c-t20)', letterSpacing: '0.06em' }}>
                  {s.toUpperCase()}
                </a>
              ))}
            </div>
            {/* Language switcher — mobile */}
            <div className="flex items-center gap-2">
              {(['pt', 'en', 'es'] as Lang[]).map(l => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className="text-[10px] font-bold uppercase px-2 py-1 rounded-lg transition-all"
                  style={{
                    color: lang === l ? 'var(--c-text)' : 'var(--c-t30)',
                    background: lang === l ? 'var(--c-t06)' : 'transparent',
                    border: `1px solid ${lang === l ? 'var(--c-t10)' : 'transparent'}`,
                  }}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

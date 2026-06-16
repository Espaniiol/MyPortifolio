import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;

    let appeared = false;

    const onMove = (e: MouseEvent) => {
      if (!appeared) {
        appeared = true;
        dot.style.opacity = '1';
        gsap.set(dot, { x: e.clientX, y: e.clientY });
      }
      gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0.08, ease: 'power2.out' });
    };

    const onEnter = () => gsap.to(dot, { scale: 2.5, duration: 0.2, ease: 'power2.out' });
    const onLeave = () => gsap.to(dot, { scale: 1,   duration: 0.2, ease: 'power2.out' });
    const onDown  = () => gsap.to(dot, { scale: 0.6, duration: 0.1 });
    const onUp    = () => gsap.to(dot, { scale: 1,   duration: 0.15 });

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup',   onUp);

    const attach = () => {
      document.querySelectorAll('a, button, [data-hover], input, textarea').forEach(el => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
    };
    attach();
    const mo = new MutationObserver(attach);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup',   onUp);
      mo.disconnect();
    };
  }, []);

  return (
    <div
      ref={dotRef}
      className="fixed pointer-events-none z-[9999]"
      style={{
        width: 7,
        height: 7,
        borderRadius: '50%',
        background: 'var(--c-inv)',
        top: 0,
        left: 0,
        transform: 'translate(-50%, -50%)',
        opacity: 0,
      }}
    />
  );
}

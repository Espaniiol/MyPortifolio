import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const isHovering = useRef(false);
  let mouseX = 0, mouseY = 0, rx = 0, ry = 0;

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      gsap.to(dot, { x: mouseX, y: mouseY, duration: 0.06, ease: 'power2.out' });
    };

    const tick = () => {
      rx += (mouseX - rx) * 0.1;
      ry += (mouseY - ry) * 0.1;
      gsap.set(ring, { x: rx, y: ry });
      requestAnimationFrame(tick);
    };

    const onEnter = () => {
      isHovering.current = true;
      gsap.to(dot, { scale: 0, duration: 0.2 });
      gsap.to(ring, { scale: 2, borderColor: 'var(--c-t60)', duration: 0.3 });
    };

    const onLeave = () => {
      isHovering.current = false;
      gsap.to(dot, { scale: 1, duration: 0.2 });
      gsap.to(ring, { scale: 1, borderColor: 'var(--c-t35)', duration: 0.3 });
    };

    const onDown = () => { gsap.to(ring, { scale: 0.8, duration: 0.15 }); };
    const onUp = () => { gsap.to(ring, { scale: isHovering.current ? 2 : 1, duration: 0.2 }); };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup', onUp);

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
    const raf = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup', onUp);
      mo.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="fixed pointer-events-none z-[9998]" style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--c-inv)', top: 0, left: 0, transform: 'translate(-50%,-50%)' }} />
      <div ref={ringRef} className="fixed pointer-events-none z-[9997]" style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid var(--c-t35)', top: 0, left: 0, transform: 'translate(-50%,-50%)' }} />
    </>
  );
}

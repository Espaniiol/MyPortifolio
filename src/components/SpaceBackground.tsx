import { useEffect, useRef } from 'react';
import { useApp } from '../contexts/AppContext';

/**
 * Full-viewport space backdrop (dark theme only).
 * Canvas starfield with twinkle + occasional shooting stars,
 * plus soft drifting nebula clouds behind it.
 * Fixed behind all content; sections sit on top with translucent backgrounds.
 */
export default function SpaceBackground() {
  const { theme } = useApp();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (theme !== 'dark') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0;

    type Star = { x: number; y: number; r: number; base: number; amp: number; phase: number; speed: number; hue: number | null };
    let stars: Star[] = [];

    type Shot = { x: number; y: number; len: number; vx: number; vy: number; life: number; max: number } | null;
    let shot: Shot = null;
    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    let nextShot = performance.now() + rand(3000, 7000);

    const init = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(280, Math.round((w * h) / 8500));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.1 + 0.25,
        base: Math.random() * 0.45 + 0.25,
        amp: Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.0016 + 0.0004,
        // a few tinted stars (blue / purple) for variety
        hue: Math.random() < 0.14 ? (Math.random() < 0.5 ? 212 : 280) : null,
      }));
    };

    let raf = 0;
    let last = 0;
    let running = document.visibilityState === 'visible';
    const FRAME = 1000 / 30;

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      if (!running || now - last < FRAME) return;
      last = now;

      ctx.clearRect(0, 0, w, h);

      // Stars
      for (const s of stars) {
        const a = Math.max(0, Math.min(1, s.base + s.amp * Math.sin(now * s.speed + s.phase)));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.hue == null ? `rgba(255,255,255,${a})` : `hsla(${s.hue},85%,82%,${a})`;
        ctx.fill();
      }

      // Shooting star
      if (!shot && now > nextShot) {
        shot = {
          x: rand(0, w * 0.55),
          y: rand(0, h * 0.35),
          len: rand(120, 240),
          vx: rand(7, 11),
          vy: rand(3, 5),
          life: 0,
          max: rand(40, 70),
        };
      }
      if (shot) {
        shot.life++;
        shot.x += shot.vx;
        shot.y += shot.vy;
        const t = shot.life / shot.max;
        const alpha = Math.sin(Math.PI * t); // ease in then out
        const tailX = shot.x - shot.len;
        const tailY = shot.y - shot.len * (shot.vy / shot.vx);
        const grad = ctx.createLinearGradient(shot.x, shot.y, tailX, tailY);
        grad.addColorStop(0, `rgba(255,255,255,${alpha})`);
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(shot.x, shot.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();
        if (shot.life >= shot.max || shot.x > w || shot.y > h) {
          shot = null;
          nextShot = now + rand(5000, 12000);
        }
      }
    };

    init();
    raf = requestAnimationFrame(draw);

    const onResize = () => init();
    const onVis = () => {
      const visible = document.visibilityState === 'visible';
      running = visible;
      if (!visible) {
        // Pausing without clearing leaves the last frame painted — an in-flight
        // shooting star would freeze as a static diagonal streak across the header
        // (common in mobile in-app browsers that report the page as hidden). Drop
        // the shot and wipe the canvas so nothing gets stuck on screen.
        shot = null;
        ctx.clearRect(0, 0, w, h);
      } else {
        // Resume cleanly: skip the accumulated gap and reschedule the next shot.
        last = 0;
        nextShot = performance.now() + rand(3000, 7000);
      }
    };
    window.addEventListener('resize', onResize, { passive: true });
    document.addEventListener('visibilitychange', onVis);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [theme]);

  if (theme !== 'dark') return null;

  return (
    <div
      aria-hidden
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 0,
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at 50% -10%, #0b0b1a 0%, #070710 45%, #030305 100%)',
      }}
    >
      {/* Nebula clouds */}
      <div className="absolute" style={{
        width: '75vw', height: '75vw', top: '-18%', left: '-12%', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,70,220,0.20), transparent 62%)',
        filter: 'blur(70px)', animation: 'nebulaDrift1 42s ease-in-out infinite',
      }} />
      <div className="absolute" style={{
        width: '62vw', height: '62vw', top: '38%', left: '55%', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(38,118,230,0.18), transparent 62%)',
        filter: 'blur(80px)', animation: 'nebulaDrift2 54s ease-in-out infinite',
      }} />
      <div className="absolute" style={{
        width: '52vw', height: '52vw', top: '72%', left: '2%', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(220,58,160,0.13), transparent 62%)',
        filter: 'blur(80px)', animation: 'nebulaDrift1 48s ease-in-out infinite reverse',
      }} />

      {/* Starfield */}
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}

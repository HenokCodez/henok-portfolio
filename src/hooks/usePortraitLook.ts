import { useEffect } from 'react';
import { useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';

export function usePortraitLook() {
  const reduce = useReducedMotion();
  const x = useMotionValue(0); // -1 … 1 (left … right)
  const y = useMotionValue(0); // -1 … 1 (top … bottom)
  const cfg = { stiffness: 120, damping: 18, mass: 0.4 };
  const sx = useSpring(x, cfg);
  const sy = useSpring(y, cfg);

  const headRotateY = useTransform(sx, (v) => v * 8);
  const headRotateX = useTransform(sy, (v) => -v * 5);
  const headX = useTransform(sx, (v) => v * 10);
  const headY = useTransform(sy, (v) => v * 6);
  const bodyX = useTransform(sx, (v) => v * 4);
  const glowX = useTransform(sx, (v) => v * -24);
  const glowY = useTransform(sy, (v) => v * -16);
  const eyeX = useTransform(sx, (v) => v * 3.5);
  const eyeY = useTransform(sy, (v) => v * 2.5);
  const lidY = useTransform(sy, (v) => (v < 0 ? v * 2.5 : v * 1.5));
  const browY = useTransform(sy, (v) => (v < 0 ? v * 2.5 : v * 1));

  useEffect(() => {
    if (reduce) return;
    const hasMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (!hasMouse) {
      // touch devices: gentle sway, 6s loop, ±0.5 → ±4° head rotation
      let raf = 0;
      const t0 = performance.now();
      const loop = (t: number) => {
        x.set(Math.sin(((t - t0) / 6000) * Math.PI * 2) * 0.5);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      return () => cancelAnimationFrame(raf);
    }

    const onMove = (e: PointerEvent) => {
      x.set((e.clientX / window.innerWidth) * 2 - 1);
      y.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    const onLeave = () => {
      x.set(0);
      y.set(0);
    };
    window.addEventListener('pointermove', onMove);
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, [reduce, x, y]);

  return {
    headRotateY,
    headRotateX,
    headX,
    headY,
    bodyX,
    glowX,
    glowY,
    eyeX,
    eyeY,
    lidY,
    browY,
  };
}

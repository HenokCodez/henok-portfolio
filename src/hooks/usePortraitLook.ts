// src/hooks/usePortraitLook.ts — hero portrait follows the cursor (spec A3)
import { useEffect } from 'react';
import { useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from 'framer-motion';

export interface PortraitLookValues {
  sx: MotionValue<number>;
  sy: MotionValue<number>;
  headRotateY: MotionValue<number>;
  headRotateX: MotionValue<number>;
  headX: MotionValue<number>;
  headY: MotionValue<number>;
  bodyX: MotionValue<number>;
  glowX: MotionValue<number>;
  glowY: MotionValue<number>;
  eyeX: MotionValue<number>;
  eyeY: MotionValue<number>;
}

export function usePortraitLook(): PortraitLookValues {
  const reduce = useReducedMotion();
  const x = useMotionValue(0); // -1 … 1 (left … right)
  const y = useMotionValue(0); // -1 … 1 (top … bottom)
  const cfg = { stiffness: 140, damping: 20, mass: 0.35 };
  const sx = useSpring(x, cfg);
  const sy = useSpring(y, cfg);

  const headRotateY = useTransform(sx, (v) => v * 8);
  const headRotateX = useTransform(sy, (v) => -v * 5);
  const headX = useTransform(sx, (v) => v * 10);
  const headY = useTransform(sy, (v) => v * 6);
  const bodyX = useTransform(sx, (v) => v * 4);
  const glowX = useTransform(sx, (v) => v * -24);
  const glowY = useTransform(sy, (v) => v * -16);
  const eyeX = useTransform(sx, (v) => v * 5);
  const eyeY = useTransform(sy, (v) => v * 3);

  useEffect(() => {
    if (reduce) return;

    let hasInteractedWithMouse = false;
    let raf = 0;
    const t0 = performance.now();

    // Touch / idle sway loop
    const loop = (t: number) => {
      if (!hasInteractedWithMouse) {
        x.set(Math.sin(((t - t0) / 6000) * Math.PI * 2) * 0.4);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' || e.pointerType === 'pen') {
        hasInteractedWithMouse = true;
      }
      x.set(Math.max(-1, Math.min(1, (e.clientX / window.innerWidth) * 2 - 1)));
      y.set(Math.max(-1, Math.min(1, (e.clientY / window.innerHeight) * 2 - 1)));
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches[0]) {
        x.set(Math.max(-1, Math.min(1, (e.touches[0].clientX / window.innerWidth) * 2 - 1)));
        y.set(Math.max(-1, Math.min(1, (e.touches[0].clientY / window.innerHeight) * 2 - 1)));
      }
    };

    const onLeave = () => {
      hasInteractedWithMouse = false;
      y.set(0);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('touchmove', onTouchMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, [reduce, x, y]);

  return { sx, sy, headRotateY, headRotateX, headX, headY, bodyX, glowX, glowY, eyeX, eyeY };
}

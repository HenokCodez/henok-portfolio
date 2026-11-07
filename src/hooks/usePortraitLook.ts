import { useEffect } from 'react';
import { useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';

export function usePortraitLook() {
  const reduce = useReducedMotion();
  const x = useMotionValue(0); // -1 … 1 (left … right)
  const y = useMotionValue(0); // -1 … 1 (top … bottom)
  
  // Spring configuration: smooth, organic, responsive tracking
  const cfg = { stiffness: 140, damping: 20, mass: 0.35 };
  const sx = useSpring(x, cfg);
  const sy = useSpring(y, cfg);

  // 3D Head rotation (yaw & pitch)
  const headRotateY = useTransform(sx, (v) => v * 14); // turns left/right ±14 deg
  const headRotateX = useTransform(sy, (v) => -v * 8);  // tilts up/down ±8 deg
  const headX = useTransform(sx, (v) => v * 12);
  const headY = useTransform(sy, (v) => v * 8);
  
  // Body stays anchored with subtle parallax
  const bodyX = useTransform(sx, (v) => v * 4);
  
  // Ambient radial glow moves in opposite direction
  const glowX = useTransform(sx, (v) => v * -24);
  const glowY = useTransform(sy, (v) => v * -16);
  
  // Eye pupils track cursor independently
  const eyeX = useTransform(sx, (v) => v * 7); // shifts pupils ±7px
  const eyeY = useTransform(sy, (v) => v * 4.5); // shifts pupils ±4.5px

  useEffect(() => {
    if (reduce) return;
    const hasMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (!hasMouse) {
      // touch devices: gentle organic sway, 6s loop
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
      // Normalize mouse to -1..1 across the viewport
      x.set((e.clientX / window.innerWidth) * 2 - 1);
      y.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    
    const onLeave = () => {
      x.set(0);
      y.set(0);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, [reduce, x, y]);

  return { headRotateY, headRotateX, headX, headY, bodyX, glowX, glowY, eyeX, eyeY };
}

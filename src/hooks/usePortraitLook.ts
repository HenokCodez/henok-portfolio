import { useEffect } from 'react';
import { useMotionValue, useSpring, useTransform, MotionValue } from 'framer-motion';

export interface PortraitLookValues {
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
  const x = useMotionValue(0); // -1 … 1 (left … right)
  const y = useMotionValue(0); // -1 … 1 (top … bottom)

  // Responsive spring with high stiffness for instant tracking and smooth damping
  const cfg = { stiffness: 220, damping: 24, mass: 0.25 };
  const sx = useSpring(x, cfg);
  const sy = useSpring(y, cfg);

  // 3D Head rotation (yaw & pitch in degrees) - clearly noticeable 3D turning
  const headRotateY = useTransform(sx, (v) => v * 16); // turns left/right ±16 deg
  const headRotateX = useTransform(sy, (v) => -v * 10); // tilts up/down ±10 deg
  const headX = useTransform(sx, (v) => v * 16);
  const headY = useTransform(sy, (v) => v * 10);

  // Body stays grounded with subtle parallax
  const bodyX = useTransform(sx, (v) => v * 5);

  // Background glow moves in opposite direction
  const glowX = useTransform(sx, (v) => v * -32);
  const glowY = useTransform(sy, (v) => v * -20);

  // Eye pupils track cursor across the eye opening (±8px X, ±5px Y)
  const eyeX = useTransform(sx, (v) => v * 8);
  const eyeY = useTransform(sy, (v) => v * 5);

  useEffect(() => {
    const handleCoord = (clientX: number, clientY: number) => {
      // Normalize to -1..1 relative to the browser viewport
      const nx = (clientX / window.innerWidth) * 2 - 1;
      const ny = (clientY / window.innerHeight) * 2 - 1;
      x.set(Math.max(-1, Math.min(1, nx)));
      y.set(Math.max(-1, Math.min(1, ny)));
    };

    const onPointerMove = (e: PointerEvent) => {
      handleCoord(e.clientX, e.clientY);
    };

    const onMouseMove = (e: MouseEvent) => {
      handleCoord(e.clientX, e.clientY);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches[0]) {
        handleCoord(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const onLeave = () => {
      x.set(0);
      y.set(0);
    };

    // Attach listeners unconditionally so it works on mouse, trackpad, pen and touch
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('pointerleave', onLeave);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, [x, y]);

  return { headRotateY, headRotateX, headX, headY, bodyX, glowX, glowY, eyeX, eyeY };
}

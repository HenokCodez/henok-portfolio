// src/hooks/useTilt.ts — 3D tilt for VideoCard (spec A5)
// Usage:
//   const tilt = useTilt(6);
//   <motion.div style={tilt.style} onPointerMove={tilt.onPointerMove} onPointerLeave={tilt.onPointerLeave} whileHover={{ scale: 1.015 }}> ... </motion.div>
import { useCallback } from 'react';
import type { PointerEvent } from 'react';
import { useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';

export function useTilt(max = 6) {
  const reduce = useReducedMotion();
  const px = useMotionValue(0); // -0.5 … 0.5
  const py = useMotionValue(0);
  const spring = { stiffness: 150, damping: 15 };
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-max, max]), spring);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [max, -max]), spring);

  const onPointerMove = useCallback((e: PointerEvent<HTMLElement>) => {
    if (reduce || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  }, [reduce, px, py]);

  const onPointerLeave = useCallback(() => { px.set(0); py.set(0); }, [px, py]);

  return { style: { rotateX, rotateY, transformPerspective: 1000 }, onPointerMove, onPointerLeave };
}

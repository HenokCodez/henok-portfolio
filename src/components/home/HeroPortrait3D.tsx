// src/components/home/HeroPortrait3D.tsx
// "Pose-blend 3D" portrait: several renders of the SAME cartoon avatar (centre, left, right, up, down).
// The centre image is always visible; the other poses fade in on top as the cursor moves, so the head appears to TURN.
// Missing pose files are simply skipped (it still works with only centre.webp).
import { useState } from 'react';
import { motion, useTransform, type MotionValue } from 'framer-motion';
import { usePortraitLook } from '../../hooks/usePortraitLook';

export interface Poses {
  center: string;
  left?: string;
  right?: string;
  up?: string;
  down?: string;
}

const DEFAULT_POSES: Poses = {
  center: '/images/portrait/center.webp',
  left: '/images/portrait/left.webp',
  right: '/images/portrait/right.webp',
  up: '/images/portrait/up.webp',
  down: '/images/portrait/down.webp',
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
// Narrow, fast transition: the head "snaps" to the new pose instead of showing a long double-exposed mix.
const smooth = (v: number, lo = 0.12, hi = 0.5) => {
  const t = clamp01((v - lo) / (hi - lo));
  return t * t * (3 - 2 * t);
};
// Only the dominant axis (horizontal OR vertical) shows a pose, so diagonals never mix two faces.
const dominance = (a: number, b: number) => clamp01((a - b) / 0.25 + 0.5);

function PoseLayer({ src, opacity }: { src: string; opacity: MotionValue<number> }) {
  const [ok, setOk] = useState(true);
  if (!ok) return null;
  return (
    <motion.img
      src={src}
      alt=""
      aria-hidden="true"
      draggable={false}
      onError={() => setOk(false)}
      className="pointer-events-none absolute inset-0 h-full w-full object-contain object-bottom select-none"
      style={{ opacity }}
    />
  );
}

export interface HeroPortrait3DProps {
  poses?: Poses;
  alt?: string;
}

export function HeroPortrait3D({
  poses = DEFAULT_POSES,
  alt = 'Cartoon portrait of Henok wearing headphones',
}: HeroPortrait3DProps) {
  const look = usePortraitLook();
  const { sx, sy } = look;

  // Pose weights (0..1)
  const wLeft = useTransform([sx, sy], ([x, y]: number[]) =>
    x < 0 ? smooth(-x) * dominance(Math.abs(x), Math.abs(y)) : 0,
  );
  const wRight = useTransform([sx, sy], ([x, y]: number[]) =>
    x > 0 ? smooth(x) * dominance(Math.abs(x), Math.abs(y)) : 0,
  );
  const wUp = useTransform([sx, sy], ([x, y]: number[]) =>
    y < 0 ? smooth(-y) * dominance(Math.abs(y), Math.abs(x)) : 0,
  );
  const wDown = useTransform([sx, sy], ([x, y]: number[]) =>
    y > 0 ? smooth(y) * dominance(Math.abs(y), Math.abs(x)) : 0,
  );

  // Whole-figure 3D tilt + parallax
  const rotateY = useTransform(sx, (v) => v * 6);
  const rotateX = useTransform(sy, (v) => -v * 4);
  const shiftX = useTransform(sx, (v) => v * 10);
  const shiftY = useTransform(sy, (v) => v * 5);

  return (
    <div
      className="pointer-events-none absolute bottom-[-2%] left-1/2 z-[3] -translate-x-1/2"
      style={{ perspective: 900 }}
    >
      {/* Accent back-light, moves opposite to the cursor */}
      <motion.div
        aria-hidden="true"
        className="absolute left-1/2 top-[18%] h-[70%] aspect-square -translate-x-1/2 rounded-full"
        style={{
          x: look.glowX,
          y: look.glowY,
          background: 'radial-gradient(closest-side, rgba(255,77,31,.38), transparent 70%)',
          filter: 'blur(30px)',
        }}
      />
      <motion.div
        className="relative h-[min(58svh,520px)] md:h-[min(88svh,860px)]"
        style={{
          rotateY,
          rotateX,
          x: shiftX,
          y: shiftY,
          transformStyle: 'preserve-3d',
          WebkitMaskImage: 'linear-gradient(to bottom, #000 80%, transparent 100%)',
          maskImage: 'linear-gradient(to bottom, #000 80%, transparent 100%)',
          filter:
            'drop-shadow(0 30px 50px rgba(0,0,0,.55)) drop-shadow(0 0 40px rgba(255,77,31,.16))',
        }}
      >
        {/* Centre pose defines the size */}
        <img
          src={poses.center}
          alt={alt}
          fetchPriority="high"
          draggable={false}
          className="h-full w-auto select-none"
        />
        {poses.left && <PoseLayer src={poses.left} opacity={wLeft} />}
        {poses.right && <PoseLayer src={poses.right} opacity={wRight} />}
        {poses.up && <PoseLayer src={poses.up} opacity={wUp} />}
        {poses.down && <PoseLayer src={poses.down} opacity={wDown} />}
      </motion.div>
    </div>
  );
}

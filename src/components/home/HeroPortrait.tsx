import { useState } from 'react';
import { motion } from 'framer-motion';
import type { PortraitLookValues } from '../../hooks/usePortraitLook';

export interface HeroPortraitProps {
  look: PortraitLookValues;
}

export function HeroPortrait({ look }: HeroPortraitProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="absolute left-1/2 -bottom-[30px] md:-bottom-[60px] -translate-x-1/2 w-[420px] h-[520px] md:w-[560px] md:h-[640px] z-[3] pointer-events-none select-none">
      {!imageError ? (
        <div
          className="relative w-full h-full overflow-visible"
          style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
        >
          {/* Layer 1: Body (Chest, Shoulders & T-shirt) - Anchored with subtle parallax */}
          <motion.div
            style={{ x: look.bodyX }}
            className="absolute inset-0 z-[1] will-change-transform"
          >
            <img
              src="/images/portrait-body.png"
              alt=""
              onError={() => setImageError(true)}
              className="w-full h-full object-contain object-bottom pointer-events-none"
            />
          </motion.div>

          {/* Layer 2: Head in True 3D (Pivots smoothly from neck base in perspective) */}
          <motion.div
            style={{
              x: look.headX,
              y: look.headY,
              rotateY: look.headRotateY,
              rotateX: look.headRotateX,
              transformOrigin: '50% 58%',
              transformStyle: 'preserve-3d',
            }}
            className="absolute inset-0 z-[2] will-change-transform"
          >
            {/* 2A: Head Base (Hair, headphones, face & eye sockets) */}
            <img
              src="/images/portrait-head-base.png"
              alt="Henok"
              onError={() => setImageError(true)}
              className="w-full h-full object-contain object-bottom pointer-events-none"
            />

            {/* 2B: Pupils (Smoothly follow cursor inside eye sockets) */}
            <motion.div
              style={{
                x: look.eyeX,
                y: look.eyeY,
              }}
              className="absolute inset-0 pointer-events-none z-[3] will-change-transform"
            >
              <img
                src="/images/portrait-pupils.png"
                alt=""
                onError={() => setImageError(true)}
                className="w-full h-full object-contain object-bottom pointer-events-none"
              />
            </motion.div>

            {/* 2C: Glasses Frame & Eyelids (Sits firmly in front of moving pupils) */}
            <img
              src="/images/portrait-glasses.png"
              alt=""
              onError={() => setImageError(true)}
              className="absolute inset-0 w-full h-full object-contain object-bottom pointer-events-none z-[4]"
            />
          </motion.div>
        </div>
      ) : (
        <svg
          viewBox="0 0 560 640"
          className="w-full h-full drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="skinBase" x1="280" y1="140" x2="280" y2="420" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#9e6547" />
              <stop offset="50%" stopColor="#875135" />
              <stop offset="100%" stopColor="#6e3e26" />
            </linearGradient>
            <linearGradient id="hairTexture" cx="280" cy="140" r="130" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#251c18" />
              <stop offset="70%" stopColor="#140e0b" />
              <stop offset="100%" stopColor="#0a0705" />
            </linearGradient>
            <linearGradient id="shirtGrad" x1="280" y1="440" x2="280" y2="640" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1c1c20" />
              <stop offset="60%" stopColor="#121215" />
              <stop offset="100%" stopColor="#0a0a0c" />
            </linearGradient>
            <linearGradient id="hpBand" x1="160" y1="120" x2="400" y2="120" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#18181c" />
              <stop offset="50%" stopColor="#3d3d46" />
              <stop offset="100%" stopColor="#18181c" />
            </linearGradient>
          </defs>

          {/* Body */}
          <motion.g style={{ x: look.bodyX }}>
            <path
              d="M 50 640 C 70 540, 160 480, 215 455 L 215 410 L 345 410 L 345 455 C 400 480, 490 540, 510 640 Z"
              fill="url(#shirtGrad)"
            />
          </motion.g>

          {/* Head */}
          <motion.g
            style={{
              x: look.headX,
              y: look.headY,
              rotateY: look.headRotateY,
              rotateX: look.headRotateX,
              transformOrigin: '50% 75%',
            }}
          >
            {/* Headphones */}
            <path
              d="M 166 260 C 160 140, 210 92, 280 92 C 350 92, 400 140, 394 260"
              stroke="url(#hpBand)"
              strokeWidth="18"
              strokeLinecap="round"
              fill="none"
            />
            {/* Head Contour */}
            <path
              d="M 280 148 C 215 148, 192 195, 192 258 C 192 308, 202 342, 226 372 C 246 398, 264 404, 280 404 C 296 404, 314 398, 334 372 C 358 342, 368 308, 368 258 C 368 195, 345 148, 280 148 Z"
              fill="url(#skinBase)"
            />
            {/* Hair */}
            <path
              d="M 192 220 C 188 172, 202 124, 224 114 C 256 94, 304 94, 336 114 C 358 124, 372 172, 368 220 Z"
              fill="url(#hairTexture)"
            />
            {/* Eyes */}
            <g>
              <ellipse cx="243" cy="274" rx="14" ry="8" fill="#f0ece4" />
              <ellipse cx="317" cy="274" rx="14" ry="8" fill="#f0ece4" />
            </g>
            {/* Animated Pupils */}
            <motion.g style={{ x: look.eyeX, y: look.eyeY }}>
              <circle cx="243" cy="274" r="5.5" fill="#2e1910" />
              <circle cx="243" cy="274" r="3.2" fill="#0d0705" />
              <circle cx="244.5" cy="272.5" r="1.3" fill="#ffffff" />

              <circle cx="317" cy="274" r="5.5" fill="#2e1910" />
              <circle cx="317" cy="274" r="3.2" fill="#0d0705" />
              <circle cx="318.5" cy="272.5" r="1.3" fill="#ffffff" />
            </motion.g>
          </motion.g>
        </svg>
      )}
    </div>
  );
}

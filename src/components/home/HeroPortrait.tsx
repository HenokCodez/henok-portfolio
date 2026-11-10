import { motion, useReducedMotion } from 'framer-motion';
import { usePortraitLook } from '../../hooks/usePortraitLook';

export function HeroPortrait() {
  const look = usePortraitLook();
  const prefersReduced = useReducedMotion();

  return (
    <div className="absolute left-1/2 -bottom-[30px] min-[701px]:-bottom-[60px] -translate-x-1/2 w-[420px] h-[520px] min-[701px]:w-[560px] min-[701px]:h-[640px] z-[3] pointer-events-none select-none">
      <div className="relative w-full h-full">
        {/* Torso / Body (moves with cursor bodyX) */}
        <motion.div
          style={prefersReduced ? undefined : { x: look.bodyX }}
          className="char-body"
        />

        {/* Head + Features Container (Rotates and shifts in 3D perspective with cursor) */}
        <motion.div
          style={
            prefersReduced
              ? undefined
              : {
                  x: look.headX,
                  y: look.headY,
                  rotateY: look.headRotateY,
                  rotateX: look.headRotateX,
                  transformPerspective: 800,
                }
          }
          className="absolute inset-0"
        >
          {/* Head Base */}
          <div className="char-head" />

          {/* Ears */}
          <div className="char-ear char-ear-l" />
          <div className="char-ear char-ear-r" />

          {/* Fitted Streetwear Cap Crown */}
          <div className="char-cap-crown" />
          <div className="char-cap-seam" />
          <div className="char-cap-button" />

          {/* Curved Cap Visor / Brim + Forehead Drop Shadow */}
          <div className="char-cap-brim" />
          <div className="char-cap-shadow" />

          {/* Soft Eyebrows (lift slightly when looking up) */}
          <motion.div
            style={prefersReduced ? undefined : { y: look.browY }}
            className="char-brow char-brow-l"
          />
          <motion.div
            style={prefersReduced ? undefined : { y: look.browY }}
            className="char-brow char-brow-r"
          />

          {/* Eyes with Dynamic Curved Eyelid + Tracking Glossy Pupils */}
          <div className="char-eye char-eye-l">
            <motion.div
              style={prefersReduced ? undefined : { x: look.eyeX, y: look.eyeY }}
              className="char-pupil"
            >
              <div className="char-pupil-glint" />
            </motion.div>
            <motion.div
              style={prefersReduced ? undefined : { y: look.lidY }}
              className="char-eye-lid-wrap"
            >
              <svg viewBox="0 0 40 12" className="w-full h-full" aria-hidden="true">
                <path d="M 0 0 L 40 0 L 40 2.5 Q 20 6 0 2.5 Z" fill="#8c573f" />
                <path d="M 0 2.5 Q 20 6 40 2.5" fill="none" stroke="#5a3320" strokeWidth="1.5" />
              </svg>
            </motion.div>
          </div>

          <div className="char-eye char-eye-r">
            <motion.div
              style={prefersReduced ? undefined : { x: look.eyeX, y: look.eyeY }}
              className="char-pupil"
            >
              <div className="char-pupil-glint" />
            </motion.div>
            <motion.div
              style={prefersReduced ? undefined : { y: look.lidY }}
              className="char-eye-lid-wrap"
            >
              <svg viewBox="0 0 40 12" className="w-full h-full" aria-hidden="true">
                <path d="M 0 0 L 40 0 L 40 2.5 Q 20 6 0 2.5 Z" fill="#8c573f" />
                <path d="M 0 2.5 Q 20 6 40 2.5" fill="none" stroke="#5a3320" strokeWidth="1.5" />
              </svg>
            </motion.div>
          </div>

          {/* Minimalist Stylized Nose */}
          <div className="char-nose" />

          {/* Warm, Confident Closed-Lip Smile (No creepy teeth) */}
          <div className="char-smile">
            <svg
              viewBox="0 0 68 20"
              className="w-full h-full overflow-visible"
              aria-hidden="true"
            >
              {/* Natural curved smile stroke */}
              <path
                d="M 8 6 Q 34 20 60 6"
                fill="none"
                stroke="#2a150c"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              {/* Gentle subtle dimple upturns at the corners */}
              <path
                d="M 8 6 Q 6 3 5 2"
                fill="none"
                stroke="#2a150c"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M 60 6 Q 62 3 63 2"
                fill="none"
                stroke="#2a150c"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

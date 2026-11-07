import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { siteConfig } from '../../config/site';
import { HeroPortrait3D } from './HeroPortrait3D';
import { HeroTimecode } from './HeroTimecode';

export function Hero() {
  const prefersReduced = useReducedMotion();
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 900], [0, -108]);

  return (
    <section className="relative w-full h-[900px] overflow-hidden bg-bg select-none">
      {/* [3] Intro Line */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-x-0 top-[84px] md:top-[104px] z-10 text-center pointer-events-none"
      >
        <p className="font-mono text-[11px] uppercase tracking-mono text-muted mb-3.5">
          [ {siteConfig.roleLong} ]
        </p>
        <p className="font-display font-bold text-2xl sm:text-3xl md:text-[38px] tracking-[-0.03em] text-text">
          I turn ideas into
        </p>
      </motion.div>

      {/* [4] Giant Word "stories." with Parallax */}
      <motion.div
        style={prefersReduced ? undefined : { y: parallaxY }}
        initial={{ opacity: 0, y: '40%' }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-x-0 top-[150px] z-[1] text-center pointer-events-none"
      >
        <h1 className="leading-[0.8] tracking-display">
          <span
            className="font-serif italic text-accent"
            style={{ fontSize: 'clamp(120px, 24vw, 360px)' }}
          >
            stories.
          </span>
        </h1>
      </motion.div>

      {/* [5] 3D Pose-Blend Portrait */}
      <HeroPortrait3D />

      {/* [6] Side Blocks */}
      {/* Left Block */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute left-5 md:left-10 top-[620px] md:top-[520px] z-10 select-none"
      >
        <span className="block font-serif italic text-[17px] md:text-[26px] text-accent mb-1.5">
          Hello, I&apos;m
        </span>
        <b className="font-display font-extrabold text-2xl md:text-[46px] uppercase tracking-[-0.04em] leading-[0.95] text-text">
          {siteConfig.name.toUpperCase()}
        </b>
      </motion.div>

      {/* Right Block */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute right-5 md:right-10 top-[710px] md:top-[520px] z-10 text-right select-none"
      >
        <span className="block font-serif italic text-[17px] md:text-[26px] text-accent mb-1.5">
          Based in {siteConfig.location.label}
        </span>
        <b className="font-display font-extrabold text-2xl md:text-[46px] uppercase tracking-[-0.04em] leading-[0.95] text-text">
          WORKING<br />WORLDWIDE
        </b>
      </motion.div>

      {/* Vertical Socials (Desktop Only) */}
      <div className="hidden md:flex flex-col gap-3.5 absolute left-10 bottom-9 z-10">
        {siteConfig.socials.youtube && (
          <a
            href={siteConfig.socials.youtube}
            target="_blank"
            rel="noreferrer"
            aria-label="YouTube"
            className="w-8 h-8 rounded-full border border-line-strong flex items-center justify-center text-xs text-muted hover:text-text hover:border-accent hover:bg-surface-2 transition-all"
          >
            YT
          </a>
        )}
        {siteConfig.socials.instagram && (
          <a
            href={siteConfig.socials.instagram}
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="w-8 h-8 rounded-full border border-line-strong flex items-center justify-center text-xs text-muted hover:text-text hover:border-accent hover:bg-surface-2 transition-all"
          >
            IG
          </a>
        )}
        {siteConfig.socials.linkedin && (
          <a
            href={siteConfig.socials.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="w-8 h-8 rounded-full border border-line-strong flex items-center justify-center text-xs text-muted hover:text-text hover:border-accent hover:bg-surface-2 transition-all"
          >
            IN
          </a>
        )}
      </div>

      {/* [7] Hero Footer Row */}
      <div className="absolute inset-x-0 bottom-9 z-10">
        <div className="container-x flex flex-col md:flex-row md:items-end justify-between gap-3 text-muted font-mono text-[11px] tracking-mono uppercase">
          <span className="hidden md:inline-block">↓ Scroll to explore</span>
          <HeroTimecode />
          <span className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-ok shadow-[0_0_8px_currentColor] text-ok" />
            <span>Available — Nov 2026</span>
          </span>
        </div>
      </div>
    </section>
  );
}

import { useState, useEffect } from 'react';
import { Star, CheckCircle2, Eye, X, ZoomIn, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { siteConfig } from '../../config/site';
import { SectionHeading } from '../ui/SectionHeading';
import { Reveal } from '../ui/Reveal';

interface ProofModalState {
  src: string;
  title: string;
  subtitle: string;
}

export function Testimonials() {
  const [activeProof, setActiveProof] = useState<ProofModalState | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Close modal on Escape key & handle body scroll lock
  useEffect(() => {
    if (!activeProof) return;
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveProof(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.documentElement.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeProof]);

  if (!siteConfig.testimonials || siteConfig.testimonials.length === 0) {
    return null;
  }

  // Display testimonials up to 3
  const testimonials = siteConfig.testimonials.length >= 3
    ? siteConfig.testimonials.slice(0, 3)
    : siteConfig.testimonials;

  return (
    <section className="py-section pt-16 md:pt-20 bg-bg border-t border-line relative">
      <div className="container-x">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <SectionHeading
              label="[ 04 — Client feedback ]"
              title="CLIENT"
              accentWord="love"
            />

            {/* Upwork Profile Proof Badge */}
            <button
              type="button"
              onClick={() =>
                setActiveProof({
                  src: '/images/upwork-profile-proof.png',
                  title: 'Henok B. — Upwork Profile',
                  subtitle: '100% Job Success Score · YouTube Video Editor | Educational & Documentary',
                })
              }
              className="inline-flex items-center gap-2 self-start md:self-auto px-4 py-2 rounded-full bg-accent/10 border border-accent/25 hover:border-accent text-accent font-mono text-xs font-semibold mb-8 md:mb-12 transition-all duration-200 group cursor-pointer"
              title="Click to view verified Upwork profile screenshot"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
              <span>100% Job Success on Upwork</span>
              <span className="text-[10px] text-muted group-hover:text-text transition-colors border-l border-accent/30 pl-2 ml-0.5 flex items-center gap-1">
                View profile <ExternalLink className="w-2.5 h-2.5" />
              </span>
            </button>
          </div>
        </Reveal>

        {/* 3 Feedback Cards with Real Screenshot Hover Overlay */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => {
            const screenshotUrl = t.screenshotUrl || '/images/upwork-profile-proof.png';
            const isHovered = hoveredIdx === idx;

            return (
              <Reveal key={idx} delay={idx * 0.1}>
                <div
                  className="relative h-full min-h-[340px] p-7 md:p-8 rounded-card bg-surface border border-line flex flex-col justify-between hover:border-accent/40 transition-all duration-300 select-none group overflow-hidden cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  onClick={() =>
                    setActiveProof({
                      src: screenshotUrl,
                      title: t.name,
                      subtitle: `${t.role} · Verified Upwork Contract`,
                    })
                  }
                  tabIndex={0}
                  role="button"
                  aria-label={`View verified Upwork review screenshot for ${t.name}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setActiveProof({
                        src: screenshotUrl,
                        title: t.name,
                        subtitle: `${t.role} · Verified Upwork Contract`,
                      });
                    }
                  }}
                >
                  {/* Card Content */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-5">
                      <div className="flex items-center gap-1 text-accent">
                        {[...Array(t.rating ?? 5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                        ))}
                        <span className="font-mono text-xs font-semibold ml-1.5 text-text">
                          5.0
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {t.tag && (
                          <span className="font-mono text-[11px] px-2.5 py-0.5 rounded-full bg-surface-2 border border-line text-muted">
                            {t.tag}
                          </span>
                        )}
                        <span className="p-1 rounded bg-surface-3 border border-line text-muted group-hover:text-accent transition-colors" title="Hover or click to see Upwork screenshot">
                          <Eye className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>

                    <p className="text-base sm:text-lg md:text-[17px] leading-[1.55] text-text">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                  </div>

                  {/* Client Info + View Proof pill */}
                  <div>
                    <div className="flex items-center justify-between gap-3.5 mt-8 pt-5 border-t border-line/60">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-full bg-surface-3 border border-line flex items-center justify-center font-mono text-xs text-accent font-semibold shrink-0">
                          {t.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-display font-semibold text-sm text-text leading-tight">
                            {t.name}
                          </h4>
                          <p className="font-mono text-xs text-muted leading-tight mt-0.5">
                            {t.role}
                          </p>
                        </div>
                      </div>

                      <span className="font-mono text-[11px] text-accent/80 group-hover:text-accent flex items-center gap-1 shrink-0">
                        Proof <ZoomIn className="w-3 h-3" />
                      </span>
                    </div>
                  </div>

                  {/* Desktop Hover Overlay: Actual Upwork Screenshot Preview */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: 12, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute inset-0 z-20 bg-[#0e0e11]/98 backdrop-blur-md p-5 flex flex-col justify-between border-2 border-accent/60 rounded-card"
                      >
                        {/* Overlay Header */}
                        <div className="flex items-center justify-between pb-3 border-b border-line">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#14a800] animate-pulse" />
                            <span className="font-mono text-xs text-text font-semibold uppercase tracking-wider">
                              Verified Upwork Review
                            </span>
                          </div>
                          <span className="font-mono text-[11px] text-accent flex items-center gap-1">
                            Click to enlarge <ZoomIn className="w-3 h-3" />
                          </span>
                        </div>

                        {/* Screenshot Visual Frame */}
                        <div className="my-auto w-full max-h-[190px] overflow-hidden rounded-md border border-line bg-white shadow-2xl">
                          <img
                            src={screenshotUrl}
                            alt={`Upwork verified proof for ${t.name}`}
                            className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        </div>

                        {/* Overlay Footer Note */}
                        <div className="pt-2 text-center">
                          <span className="font-mono text-[11px] text-muted">
                            {t.role} · 5.0 ★ Rating
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>

      {/* Full-Screen Verified Screenshot Lightbox Modal */}
      <AnimatePresence>
        {activeProof && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/85 backdrop-blur-md"
            onClick={() => setActiveProof(null)}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 15 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-w-4xl w-full max-h-[90vh] bg-surface border border-line rounded-card overflow-hidden shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-line bg-surface-2 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#14a800]" />
                    <h3 className="font-display font-bold text-base sm:text-lg text-text">
                      {activeProof.title}
                    </h3>
                  </div>
                  <p className="font-mono text-xs text-muted mt-0.5">
                    {activeProof.subtitle}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveProof(null)}
                  className="w-9 h-9 rounded-full bg-surface-3 border border-line flex items-center justify-center text-text hover:text-accent hover:border-accent transition-colors"
                  aria-label="Close screenshot preview"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Image Body with Scroll */}
              <div className="p-4 sm:p-6 overflow-auto max-h-[calc(90vh-120px)] bg-[#121215] flex items-center justify-center">
                <img
                  src={activeProof.src}
                  alt={activeProof.title}
                  className="w-full max-w-full rounded border border-line shadow-lg bg-white"
                />
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-3 border-t border-line bg-surface-2 flex items-center justify-between text-xs font-mono text-muted">
                <span>Verified Upwork Track Record</span>
                <span className="text-accent">100% Job Success</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

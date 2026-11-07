import { useState, useEffect, useRef } from 'react';
import { formatTimecode } from '../../lib/format';

export function HeroTimecode() {
  const [frames, setFrames] = useState(12 * 24 + 4);
  const containerRef = useRef<HTMLSpanElement>(null);
  const isVisibleRef = useRef(true);

  useEffect(() => {
    // Pause animation when off-screen
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    let animId: number;
    let lastTime = performance.now();

    function step(now: number) {
      if (document.hidden || !isVisibleRef.current) {
        lastTime = now;
        animId = requestAnimationFrame(step);
        return;
      }
      if (now - lastTime >= 1000 / 24) {
        setFrames((f) => (f + 1) % (24 * 60 * 60));
        lastTime = now;
      }
      animId = requestAnimationFrame(step);
    }

    animId = requestAnimationFrame(step);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animId);
    };
  }, []);

  const timecode = formatTimecode(frames);

  return (
    <span ref={containerRef} className="text-text flex items-center gap-2 self-start md:self-auto">
      <span>{timecode}</span>
      <span className="inline-block w-2 h-2 rounded-full bg-accent animate-pulse" />
      <span>REC</span>
    </span>
  );
}

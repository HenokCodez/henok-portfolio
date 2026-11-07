import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '../../lib/cn';

export interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  yOffset?: number;
  className?: string;
}

export function Reveal({
  children,
  delay = 0,
  duration = 0.8,
  yOffset = 40,
  className,
}: RevealProps) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      initial={
        prefersReduced
          ? { opacity: 0 }
          : { opacity: 0, y: yOffset }
      }
      whileInView={
        prefersReduced
          ? { opacity: 1 }
          : { opacity: 1, y: 0 }
      }
      viewport={{ once: true, margin: '-80px' }}
      transition={{
        duration: prefersReduced ? 0.2 : duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

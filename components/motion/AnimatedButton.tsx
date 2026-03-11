'use client';

import { motion } from 'framer-motion';

const spring = { type: 'spring' as const, stiffness: 300, damping: 25 };

interface AnimatedButtonProps {
  children: React.ReactNode;
  /** Apply to wrapper, e.g. 'rounded-r' when hoverShadow is used */
  className?: string;
  hoverY?: number;
  hoverShadow?: string;
}

export function AnimatedButton({
  children,
  className,
  hoverY = -2,
  hoverShadow,
}: AnimatedButtonProps) {
  return (
    <motion.div
      className={`inline-flex${className ? ` ${className}` : ''}`}
      whileHover={hoverShadow ? { y: hoverY, boxShadow: hoverShadow } : { y: hoverY }}
      transition={spring}
    >
      {children}
    </motion.div>
  );
}

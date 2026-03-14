"use client";

import { motion } from "framer-motion";

const spring = { type: "spring" as const, stiffness: 300, damping: 25 };

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  hoverY?: number;
  hoverShadow?: string;
  onClick?: () => void;
}

export function AnimatedCard({
  children,
  className,
  hoverY = -6,
  hoverShadow = "0 12px 28px rgba(0,0,0,0.08),0 4px 10px rgba(0,0,0,0.04)",
  onClick,
}: AnimatedCardProps) {
  return (
    <motion.div
      className={className}
      onClick={onClick}
      whileHover={{ y: hoverY, boxShadow: hoverShadow }}
      transition={spring}
    >
      {children}
    </motion.div>
  );
}

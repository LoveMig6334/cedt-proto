"use client";

import BullLogo from "@/components/BullLogo";
import { motion } from "framer-motion";

const spring = { type: "spring" as const, stiffness: 300, damping: 25 };

interface AnimatedBullLogoProps {
  size?: number;
}

export function AnimatedBullLogo({ size }: AnimatedBullLogoProps) {
  return (
    <motion.div
      className="inline-flex"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={spring}
    >
      <BullLogo size={size} className="drop-shadow-sm" />
    </motion.div>
  );
}

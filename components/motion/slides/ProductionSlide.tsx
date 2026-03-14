"use client";

import { motion } from "framer-motion";
import type { SlideProps } from "@/components/motion/slides/SourcingSlide";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { ease: [0.16, 1, 0.3, 1], duration: 0.5 },
  },
};

const lines = [
  {
    label: "สายผลิต A",
    statusLabel: "กำลังผลิต",
    statusClass: "bg-fp-green/10 text-fp-green text-[10px] font-semibold rounded-full px-2 py-0.5",
    waste: "เสีย 2.1%",
    barTarget: 0.78,
    barDelay: 0.3,
  },
  {
    label: "สายผลิต B",
    statusLabel: "หยุดพัก",
    statusClass: "bg-fp-yellow/10 text-fp-yellow text-[10px] font-semibold rounded-full px-2 py-0.5",
    waste: "เสีย 5.3%",
    barTarget: 0.45,
    barDelay: 0.42,
  },
  {
    label: "สายผลิต C",
    statusLabel: "กำลังผลิต",
    statusClass: "bg-fp-green/10 text-fp-green text-[10px] font-semibold rounded-full px-2 py-0.5",
    waste: "เสีย 1.8%",
    barTarget: 0.92,
    barDelay: 0.54,
  },
];

export function ProductionSlide({ isActive }: SlideProps) {
  return (
    <div className="w-full max-w-[420px] relative flex flex-col gap-2">
      <motion.div
        className="flex flex-col gap-2 w-full"
        variants={containerVariants}
        initial="hidden"
        animate={isActive ? "visible" : "hidden"}
      >
        {/* KPI strip */}
        <motion.div className="flex gap-3" variants={itemVariants}>
          <span className="bg-p-50 border border-p-100 rounded-full px-3 py-1 text-[11px] font-semibold text-p-500">
            ผลผลิตวันนี้ 378 กก.
          </span>
          <span className="bg-cream border border-n-200 rounded-full px-3 py-1 text-[11px] font-semibold text-n-700">
            ประสิทธิภาพ 97.2%
          </span>
        </motion.div>

        {/* Production line rows */}
        {lines.map((line) => (
          <motion.div
            key={line.label}
            variants={itemVariants}
            className="bg-white border border-n-200 rounded-r px-3.5 py-2.5 flex flex-col gap-1.5"
          >
            {/* Top row */}
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-semibold text-n-900">
                {line.label}
              </span>
              <div className="flex items-center gap-1.5">
                <span className={line.statusClass}>{line.statusLabel}</span>
                <span className="text-fp-red text-[10px] font-medium">
                  {line.waste}
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 bg-n-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-p-400"
                style={{ transformOrigin: "left" }}
                initial={{ scaleX: 0 }}
                animate={isActive ? { scaleX: line.barTarget } : { scaleX: 0 }}
                transition={{
                  delay: isActive ? line.barDelay : 0,
                  ease: [0.16, 1, 0.3, 1],
                  duration: 0.7,
                }}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

"use client";

import type { SlideProps } from "@/components/motion/slides/SourcingSlide";
import { motion } from "framer-motion";

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

const metrics = [
  { name: "สี", color: "bg-p-400", scaleX: 0.92, delay: 0.3, score: "92%" },
  {
    name: "ความชื้น",
    color: "bg-[#3B82F6]",
    scaleX: 0.85,
    delay: 0.42,
    score: "85%",
  },
  {
    name: "ความสมบูรณ์",
    color: "bg-fp-green",
    scaleX: 0.97,
    delay: 0.54,
    score: "97%",
  },
  {
    name: "ไขมันแทรก",
    color: "bg-[#F59E0B]",
    scaleX: 0.78,
    delay: 0.66,
    score: "78%",
  },
];

export function QCSlide({ isActive }: SlideProps) {
  return (
    <motion.div
      className="w-full max-w-105 flex flex-col gap-3"
      variants={containerVariants}
      initial="hidden"
      animate={isActive ? "visible" : "hidden"}
    >
      {/* 1. Scanner panel */}
      <motion.div
        className="bg-n-900 rounded-r p-4 relative overflow-hidden h-30"
        variants={itemVariants}
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg,transparent,transparent 22px,rgba(244,114,182,.04) 22px,rgba(244,114,182,.04) 23px)",
        }}
      >
        {/* Corner brackets */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-p-400 rounded-[4px_0_0_0]" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-p-400 rounded-[0_0_4px_0]" />

        {/* Center content */}
        <div className="flex items-center justify-center gap-3 h-full">
          <span className="text-[32px]">🥩</span>
          <div className="flex flex-col">
            <span className="text-white text-[12px] font-semibold">
              AI กำลังสแกน...
            </span>
            <span className="text-white/40 text-[10px]">
              ล็อต #LP-2025-0442
            </span>
          </div>
        </div>

        {/* Scan line */}
        <motion.div
          className="absolute left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-p-400 to-transparent"
          animate={{ top: ["5%", "5%", "95%", "95%"], opacity: [0, 1, 1, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
            times: [0, 0.2, 0.8, 1],
          }}
        />
      </motion.div>

      {/* 2. Metric bars section */}
      <motion.div variants={itemVariants}>
        <p className="text-n-400 text-[10.5px] font-semibold uppercase tracking-wider mb-2">
          ผลการวิเคราะห์
        </p>
        <div className="flex flex-col gap-2">
          {metrics.map((metric) => (
            <div key={metric.name} className="flex items-center gap-2">
              <span className="text-n-500 text-[11px] w-20">{metric.name}</span>
              <div className="flex-1 h-1.5 bg-n-100 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${metric.color}`}
                  style={{ transformOrigin: "left" }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: isActive ? metric.scaleX : 0 }}
                  transition={{
                    delay: isActive ? metric.delay : 0,
                    ease: [0.16, 1, 0.3, 1],
                    duration: 0.7,
                  }}
                />
              </div>
              <span className="text-n-900 text-[11px] font-bold w-10 text-right">
                {metric.score}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 3. Grade circle */}
      <motion.div
        className="flex items-center justify-center"
        variants={itemVariants}
      >
        <motion.div
          className="bg-fp-green rounded-full w-16 h-16 flex flex-col items-center justify-center shadow-[0_4px_20px_rgba(16,185,129,.35)]"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={
            isActive ? { scale: 1, opacity: 1 } : { scale: 0.5, opacity: 0 }
          }
          transition={{
            delay: 0.9,
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
        >
          <span className="text-white text-[22px] font-extrabold leading-none">
            A
          </span>
          <span className="text-white text-[10px] font-semibold">97.4%</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

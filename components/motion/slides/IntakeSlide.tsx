"use client";

import { motion } from "framer-motion";
import type { SlideProps } from "@/components/motion/slides/SourcingSlide";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
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

function CheckmarkFirst() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <motion.circle
        cx="10"
        cy="10"
        r="8"
        stroke="#10B981"
        strokeWidth="1.5"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4, ease: "easeOut" }}
      />
      <motion.path
        d="M6.5 10l2.5 2.5 4.5-4.5"
        stroke="#10B981"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.8, duration: 0.3, ease: "easeOut" }}
      />
    </svg>
  );
}

function CheckmarkSecond() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <motion.circle
        cx="10"
        cy="10"
        r="8"
        stroke="#10B981"
        strokeWidth="1.5"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.4, ease: "easeOut" }}
      />
      <motion.path
        d="M6.5 10l2.5 2.5 4.5-4.5"
        stroke="#10B981"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 1.1, duration: 0.3, ease: "easeOut" }}
      />
    </svg>
  );
}

export function IntakeSlide({ isActive }: SlideProps) {
  return (
    <div className="w-full max-w-[420px] relative">
      <motion.div
        className="flex flex-col gap-2.5 w-full"
        variants={containerVariants}
        animate={isActive ? "visible" : "hidden"}
        initial="hidden"
      >
        {/* Timestamp pill */}
        <motion.div variants={itemVariants}>
          <div className="bg-n-900 text-white text-[10.5px] font-semibold rounded-full px-3 py-1 inline-flex items-center gap-1.5 self-start">
            <span>🕐</span>
            <span>08:15 · 10 มี.ค. 2568</span>
          </div>
        </motion.div>

        {/* Field row 1: ผู้จัดส่ง */}
        <motion.div variants={itemVariants}>
          <div className="bg-white border border-n-200 rounded-r px-3.5 py-2.5 flex items-center justify-between">
            <div>
              <div className="text-n-400 text-[11px]">ผู้จัดส่ง</div>
              <div className="text-n-900 text-[13px] font-semibold">
                สมศรี ฟาร์ม
              </div>
            </div>
            <CheckmarkFirst />
          </div>
        </motion.div>

        {/* Field row 2: น้ำหนักรวม */}
        <motion.div variants={itemVariants}>
          <div className="bg-white border border-n-200 rounded-r px-3.5 py-2.5 flex items-center justify-between">
            <div>
              <div className="text-n-400 text-[11px]">น้ำหนักรวม</div>
              <div className="text-n-900 text-[13px] font-semibold">
                320 กก.
              </div>
            </div>
            <CheckmarkSecond />
          </div>
        </motion.div>

        {/* Photo upload zone */}
        <motion.div variants={itemVariants}>
          <div className="border-2 border-dashed border-p-300 rounded-r h-[90px] relative overflow-hidden flex flex-col items-center justify-center gap-1 bg-p-50">
            <span className="text-[22px]">📷</span>
            <span className="text-p-400 text-[11px] font-medium">
              อัปโหลดรูปภาพ
            </span>
            {/* Scan line */}
            <motion.div
              className="absolute left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-p-400 to-transparent"
              animate={{
                top: ["5%", "5%", "95%", "95%"],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
                times: [0, 0.2, 0.8, 1],
              }}
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import type { SlideProps } from "@/components/motion/slides/SourcingSlide";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { ease: [0.16, 1, 0.3, 1], duration: 0.5 } },
};

const bars = [
  { height: 62, colorClass: "bg-p-300" },
  { height: 75, colorClass: "bg-p-400" },
  { height: 55, colorClass: "bg-p-300" },
  { height: 88, colorClass: "bg-p-500" },
  { height: 70, colorClass: "bg-p-400" },
  { height: 95, colorClass: "bg-p-500" },
];

const months = ["ต.ค.", "พ.ย.", "ธ.ค.", "ม.ค.", "ก.พ.", "มี.ค."];

const kpis = [
  { dotColor: "#10B981", label: "ยอดขายเดือนนี้", value: "฿2.8M" },
  { dotColor: "#EC4899", label: "ออร์เดอร์", value: "47 รายการ" },
  { dotColor: "#3B82F6", label: "ลูกค้าใหม่", value: "3 ราย" },
];

export function SalesSlide({ isActive }: SlideProps) {
  return (
    <motion.div
      className="w-full max-w-[420px] flex flex-col gap-3"
      variants={containerVariants}
      initial="hidden"
      animate={isActive ? "visible" : "hidden"}
    >
      {/* 1. Delivery truck row */}
      <motion.div variants={itemVariants} className="relative h-7 w-full">
        {/* Dotted track line */}
        <div className="absolute top-1/2 left-0 right-0 h-px border-t-2 border-dashed border-n-200 -translate-y-1/2" />
        {/* Truck */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 text-[18px]"
          animate={{ x: ["0%", "85%", "0%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          🚚
        </motion.div>
      </motion.div>

      {/* 2. Bar chart */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-r p-3 border border-n-200"
      >
        <div className="text-[10px] text-n-400 font-semibold mb-2">
          ยอดขายรายเดือน
        </div>
        <div className="flex items-end gap-1.5 h-[80px]">
          {bars.map((bar, i) => (
            <motion.div
              key={i}
              className={`flex-1 rounded-[3px_3px_0_0] ${bar.colorClass}`}
              style={{ height: `${bar.height}%`, transformOrigin: "bottom" }}
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              transition={{
                delay: 0.5 + i * 0.07,
                ease: [0.16, 1, 0.3, 1],
                duration: 0.8,
              }}
            />
          ))}
        </div>
        <div className="flex mt-1">
          {months.map((month) => (
            <div
              key={month}
              className="text-[9px] text-n-400 text-center flex-1"
            >
              {month}
            </div>
          ))}
        </div>
      </motion.div>

      {/* 3. KPI rows */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-r p-3 border border-n-200 flex flex-col gap-2"
      >
        {kpis.map((kpi) => (
          <div key={kpi.label} className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full flex-none"
              style={{ backgroundColor: kpi.dotColor }}
            />
            <span className="text-[11px] text-n-500 flex-1">{kpi.label}</span>
            <span className="text-[13px] font-bold text-n-900">{kpi.value}</span>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}

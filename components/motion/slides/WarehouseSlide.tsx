"use client";

import { motion } from "framer-motion";
import type { SlideProps } from "@/components/motion/slides/SourcingSlide";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.93, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { ease: [0.16, 1, 0.3, 1], duration: 0.45 },
  },
};

type SlotStatus = "green" | "pink" | "red";

interface Slot {
  name: string;
  weight: string;
  status: SlotStatus;
}

const slots: Slot[] = [
  { name: "เนื้อสันใน", weight: "45 กก.", status: "green" },
  { name: "ซี่โครง", weight: "32 กก.", status: "green" },
  { name: "เนื้อบด", weight: "28 กก.", status: "pink" },
  { name: "ขาหมู", weight: "61 กก.", status: "red" },
  { name: "สันคอ", weight: "19 กก.", status: "green" },
  { name: "เนื้อแล่", weight: "38 กก.", status: "green" },
];

const statusDotColor: Record<SlotStatus, string> = {
  green: "#10B981",
  pink: "#EC4899",
  red: "#EF4444",
};

function SlotCard({ slot }: { slot: Slot }) {
  const dotColor = statusDotColor[slot.status];

  const cardInner = (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-n-900">{slot.name}</span>
        <span
          className="w-2 h-2 rounded-full inline-block"
          style={{ backgroundColor: dotColor }}
        />
      </div>
      <span className="text-[10px] text-n-500">{slot.weight}</span>
      <span className="bg-n-900 text-white text-[9px] rounded px-1.5 py-0.5 self-start">
        -2°C
      </span>
    </div>
  );

  if (slot.status === "red") {
    return (
      <motion.div variants={itemVariants}>
        <motion.div
          animate={{ borderColor: ["#FCA5A5", "#EF4444", "#FCA5A5"] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="bg-white border-2 rounded-r px-2.5 py-2 flex flex-col gap-0.5"
        >
          {cardInner}
        </motion.div>
      </motion.div>
    );
  }

  const borderClass =
    slot.status === "pink" ? "border border-p-100" : "border border-n-200";

  return (
    <motion.div variants={itemVariants}>
      <div className={`bg-white ${borderClass} rounded-r px-2.5 py-2 flex flex-col gap-0.5`}>
        {cardInner}
      </div>
    </motion.div>
  );
}

export function WarehouseSlide({ isActive }: SlideProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate={isActive ? "visible" : "hidden"}
      className="w-full max-w-[420px] flex gap-3"
    >
      {/* Left: storage grid */}
      <div className="flex-1 flex flex-col gap-2.5">
        <p className="text-[11px] font-semibold text-n-500 uppercase tracking-wider mb-1">
          จัดการสินค้าคงคลัง
        </p>
        <div className="grid grid-cols-2 gap-2">
          {slots.map((slot) => (
            <SlotCard key={slot.name} slot={slot} />
          ))}
        </div>
      </div>

      {/* Right: thermometer */}
      <div className="flex flex-col items-center gap-1.5 w-8">
        <span
          className="text-[9px] text-n-400 font-semibold"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          อุณหภูมิ
        </span>
        <div className="w-4 flex-1 bg-n-100 rounded-full relative overflow-hidden min-h-[140px]">
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-[#3B82F6] rounded-full"
            initial={{ height: "0%" }}
            animate={isActive ? { height: "35%" } : { height: "0%" }}
            transition={{ delay: 0.5, ease: [0.16, 1, 0.3, 1], duration: 1 }}
          />
        </div>
        <span className="text-[10px] font-bold text-n-900">-2°C</span>
        <div className="w-5 h-5 bg-[#3B82F6] rounded-full" />
      </div>
    </motion.div>
  );
}

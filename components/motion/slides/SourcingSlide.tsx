"use client";

import { motion } from "framer-motion";

export interface SlideProps {
  isActive: boolean;
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { ease: [0.16, 1, 0.3, 1], duration: 0.55 },
  },
};

const suppliers = [
  {
    rank: "#1",
    name: "สมศรี ฟาร์ม",
    location: "นครราชสีมา",
    score: "96/100",
    barTarget: 1,
    barDelay: 0.4,
    cardClass: "bg-[#FFF0F7] border border-[#EC4899] rounded-r px-3.5 py-2.5",
    rankBadgeClass:
      "bg-[#EC4899] text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0",
    scoreBadgeClass:
      "bg-[#EC4899] text-white text-[11px] font-bold rounded-full px-2 py-0.5",
    barClass: "h-full bg-[#EC4899] rounded-full",
  },
  {
    rank: "#2",
    name: "อุดม ฟาร์มวัว",
    location: "ลพบุรี",
    score: "88/100",
    barTarget: 0.88,
    barDelay: 0.55,
    cardClass: "bg-white border border-[#FCE7F3] rounded-r px-3.5 py-2.5",
    rankBadgeClass:
      "bg-[#E5E7EB] text-[#4B5563] text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0",
    scoreBadgeClass:
      "bg-[#E5E7EB] text-[#374151] text-[11px] font-bold rounded-full px-2 py-0.5",
    barClass: "h-full bg-[#F9A8D4] rounded-full",
  },
  {
    rank: "#3",
    name: "ชัยพร ปศุสัตว์",
    location: "สระบุรี",
    score: "81/100",
    barTarget: 0.81,
    barDelay: 0.7,
    cardClass: "bg-white border border-[#FCE7F3] rounded-r px-3.5 py-2.5",
    rankBadgeClass:
      "bg-[#E5E7EB] text-[#4B5563] text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0",
    scoreBadgeClass:
      "bg-[#E5E7EB] text-[#374151] text-[11px] font-bold rounded-full px-2 py-0.5",
    barClass: "h-full bg-[#F9A8D4] rounded-full",
  },
];

export function SourcingSlide({ isActive }: SlideProps) {
  return (
    <div className="w-full max-w-105 h-70 relative flex flex-col">
      <motion.div
        className="flex flex-col gap-2 w-full h-full"
        variants={containerVariants}
        animate={isActive ? "visible" : "hidden"}
        initial="hidden"
      >
        {/* Pulsing status row */}
        <motion.div className="flex items-center gap-2" variants={itemVariants}>
          <motion.span
            className="w-2 h-2 rounded-full bg-[#EC4899] inline-block shrink-0"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <span className="text-[#F472B6] text-[11px] font-semibold">
            AI กำลังวิเคราะห์...
          </span>
        </motion.div>

        {/* Supplier cards */}
        <div className="flex flex-col gap-2.5">
          {suppliers.map((supplier) => (
            <motion.div key={supplier.rank} variants={itemVariants}>
              {/* Card */}
              <div className={supplier.cardClass}>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={supplier.rankBadgeClass}>
                      {supplier.rank}
                    </span>
                    <div className="min-w-0">
                      <div className="text-[#111827] text-[12px] font-semibold truncate">
                        {supplier.name}
                      </div>
                      <div className="text-[#9CA3AF] text-[10px] truncate">
                        {supplier.location}
                      </div>
                    </div>
                  </div>
                  <span className={supplier.scoreBadgeClass}>
                    {supplier.score}
                  </span>
                </div>
              </div>

              {/* Score bar */}
              <div className="h-1 bg-[#FCE7F3] rounded-full mt-1.5 overflow-hidden">
                <motion.div
                  className={supplier.barClass}
                  style={{ transformOrigin: "left", height: "100%" }}
                  initial={{ scaleX: 0 }}
                  animate={
                    isActive ? { scaleX: supplier.barTarget } : { scaleX: 0 }
                  }
                  transition={{
                    delay: isActive ? supplier.barDelay : 0,
                    ease: [0.16, 1, 0.3, 1],
                    duration: 0.7,
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

"use client";

import { IntakeSlide } from "@/components/motion/slides/IntakeSlide";
import { ProductionSlide } from "@/components/motion/slides/ProductionSlide";
import { QCSlide } from "@/components/motion/slides/QCSlide";
import { SalesSlide } from "@/components/motion/slides/SalesSlide";
import type { SlideProps } from "@/components/motion/slides/SourcingSlide";
import { SourcingSlide } from "@/components/motion/slides/SourcingSlide";
import { WarehouseSlide } from "@/components/motion/slides/WarehouseSlide";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

// Slide variant config
const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? "60%" : "-60%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? "-60%" : "60%", opacity: 0 }),
};
const slideTransition = {
  x: { type: "spring" as const, stiffness: 280, damping: 28 },
  opacity: { duration: 0.22, ease: "easeOut" as const },
};

// SLIDES array — use full Thai descriptions below
type SlideEntry = {
  key: string;
  stepNum: string;
  title: string;
  thaiLabel: string;
  desc: string;
  Component: React.ComponentType<SlideProps>;
};

const SLIDES: SlideEntry[] = [
  {
    key: "sourcing",
    stepNum: "01",
    title: "Sourcing",
    thaiLabel: "จัดหา",
    desc: "AI วิเคราะห์และแนะนำผู้จัดส่งที่เหมาะสม เปรียบเทียบราคา คุณภาพ และความเชื่อถือได้แบบอัตโนมัติ",
    Component: SourcingSlide,
  },
  {
    key: "intake",
    stepNum: "02",
    title: "Intake",
    thaiLabel: "รับเข้า",
    desc: "บันทึกการรับเข้าพร้อม timestamp และรูปภาพ สามารถวิเคราะห์ยอดรายเดือนได้ทันที",
    Component: IntakeSlide,
  },
  {
    key: "production",
    stepNum: "03",
    title: "Production",
    thaiLabel: "ผลิต",
    desc: "เบิกวัตถุดิบจาก Stock บันทึกผลผลิตและของเสียแบบ Real-time พร้อมรายงานประสิทธิภาพ",
    Component: ProductionSlide,
  },
  {
    key: "qc",
    stepNum: "04",
    title: "QC",
    thaiLabel: "ตรวจ QC",
    desc: "Computer Vision วิเคราะห์ความสมบูรณ์ชิ้นเนื้อทุกชิ้น ความแม่นยำ 98.5% ลดปัญหา Human Error",
    Component: QCSlide,
  },
  {
    key: "warehouse",
    stepNum: "05",
    title: "Warehouse",
    thaiLabel: "คลัง",
    desc: "ระบบ Match สินค้าในคลังกับผู้ซื้ออัตโนมัติ บริหารสต็อกและติดตามสถานะแบบ Live",
    Component: WarehouseSlide,
  },
  {
    key: "sales",
    stepNum: "06",
    title: "Sales & Distribution",
    thaiLabel: "ขาย & ส่ง",
    desc: "Dashboard วิเคราะห์ยอดขาย ดู trend รายวัน รายสัปดาห์ Export รายงานได้ทันที",
    Component: SalesSlide,
  },
];

// NavDots inline sub-component
function NavDots({
  count,
  current,
  onSelect,
}: {
  count: number;
  current: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {Array.from({ length: count }).map((_, i) => (
        <motion.button
          key={i}
          onClick={() => onSelect(i)}
          className="rounded-full cursor-pointer border-none p-0 outline-none"
          animate={{
            width: i === current ? 24 : 8,
            height: 8,
            backgroundColor: i === current ? "#EC4899" : "#FCE7F3",
          }}
          transition={{ type: "spring" as const, stiffness: 300, damping: 25 }}
          aria-label={`Go to slide ${i + 1}`}
        />
      ))}
    </div>
  );
}

// Main component
export function WorkflowCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  // Auto-play: advance every 4 seconds
  useEffect(() => {
    const id = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  const goTo = (index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  };

  const { stepNum, title, thaiLabel, desc, Component } = SLIDES[current];

  return (
    <section className="relative overflow-hidden">
      {/* Progress bar */}
      <motion.div
        className="absolute top-0 left-0 h-0.5 bg-linear-to-r from-p-300 to-p-500 rounded-full z-10"
        animate={{ width: `${((current + 1) / SLIDES.length) * 100}%` }}
        transition={{ type: "spring" as const, stiffness: 280, damping: 28 }}
      />

      {/* Slide */}
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={current}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={slideTransition}
          className="grid grid-cols-2 gap-12 items-center min-h-80 pt-4"
        >
          {/* LEFT: text */}
          <div>
            <div className="text-[11px] font-bold text-p-400 uppercase tracking-[2px] mb-3">
              {stepNum} — {title}
            </div>
            <h3 className="text-[38px] font-extrabold text-n-900 leading-tight mb-3">
              {thaiLabel}
            </h3>
            <p className="text-[14px] text-n-500 leading-[1.75] max-w-90">
              {desc}
            </p>
          </div>

          {/* RIGHT: diagram */}
          <div className="flex justify-center items-center">
            <Component isActive={true} />
          </div>
        </motion.div>
      </AnimatePresence>

      <NavDots count={SLIDES.length} current={current} onSelect={goTo} />
    </section>
  );
}

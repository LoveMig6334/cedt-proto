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
    <div className="flex items-center justify-center gap-2">
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
  const [autoPlayKey, setAutoPlayKey] = useState(0);

  // Auto-play: advance every 4 seconds, resets on manual nav
  useEffect(() => {
    const id = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 4000);
    return () => clearInterval(id);
  }, [autoPlayKey]);

  const goTo = (index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
    setAutoPlayKey((k) => k + 1);
  };

  const goPrev = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
    setAutoPlayKey((k) => k + 1);
  };

  const goNext = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % SLIDES.length);
    setAutoPlayKey((k) => k + 1);
  };

  const { stepNum, title, thaiLabel, desc, Component } = SLIDES[current];

  return (
    <section className="relative h-full flex flex-col overflow-hidden">
      {/* Progress bar */}
      <motion.div
        className="absolute top-0 left-0 h-0.5 bg-linear-to-r from-p-300 to-p-500 rounded-full z-10"
        animate={{ width: `${((current + 1) / SLIDES.length) * 100}%` }}
        transition={{ type: "spring" as const, stiffness: 280, damping: 28 }}
      />

      {/* Slide area — fills remaining height */}
      <div className="relative flex-1 min-h-0 overflow-hidden pt-2">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={current}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={slideTransition}
            className="absolute inset-0 grid grid-cols-2 gap-12 items-center px-1"
          >
            {/* LEFT: text */}
            <div>
              <div className="text-[14px] font-bold text-p-400 uppercase tracking-[2px] mb-4">
                {stepNum} — {title}
              </div>
              <h3 className="text-[58px] font-extrabold text-n-900 leading-tight mb-5">
                {thaiLabel}
              </h3>
              <p className="text-[18px] text-n-500 leading-[1.75]">
                {desc}
              </p>
            </div>

            {/* RIGHT: diagram */}
            <div className="flex justify-center items-center h-full">
              <div className="scale-[1.3] origin-center">
                <Component isActive={true} />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom nav: prev · dots · next */}
      <div className="shrink-0 flex items-center justify-center gap-5 py-5">
        <motion.button
          onClick={goPrev}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.93 }}
          className="w-9 h-9 rounded-full border border-n-200 bg-white flex items-center justify-center text-n-500 hover:border-p-400 hover:text-p-500 transition-colors cursor-pointer shadow-sm"
          aria-label="Previous slide"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.button>

        <NavDots count={SLIDES.length} current={current} onSelect={goTo} />

        <motion.button
          onClick={goNext}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.93 }}
          className="w-9 h-9 rounded-full border border-n-200 bg-white flex items-center justify-center text-n-500 hover:border-p-400 hover:text-p-500 transition-colors cursor-pointer shadow-sm"
          aria-label="Next slide"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.button>
      </div>
    </section>
  );
}

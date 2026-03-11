"use client";

import { motion } from "framer-motion";

const mockupKpis = [
  { label: "รับวัวเข้าวันนี้", value: "24 ตัว", pink: false },
  { label: "ผลผลิตสัปดาห์", value: "1,240 กก.", pink: true },
  { label: "คะแนน QC", value: "94.2%", pink: false },
  { label: "ยอดขายเดือนนี้", value: "฿2.8M", pink: true },
];

const chartBars = [44, 62, 50, 76, 58, 90, 70];

const spring = { type: "spring" as const, stiffness: 300, damping: 25 };

export function HeroMockup() {
  return (
    <div style={{ perspective: "1200px" }} className="w-full max-w-155">
      <motion.div
        className="bg-white rounded-[20px] overflow-hidden w-full shadow-[0_28px_72px_rgba(0,0,0,.14),0_10px_28px_rgba(244,114,182,.16)]"
        animate={{
          y: [0, -15, 0],
          rotateY: [-7, -5, -7],
          rotateX: [3, 4, 3],
          rotateZ: [1, 0, 1],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{
          boxShadow:
            "0 36px 80px rgba(0,0,0,.16),0 14px 36px rgba(244,114,182,.28)",
        }}
      >
        {/* Browser bar */}
        <div className="bg-n-900 px-5 py-3 flex items-center gap-2">
          <motion.span
            className="w-3 h-3 rounded-full bg-[#FF5F57] inline-block cursor-pointer"
            whileHover={{ scale: 1.1 }}
            transition={spring}
          />
          <motion.span
            className="w-3 h-3 rounded-full bg-[#FFBD2E] inline-block cursor-pointer"
            whileHover={{ scale: 1.1 }}
            transition={spring}
          />
          <motion.span
            className="w-3 h-3 rounded-full bg-[#28C840] inline-block cursor-pointer"
            whileHover={{ scale: 1.1 }}
            transition={spring}
          />
          <div className="flex-1 h-6 bg-n-700 rounded-md ml-3 relative overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 w-full h-full bg-white/3"
              animate={{ opacity: [0.03, 0.1, 0.03] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>

        {/* Preview body */}
        <div className="flex h-86.5">
          {/* Mini sidebar */}
          <div className="w-16.5 bg-n-900 px-2 py-3 flex flex-col items-center gap-1.5">
            <div className="w-8.5 h-8.5 bg-p-500 rounded-[9px] mb-1.5 shadow-[0_2px_10px_rgba(244,114,182,.45)]" />
            {[true, false, false, false, false, false].map((active, i) => (
              <div
                key={i}
                className={`w-9.5 h-9.5 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-300 group hover:scale-110 ${
                  active
                    ? "bg-[rgba(244,114,182,.2)]"
                    : "bg-white/5 hover:bg-white/10"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-sm transition-colors duration-300 ${
                    active ? "bg-p-400" : "bg-white/22 group-hover:bg-white/40"
                  }`}
                />
              </div>
            ))}
          </div>

          {/* Main content */}
          <div className="flex-1 bg-cream p-3.5 overflow-hidden flex flex-col gap-2.5">
            <div className="text-[11px] font-bold text-n-800 flex items-center gap-1.5">
              📊{" "}
              <motion.span
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                ภาพรวมโรงงาน — FreshPro
              </motion.span>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {mockupKpis.map((kpi, i) => (
                <motion.div
                  key={kpi.label}
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    delay: 0.2 + i * 0.15,
                    ease: [0.16, 1, 0.3, 1],
                    duration: 0.6,
                  }}
                >
                  <div className="bg-white rounded-md p-[9px_10px] border border-p-100 hover:border-p-300 hover:shadow-[0_2px_8px_rgba(244,114,182,.15)] hover:-translate-y-0.5 transition-all duration-300 cursor-default">
                    <div className="text-[8.5px] text-n-500 mb-0.5">
                      {kpi.label}
                    </div>
                    <div
                      className={`text-[15px] font-bold leading-tight ${
                        kpi.pink ? "text-p-500" : "text-n-900"
                      }`}
                    >
                      {kpi.value}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex-1 bg-white rounded-md p-2 flex items-end gap-1 group border border-transparent hover:border-n-200 transition-colors">
              {chartBars.map((h, i) => (
                <motion.div
                  key={i}
                  className={`flex-1 rounded-[2px_2px_0_0] cursor-pointer hover:brightness-110 hover:opacity-80 ${
                    h > 80 ? "bg-p-500" : h > 65 ? "bg-p-400" : "bg-p-200"
                  }`}
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={{ scaleY: 1, opacity: 1 }}
                  style={{ height: `${h}%`, transformOrigin: "bottom" }}
                  transition={{
                    delay: 0.6 + i * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                    duration: 0.8,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

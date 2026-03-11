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
    <div style={{ perspective: "1000px" }}>
      <motion.div
        className="bg-white rounded-[20px] overflow-hidden w-full max-w-115 shadow-[0_24px_64px_rgba(0,0,0,.13),0_8px_24px_rgba(244,114,182,.14)]"
        animate={{
          y: [0, -15, 0],
          rotateY: [-7, -5, -7],
          rotateX: [3, 4, 3],
          rotateZ: [1, 0, 1],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{
          boxShadow:
            "0 30px 70px rgba(0,0,0,.15),0 12px 30px rgba(244,114,182,.25)",
        }}
      >
        {/* Browser bar */}
        <div className="bg-n-900 px-4 py-2.5 flex items-center gap-1.5">
          <motion.span
            className="w-2.5 h-2.5 rounded-full bg-[#FF5F57] inline-block cursor-pointer"
            whileHover={{ scale: 1.1 }}
            transition={spring}
          />
          <motion.span
            className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] inline-block cursor-pointer"
            whileHover={{ scale: 1.1 }}
            transition={spring}
          />
          <motion.span
            className="w-2.5 h-2.5 rounded-full bg-[#28C840] inline-block cursor-pointer"
            whileHover={{ scale: 1.1 }}
            transition={spring}
          />
          <div className="flex-1 h-5.25 bg-n-700 rounded-md ml-2 relative overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 w-full h-full bg-white/3"
              animate={{ opacity: [0.03, 0.1, 0.03] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>

        {/* Preview body */}
        <div className="flex h-71.25">
          {/* Mini sidebar (decorative, CSS hover OK here) */}
          <div className="w-12.5 bg-n-900 px-1.75 py-2.25 flex flex-col items-center gap-1.25">
            <div className="w-7 h-7 bg-p-500 rounded-[7px] mb-1.25 shadow-[0_2px_8px_rgba(244,114,182,.4)]" />
            {[true, false, false, false, false, false].map((active, i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-[7px] flex items-center justify-center cursor-pointer transition-all duration-300 group hover:scale-110 ${
                  active
                    ? "bg-[rgba(244,114,182,.2)]"
                    : "bg-white/5 hover:bg-white/10"
                }`}
              >
                <div
                  className={`w-3.25 h-3.25 rounded-[3px] transition-colors duration-300 ${
                    active
                      ? "bg-p-400"
                      : "bg-white/22 group-hover:bg-white/40"
                  }`}
                />
              </div>
            ))}
          </div>

          {/* Mini content */}
          <div className="flex-1 bg-cream p-2.75 overflow-hidden">
            <div className="text-[9.5px] font-bold text-n-800 mb-1.75 flex items-center gap-1">
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

            <div className="grid grid-cols-2 gap-1 mb-1.75">
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
                  <div className="bg-white rounded-[5px] p-[6px_7px] border border-p-100 hover:border-p-300 hover:shadow-[0_2px_8px_rgba(244,114,182,.15)] hover:-translate-y-0.5 transition-all duration-300 cursor-default h-full">
                    <div className="text-[7px] text-n-500 mb-px">
                      {kpi.label}
                    </div>
                    <div
                      className={`text-[12.5px] font-bold ${
                        kpi.pink ? "text-p-500" : "text-n-900"
                      }`}
                    >
                      {kpi.value}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="h-11.5 bg-white rounded-[5px] p-1.25 flex items-end gap-0.75 group border border-transparent hover:border-n-200 transition-colors">
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

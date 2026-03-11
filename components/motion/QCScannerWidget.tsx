'use client';

import { motion } from 'framer-motion';

export function QCScannerWidget() {
  return (
    <div
      className="bg-n-900 rounded-r p-[26px] text-center relative overflow-hidden mb-4"
      style={{
        backgroundImage:
          'repeating-linear-gradient(0deg,transparent,transparent 26px,rgba(244,114,182,.035) 26px,rgba(244,114,182,.035) 27px)',
      }}
    >
      <div className="w-[130px] h-[130px] mx-auto mb-3 relative z-10">
        <div className="absolute top-0 left-0 w-[26px] h-[26px] border-t-2 border-l-2 border-p-400 rounded-[4px_0_0_0]" />
        <div className="absolute bottom-0 right-0 w-[26px] h-[26px] border-b-2 border-r-2 border-p-400 rounded-[0_0_4px_0]" />
        <div className="w-full h-full flex items-center justify-center text-[42px] bg-[rgba(244,114,182,.04)] rounded-[8px] relative overflow-hidden">
          🥩
          <motion.div
            className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-p-400 to-transparent"
            animate={{ top: ['5%', '5%', '95%', '95%'], opacity: [0, 1, 1, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
              times: [0, 0.2, 0.8, 1],
            }}
          />
        </div>
      </div>
      <div className="text-white text-[13px] font-semibold relative z-10 mb-1">
        AI กำลังสแกน...
      </div>
      <div className="text-white/40 text-[11px] relative z-10">
        ล็อต #LP-2025-0442 — สายผลิต A
      </div>
    </div>
  );
}

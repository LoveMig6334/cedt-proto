import { AnimatedButton } from "@/components/motion/AnimatedButton";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "ควบคุมการผลิต | FreshPro" };

const productionLines = [
  {
    id: "L-01",
    name: "สายการผลิต A — สันใน",
    status: "กำลังผลิต",
    progress: 78,
    target: "180 กก.",
    current: "140 กก.",
    waste: "4.2%",
    statusCls: "bg-[#D1FAE5] text-[#059669]",
  },
  {
    id: "L-02",
    name: "สายการผลิต B — สันนอก",
    status: "หยุดพัก",
    progress: 45,
    target: "120 กก.",
    current: "54 กก.",
    waste: "3.8%",
    statusCls: "bg-[#FEF3C7] text-[#D97706]",
  },
  {
    id: "L-03",
    name: "สายการผลิต C — เนื้อสับ",
    status: "กำลังผลิต",
    progress: 92,
    target: "200 กก.",
    current: "184 กก.",
    waste: "5.1%",
    statusCls: "bg-[#D1FAE5] text-[#059669]",
  },
];

const materialStock = [
  { name: "วัวสด (สมศรี ฟาร์ม)", qty: "12 ตัว", weight: "720 กก.", pct: 60 },
  { name: "วัวสด (ไทยบีฟ)", qty: "8 ตัว", weight: "480 กก.", pct: 40 },
  { name: "เกลือปรุงรส", qty: "—", weight: "85 กก.", pct: 85 },
];

export default function ProductionPage() {
  return (
    <div>
      <div className="flex justify-between items-start mb-5.5">
        <div>
          <div className="text-[20px] font-extrabold text-n-900 mb-0.75">
            🏭 ควบคุมการผลิต
          </div>
          <div className="text-[12.5px] text-n-500">
            ติดตามสายการผลิตแบบ Real-time พร้อมบันทึกผลผลิตและของเสีย
          </div>
        </div>
        <AnimatedButton>
          <button className="bg-linear-to-br from-p-400 to-p-500 text-white rounded-[9px] px-5 py-2.5 text-[13px] font-semibold shadow-[0_4px_20px_rgba(244,114,182,.25)]">
            + เริ่มสายการผลิต
          </button>
        </AnimatedButton>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-4 gap-3.75 mb-5">
        {[
          { icon: "🏭", v: "3", l: "สายผลิตที่ใช้งาน", cls: "" },
          { icon: "⚖️", v: "378 กก.", l: "ผลผลิตวันนี้", cls: "" },
          { icon: "♻️", v: "4.3%", l: "อัตราของเสีย", cls: "" },
          { icon: "✅", v: "97.2%", l: "ประสิทธิภาพรวม", cls: "" },
        ].map((k) => (
          <div
            key={k.l}
            className="bg-white rounded-rlg border border-p-100 p-4 relative overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,.04)]"
          >
            <div className="absolute -top-2 -right-2 w-16 h-16 bg-p-50 rounded-full" />
            <div className="text-[20px] mb-2.25">{k.icon}</div>
            <div className="text-[23px] font-extrabold text-n-900 mb-0.5">
              {k.v}
            </div>
            <div className="text-[11px] text-n-500">{k.l}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-[1fr_280px] gap-4.5">
        {/* Production lines */}
        <div className="space-y-4">
          {productionLines.map((line) => (
            <div
              key={line.id}
              className="bg-white rounded-rlg border border-p-100 p-5 shadow-[0_1px_3px_rgba(0,0,0,.04)]"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-[13.5px] font-bold text-n-900 mb-0.5">
                    {line.name}
                  </div>
                  <div className="text-[11px] text-n-400">{line.id}</div>
                </div>
                <span
                  className={`px-2.25 py-0.75 rounded-full text-[10.5px] font-semibold ${line.statusCls}`}
                >
                  {line.status}
                </span>
              </div>
              <div className="h-1.5 bg-n-100 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full rounded-full bg-linear-to-r from-p-300 to-p-500"
                  style={{ width: `${line.progress}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-n-500">
                <span>
                  ผลผลิต: <b className="text-n-800">{line.current}</b> /{" "}
                  {line.target}
                </span>
                <span>
                  ของเสีย: <b className="text-fp-red">{line.waste}</b>
                </span>
                <span className="text-p-500 font-semibold">
                  {line.progress}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Material stock */}
        <div className="bg-white rounded-rlg border border-p-100 shadow-[0_1px_3px_rgba(0,0,0,.04)]">
          <div className="px-5 pt-4 pb-3.25 border-b border-n-100">
            <div className="text-[13.5px] font-bold text-n-900">
              📦 วัตถุดิบคงเหลือ
            </div>
            <div className="text-[11px] text-n-500 mt-0.5">
              พร้อมใช้งานวันนี้
            </div>
          </div>
          <div className="p-4 space-y-4">
            {materialStock.map((m) => (
              <div key={m.name}>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-[12.5px] font-semibold text-n-800">
                    {m.name}
                  </span>
                  <span className="text-[11px] text-n-400">{m.qty}</span>
                </div>
                <div className="text-[11px] text-n-500 mb-1.5">{m.weight}</div>
                <div className="h-1.5 bg-n-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-[#34D399] to-fp-green"
                    style={{ width: `${m.pct}%` }}
                  />
                </div>
              </div>
            ))}
            <div className="h-px bg-n-100 my-2" />
            <button className="w-full py-2.5 border-2 border-p-200 text-p-500 rounded-r text-[13px] font-semibold hover:bg-p-50">
              เบิกวัตถุดิบ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

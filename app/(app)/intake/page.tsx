import { AnimatedButton } from "@/components/motion/AnimatedButton";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "รับเข้าวัตถุดิบ | FreshPro" };

const recentIntakes = [
  {
    id: "IN-2025-0441",
    name: "วัวเนื้อ Wagyu เกรด A",
    supplier: "สมศรี ฟาร์ม",
    qty: "6 ตัว / 320 กก.",
    date: "10 มี.ค. 2568 08:15",
    status: "ผ่าน QC",
    statusCls: "bg-[#D1FAE5] text-[#059669]",
  },
  {
    id: "IN-2025-0440",
    name: "วัวเนื้อมาตรฐาน",
    supplier: "ไทยบีฟ พรีเมียม",
    qty: "8 ตัว / 480 กก.",
    date: "9 มี.ค. 2568 07:45",
    status: "ผ่าน QC",
    statusCls: "bg-[#D1FAE5] text-[#059669]",
  },
  {
    id: "IN-2025-0439",
    name: "วัวเนื้ออีสาน",
    supplier: "อีสาน แคตเทิล",
    qty: "10 ตัว / 580 กก.",
    date: "8 มี.ค. 2568 09:00",
    status: "รอตรวจ",
    statusCls: "bg-[#FEF3C7] text-[#D97706]",
  },
  {
    id: "IN-2025-0438",
    name: "วัวเนื้อ Premium",
    supplier: "สมศรี ฟาร์ม",
    qty: "5 ตัว / 290 กก.",
    date: "7 มี.ค. 2568 10:30",
    status: "ผ่าน QC",
    statusCls: "bg-[#D1FAE5] text-[#059669]",
  },
];

export default function IntakePage() {
  return (
    <div>
      <div className="flex justify-between items-start mb-5.5">
        <div>
          <div className="text-[20px] font-extrabold text-n-900 mb-0.75">
            📦 รับเข้าวัตถุดิบ
          </div>
          <div className="text-[12.5px] text-n-500">
            บันทึกการรับวัตถุดิบพร้อมรูปภาพและ timestamp อัตโนมัติ
          </div>
        </div>
        <AnimatedButton>
          <button className="bg-linear-to-br from-p-400 to-p-500 text-white rounded-[9px] px-5 py-2.5 text-[13px] font-semibold shadow-[0_4px_20px_rgba(244,114,182,.25)]">
            + บันทึกรับเข้าใหม่
          </button>
        </AnimatedButton>
      </div>

      <div className="grid grid-cols-[1fr_300px] gap-4.5">
        {/* Intake table */}
        <div className="bg-white rounded-rlg border border-p-100 shadow-[0_1px_3px_rgba(0,0,0,.04)]">
          <div className="px-5 pt-4 pb-3.25 border-b border-n-100 flex items-center justify-between">
            <div className="text-[13.5px] font-bold text-n-900">
              ประวัติรับเข้า
            </div>
            <div className="flex items-center gap-2 bg-n-100 p-0.75 rounded-[10px]">
              {["ทั้งหมด", "สัปดาห์นี้", "เดือนนี้"].map((t, i) => (
                <button
                  key={t}
                  className={`px-4 py-2 rounded-lg font-sans text-[12.5px] font-medium transition-all ${i === 0 ? "bg-white text-n-900 font-bold shadow-[0_1px_3px_rgba(0,0,0,.07)]" : "text-n-500"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {[
                    "รหัส",
                    "รายการ",
                    "ผู้จัดส่ง",
                    "ปริมาณ",
                    "วันที่รับ",
                    "สถานะ",
                  ].map((h) => (
                    <th
                      key={h}
                      className="bg-cream text-n-500 text-[10px] font-bold uppercase tracking-[.5px] px-3.25 py-2.5 text-left border-b border-n-100 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentIntakes.map((row) => (
                  <tr key={row.id} className="hover:[&>td]:bg-p-50">
                    <td className="px-3.25 py-2.75 text-[12.5px] text-n-700 border-b border-n-100 font-mono">
                      {row.id}
                    </td>
                    <td className="px-3.25 py-2.75 text-[12.5px] text-n-700 border-b border-n-100 font-semibold">
                      {row.name}
                    </td>
                    <td className="px-3.25 py-2.75 text-[12.5px] text-n-700 border-b border-n-100">
                      {row.supplier}
                    </td>
                    <td className="px-3.25 py-2.75 text-[12.5px] text-n-700 border-b border-n-100">
                      {row.qty}
                    </td>
                    <td className="px-3.25 py-2.75 text-[12.5px] text-n-700 border-b border-n-100 whitespace-nowrap">
                      {row.date}
                    </td>
                    <td className="px-3.25 py-2.75 border-b border-n-100">
                      <span
                        className={`inline-flex items-center px-2.25 py-0.75 rounded-full text-[10.5px] font-semibold ${row.statusCls}`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick record form */}
        <div className="bg-white rounded-rlg border border-p-100 shadow-[0_1px_3px_rgba(0,0,0,.04)]">
          <div className="px-5 pt-4 pb-3.25 border-b border-n-100">
            <div className="text-[13.5px] font-bold text-n-900">
              บันทึกรับเข้าด่วน
            </div>
          </div>
          <div className="p-4 space-y-4.25">
            {[
              {
                label: "ผู้จัดส่ง",
                type: "select",
                opts: ["สมศรี ฟาร์ม", "ไทยบีฟ พรีเมียม", "อีสาน แคตเทิล"],
              },
              {
                label: "ประเภทวัตถุดิบ",
                type: "text",
                ph: "เช่น วัวเนื้อ Wagyu",
              },
              { label: "น้ำหนัก (กก.)", type: "number", ph: "0.00" },
              { label: "จำนวน (ตัว)", type: "number", ph: "0" },
            ].map((f) => (
              <div key={f.label}>
                <label className="block text-[12.5px] font-semibold text-n-700 mb-1.75">
                  {f.label}
                </label>
                {f.type === "select" ? (
                  <select className="w-full px-3.25 py-2.5 bg-white border-2 border-n-200 rounded-r font-sans text-[13px] text-n-800 outline-none cursor-pointer focus:border-p-400 transition-all">
                    {f.opts!.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={f.type}
                    placeholder={f.ph}
                    className="w-full px-3.5 py-2.75 bg-white border-2 border-n-200 rounded-r font-sans text-[13px] text-n-800 outline-none focus:border-p-400 focus:shadow-[0_0_0_4px_rgba(244,114,182,.08)] placeholder:text-n-300 transition-all"
                  />
                )}
              </div>
            ))}
            <div>
              <label className="block text-[12.5px] font-semibold text-n-700 mb-1.75">
                อัปโหลดรูปภาพ
              </label>
              <div className="border-2 border-dashed border-p-300 rounded-r p-6.5 text-center cursor-pointer bg-p-50 hover:bg-p-100 hover:border-p-400 transition-all">
                <div className="text-[26px] mb-2.25">📸</div>
                <div className="text-[13px] text-n-600 mb-0.75">
                  ลากและวางรูปภาพ หรือคลิกเพื่อเลือก
                </div>
                <div className="text-[11px] text-n-400">
                  PNG, JPG สูงสุด 10MB
                </div>
              </div>
            </div>
            <AnimatedButton className="w-full rounded-r">
              <button className="w-full py-3.25 bg-linear-to-br from-p-400 to-p-500 text-white rounded-r text-[15px] font-bold shadow-[0_4px_20px_rgba(244,114,182,.25)]">
                บันทึกรับเข้า
              </button>
            </AnimatedButton>
          </div>
        </div>
      </div>
    </div>
  );
}

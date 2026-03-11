import { AnimatedButton } from "@/components/motion/AnimatedButton";
import { AnimatedCard } from "@/components/motion/AnimatedCard";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard | FreshPro" };

const kpis = [
  {
    icon: "🐄",
    value: "24",
    label: "รับวัวเข้าวันนี้ (ตัว)",
    change: "↑ +3 จากเมื่อวาน",
    up: true,
  },
  {
    icon: "🏭",
    value: "1,240",
    label: "ผลผลิตสัปดาห์นี้ (กก.)",
    change: "↑ +8.2%",
    up: true,
  },
  {
    icon: "🔬",
    value: "94.2%",
    label: "คะแนน QC เฉลี่ย",
    change: "↑ +1.4%",
    up: true,
  },
  {
    icon: "💰",
    value: "฿2.8M",
    label: "ยอดขายเดือนนี้",
    change: "↓ -2.1%",
    up: false,
  },
];

const chartBars = [
  { h: 55, day: "จ." },
  { h: 72, day: "อ." },
  { h: 60, day: "พ." },
  { h: 84, day: "พฤ." },
  { h: 68, day: "ศ." },
  { h: 42, day: "ส." },
  { h: 35, day: "อา." },
];

const qcGrades = [
  {
    grade: "A",
    label: "เกรด A — พรีเมียม",
    count: 218,
    pct: 70,
    barClass: "bg-linear-to-r from-[#34D399] to-fp-green",
  },
  {
    grade: "B",
    label: "เกรด B — มาตรฐาน",
    count: 71,
    pct: 23,
    barClass: "bg-linear-to-r from-p-300 to-p-500",
  },
  {
    grade: "C",
    label: "เกรด C — ผ่านขั้นต่ำ",
    count: 23,
    pct: 7,
    barClass: "bg-linear-to-r from-[#FCD34D] to-fp-yellow",
  },
];

const recentActivities = [
  {
    icon: "📦",
    text: "รับวัวเข้า 6 ตัว จาก บริษัท สมศรี ฟาร์ม",
    time: "08:15 น.",
  },
  { icon: "🔬", text: "ผ่าน QC เกรด A — ล็อต #LP-2025-0441", time: "09:30 น." },
  {
    icon: "🚚",
    text: "จัดส่งออร์เดอร์ #ORD-882 ให้ Makro สาขาลาดพร้าว",
    time: "10:00 น.",
  },
  {
    icon: "⚙️",
    text: "เริ่มสายการผลิตรอบบ่าย — เป้าหมาย 180 กก.",
    time: "12:00 น.",
  },
  {
    icon: "💰",
    text: "ยืนยันใบสั่งซื้อ ฿320,000 จาก Villa Market",
    time: "13:45 น.",
  },
];

const deliveries = [
  {
    name: "Makro ลาดพร้าว",
    type: "เนื้อสันใน",
    price: "฿42,000",
    time: "14:00",
    badgeCls: "bg-[#D1FAE5] text-[#059669]",
    status: "กำลังจัดส่ง",
  },
  {
    name: "Villa Market",
    type: "สันนอก / ซี่โครง",
    price: "฿28,500",
    time: "16:30",
    badgeCls: "bg-[#FEF3C7] text-[#D97706]",
    status: "รอจัดส่ง",
  },
  {
    name: "Tops Supermarket",
    type: "เนื้อสับ / ซอยบาง",
    price: "฿19,800",
    time: "09:00+1",
    badgeCls: "bg-[#DBEAFE] text-[#2563EB]",
    status: "วางแผน",
  },
];

export default function DashboardPage() {
  return (
    <div>
      {/* Page header */}
      <div className="flex justify-between items-start mb-5.5">
        <div>
          <div className="text-[20px] font-extrabold text-n-900 mb-0.75">
            สวัสดีตอนเช้า, คุณสมชาย 👋
          </div>
          <div className="text-[12.5px] text-n-500">
            ภาพรวมโรงงาน FreshPro — อัปเดตล่าสุด: วันนี้ 08:30 น.
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-white text-n-800 border-[1.5px] border-n-200 rounded-[9px] px-5 py-2.25 text-[13px] font-semibold flex items-center gap-1.5 hover:border-p-300 hover:text-p-500 transition-all">
            📥 Export รายงาน
          </button>
          <AnimatedButton>
            <button className="bg-linear-to-br from-p-400 to-p-500 text-white rounded-[9px] px-5 py-2.5 text-[13px] font-semibold shadow-[0_4px_20px_rgba(244,114,182,.25)]">
              + เพิ่มรายการ
            </button>
          </AnimatedButton>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-4 gap-3.75 mb-5">
        {kpis.map((kpi) => (
          <AnimatedCard
            key={kpi.label}
            className="bg-white rounded-rlg border border-p-100 p-4 relative overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,.04)]"
            hoverY={-4}
            hoverShadow="0 8px 20px rgba(0,0,0,0.07)"
          >
            <div className="absolute -top-2 -right-2 w-16 h-16 bg-p-50 rounded-full" />
            <div className="text-[20px] mb-2.25">{kpi.icon}</div>
            <div className="text-[23px] font-extrabold text-n-900 mb-0.5">
              {kpi.value}
            </div>
            <div className="text-[11px] text-n-500">{kpi.label}</div>
            <div
              className={`inline-flex items-center gap-0.75 text-[10.5px] font-semibold mt-1.5 px-2 py-0.5 rounded-full ${
                kpi.up
                  ? "bg-[#D1FAE5] text-[#059669]"
                  : "bg-[#FEE2E2] text-[#DC2626]"
              }`}
            >
              {kpi.change}
            </div>
          </AnimatedCard>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-2 gap-4.5 mb-5">
        {/* Production bar chart */}
        <div className="bg-white rounded-rlg border border-p-100 shadow-[0_1px_3px_rgba(0,0,0,.04)]">
          <div className="px-5 pt-4 pb-3.25 border-b border-n-100 flex items-center justify-between">
            <div>
              <div className="text-[13.5px] font-bold text-n-900">
                📈 ผลผลิตรายสัปดาห์
              </div>
              <div className="text-[11px] text-n-500 mt-0.5">
                รายงาน 7 วันล่าสุด
              </div>
            </div>
            <select className="bg-white border-2 border-n-200 rounded-r font-sans text-[12px] text-n-800 outline-none px-2.5 py-1.5 cursor-pointer focus:border-p-400">
              <option>7 วัน</option>
              <option>30 วัน</option>
            </select>
          </div>
          <div className="p-4 pb-5">
            <div className="flex items-flex-end gap-1.5 h-27.5">
              {chartBars.map(({ h, day }) => (
                <div
                  key={day}
                  className="flex-1 flex flex-col items-center gap-0.75 h-full justify-end"
                >
                  <div
                    className="w-full rounded-[3px_3px_0_0] bg-linear-to-t from-p-500 to-p-300 min-h-0.75"
                    style={{ height: `${h}%` }}
                  />
                  <div className="text-[9px] text-n-400 whitespace-nowrap">
                    {day}
                  </div>
                </div>
              ))}
            </div>
            <div className="h-px bg-n-100 my-3.5" />
            <div className="flex items-center justify-between text-[11px] text-n-500">
              <span>
                ผลผลิตรวม: <b className="text-n-900">1,240 กก.</b>
              </span>
              <span>
                ของเสีย: <b className="text-fp-red">48 กก. (3.8%)</b>
              </span>
              <span>
                เป้าหมาย: <b className="text-fp-green">1,500 กก./สัปดาห์</b>
              </span>
            </div>
          </div>
        </div>

        {/* QC grade distribution */}
        <div className="bg-white rounded-rlg border border-p-100 shadow-[0_1px_3px_rgba(0,0,0,.04)]">
          <div className="px-5 pt-4 pb-3.25 border-b border-n-100">
            <div className="text-[13.5px] font-bold text-n-900">
              🔬 การกระจาย Grade QC
            </div>
            <div className="text-[11px] text-n-500 mt-0.5">
              เดือนนี้ — ทั้งหมด 312 ชิ้น
            </div>
          </div>
          <div className="p-4">
            <div className="space-y-3.5 mb-4">
              {qcGrades.map((g) => (
                <div key={g.grade}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[12px] text-n-600">{g.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-semibold text-n-900">
                        {g.count} ชิ้น
                      </span>
                      <span className="text-[11px] text-n-400">{g.pct}%</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-n-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${g.barClass}`}
                      style={{ width: `${g.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="h-px bg-n-100 my-3.5" />
            <div className="flex gap-3.5">
              {[
                {
                  label: "Pass",
                  val: "289 ชิ้น",
                  cls: "bg-[#D1FAE5] text-[#059669]",
                },
                {
                  label: "Fail",
                  val: "23 ชิ้น",
                  cls: "bg-[#FEE2E2] text-[#DC2626]",
                },
                { label: "Rate", val: "92.6%", cls: "bg-p-100 text-p-500" },
              ].map((s) => (
                <div
                  key={s.label}
                  className={`flex-1 rounded-[9px] px-3 py-2 text-center ${s.cls}`}
                >
                  <div className="text-[11px] font-semibold">{s.label}</div>
                  <div className="text-[14px] font-extrabold">{s.val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row: Activity + Deliveries */}
      <div className="grid grid-cols-[1fr_310px] gap-4.5">
        {/* Recent deliveries */}
        <div className="bg-white rounded-rlg border border-p-100 shadow-[0_1px_3px_rgba(0,0,0,.04)]">
          <div className="px-5 pt-4 pb-3.25 border-b border-n-100 flex items-center justify-between">
            <div>
              <div className="text-[13.5px] font-bold text-n-900">
                🚚 ออร์เดอร์จัดส่งวันนี้
              </div>
              <div className="text-[11px] text-n-500 mt-0.5">
                3 รายการที่ต้องจัดส่ง
              </div>
            </div>
            <button className="text-p-500 text-[12px] font-semibold hover:text-p-400 transition-colors">
              ดูทั้งหมด →
            </button>
          </div>
          <div className="p-4 space-y-2">
            {deliveries.map((d) => (
              <AnimatedCard
                key={d.name}
                className="flex items-center gap-3 p-3 border-[1.5px] border-n-100 rounded-r hover:border-p-200"
                hoverY={-2}
                hoverShadow="0 2px 8px rgba(0,0,0,0.04)"
              >
                <div className="w-10.5 h-10.5 rounded-[10px] bg-p-100 flex items-center justify-center text-[18px] shrink-0">
                  🚚
                </div>
                <div className="flex-1">
                  <div className="text-[13px] font-bold text-n-900 mb-0.5">
                    {d.name}
                  </div>
                  <div className="text-[11px] text-n-500">{d.type}</div>
                </div>
                <div className="text-right">
                  <div className="text-[14px] font-extrabold text-n-900">
                    {d.price}
                  </div>
                  <div className="text-[10.5px] text-n-400 mt-0.5">
                    {d.time} น.
                  </div>
                </div>
                <span
                  className={`px-2.25 py-0.75 rounded-full text-[10.5px] font-semibold whitespace-nowrap ${d.badgeCls}`}
                >
                  {d.status}
                </span>
              </AnimatedCard>
            ))}
          </div>
        </div>

        {/* Activity timeline */}
        <div className="bg-white rounded-rlg border border-p-100 shadow-[0_1px_3px_rgba(0,0,0,.04)]">
          <div className="px-5 pt-4 pb-3.25 border-b border-n-100">
            <div className="text-[13.5px] font-bold text-n-900">
              ⚡ กิจกรรมล่าสุด
            </div>
            <div className="text-[11px] text-n-500 mt-0.5">
              อัปเดตแบบ Real-time
            </div>
          </div>
          <div className="p-4">
            <div className="pl-6 relative">
              <div className="absolute left-1.5 top-1.5 bottom-1.5 w-0.5 bg-p-200" />
              {recentActivities.map((act, i) => (
                <div key={i} className="relative mb-4 last:mb-0">
                  <div className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-p-400 border-2 border-white shadow-[0_0_0_2px_#FBCFE8]" />
                  <div className="text-[10px] text-n-400 mb-0.5">
                    {act.time}
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[13px] shrink-0">
                      {act.icon}
                    </span>
                    <div className="text-[12.5px] text-n-700">{act.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

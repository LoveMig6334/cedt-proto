import { AnimatedButton } from "@/components/motion/AnimatedButton";
import { AnimatedCard } from "@/components/motion/AnimatedCard";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "จัดหาวัตถุดิบ | FreshPro" };

const suppliers = [
  {
    name: "บริษัท สมศรี ฟาร์ม จำกัด",
    sub: "ฟาร์มโคเนื้อ จ.นครราชสีมา",
    rating: 4.8,
    price: "฿185/กก.",
    tags: ["Wagyu", "ออร์แกนิค"],
    badge: "แนะนำ AI",
    badgeCls: "bg-p-100 text-p-500 border-p-200",
    score: 96,
  },
  {
    name: "ไทยบีฟ พรีเมียม",
    sub: "สหกรณ์โคเนื้อ จ.ชลบุรี",
    rating: 4.5,
    price: "฿162/กก.",
    tags: ["มาตรฐาน GAP"],
    badge: "ราคาดี",
    badgeCls: "bg-[#D1FAE5] text-[#059669] border-[#A7F3D0]",
    score: 88,
  },
  {
    name: "อีสาน แคตเทิล",
    sub: "ฟาร์มรวม จ.ขอนแก่น",
    rating: 4.2,
    price: "฿148/กก.",
    tags: ["ปริมาณสูง", "ส่งได้ทุกวัน"],
    badge: "ปริมาณมาก",
    badgeCls: "bg-[#DBEAFE] text-[#2563EB] border-[#BFDBFE]",
    score: 81,
  },
];

const chatMessages = [
  {
    role: "ai",
    text: "สวัสดีครับ! ฉันช่วยวิเคราะห์และแนะนำผู้จัดส่งที่เหมาะสมได้ มีความต้องการพิเศษอะไรไหมครับ?",
  },
  {
    role: "user",
    text: "ต้องการเนื้อวัว Wagyu คุณภาพสูง ประมาณ 50 กก./สัปดาห์",
  },
  {
    role: "ai",
    text: 'จากข้อมูล ฉันแนะนำ "สมศรี ฟาร์ม" — คะแนน 96/100 มีสต็อก Wagyu พร้อมส่ง ราคาแข่งขันได้ และผ่าน QC เฉลี่ย 97.2% ครับ',
  },
];

export default function SourcingPage() {
  return (
    <div>
      <div className="flex justify-between items-start mb-5.5">
        <div>
          <div className="text-[20px] font-extrabold text-n-900 mb-0.75">
            🔍 จัดหาวัตถุดิบ
          </div>
          <div className="text-[12.5px] text-n-500">
            AI วิเคราะห์และจับคู่ผู้จัดส่งที่ดีที่สุดให้คุณ
          </div>
        </div>
        <AnimatedButton>
          <button className="bg-linear-to-br from-p-400 to-p-500 text-white rounded-[9px] px-5 py-2.5 text-[13px] font-semibold shadow-[0_4px_20px_rgba(244,114,182,.25)]">
            + สร้างใบสั่งซื้อ
          </button>
        </AnimatedButton>
      </div>

      <div className="grid grid-cols-[1fr_320px] gap-4.5">
        {/* Supplier cards */}
        <div>
          <div className="flex items-center gap-2 bg-white border-[1.5px] border-n-200 rounded-[9px] px-3 py-2 mb-4 focus-within:border-p-400 transition-all">
            <span className="text-n-400">🔍</span>
            <input
              placeholder="ค้นหาผู้จัดส่ง..."
              className="flex-1 border-none outline-none font-sans text-[13px] text-n-800 bg-transparent placeholder:text-n-300"
            />
          </div>
          <div className="space-y-3">
            {suppliers.map((sup, i) => (
              <AnimatedCard
                key={sup.name}
                className={`bg-white border-[1.5px] rounded-r p-3.75 cursor-pointer hover:border-p-400 ${i === 0 ? "border-p-500 bg-p-50" : "border-p-100"}`}
                hoverY={-2}
                hoverShadow="0 4px 20px rgba(244,114,182,0.25)"
              >
                <div className="flex justify-between items-start mb-2.75">
                  <div className="w-10 h-10 rounded-[10px] bg-n-100 flex items-center justify-center text-[17px]">
                    🐄
                  </div>
                  <div className="flex items-center gap-0.75 text-[11.5px] font-semibold text-fp-yellow">
                    ★ {sup.rating}
                  </div>
                </div>
                <div className="text-[13.5px] font-bold text-n-900 mb-0.5">
                  {sup.name}
                </div>
                <div className="text-[11.5px] text-n-500 mb-2">{sup.sub}</div>
                <div className="flex gap-1 flex-wrap mb-2.25">
                  {sup.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.25 py-0.5 bg-p-50 text-p-500 rounded-full text-[10px] font-semibold border border-p-200"
                    >
                      {tag}
                    </span>
                  ))}
                  <span
                    className={`px-2.25 py-0.5 rounded-full text-[10px] font-semibold border ${sup.badgeCls}`}
                  >
                    {sup.badge}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2.25 border-t border-n-100">
                  <div className="text-[14.5px] font-extrabold text-n-900">
                    {sup.price}{" "}
                    <span className="text-[10.5px] text-n-400 font-normal">
                      ต่อ กก.
                    </span>
                  </div>
                  <div className="text-[11px] text-n-400">
                    AI Score: <b className="text-p-500">{sup.score}/100</b>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>

        {/* AI Chat */}
        <div className="bg-white rounded-rlg border border-p-100 shadow-[0_1px_3px_rgba(0,0,0,.04)] flex flex-col h-fit">
          <div className="px-5 pt-4 pb-3.25 border-b border-n-100">
            <div className="text-[13.5px] font-bold text-n-900">
              🤖 AI Sourcing Assistant
            </div>
            <div className="text-[11px] text-n-500 mt-0.5">
              ถามฉันเกี่ยวกับผู้จัดส่งได้เลย
            </div>
          </div>
          <div className="flex-1 p-3 flex flex-col gap-2.25">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-1.75 items-start ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11.5px] shrink-0 ${msg.role === "ai" ? "bg-linear-to-br from-p-400 to-p-500 text-white" : "bg-n-800 text-white"}`}
                >
                  {msg.role === "ai" ? "🤖" : "ส"}
                </div>
                <div
                  className={`max-w-[84%] px-3 py-2 rounded-[10px] text-[12.5px] leading-normal ${msg.role === "ai" ? "bg-white border border-p-100 text-n-800" : "bg-n-900 text-white"}`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <div className="px-2.75 py-2.25 border-t border-n-100 flex gap-1.75">
            <input
              placeholder="ถามเกี่ยวกับผู้จัดส่ง..."
              className="flex-1 px-3 py-2.25 border-[1.5px] border-n-200 rounded-[9px] font-sans text-[12.5px] outline-none bg-cream focus:border-p-400 transition-all placeholder:text-n-300"
            />
            <button className="w-9 h-9 bg-linear-to-br from-p-400 to-p-500 border-none rounded-[9px] cursor-pointer text-white text-[15px] shrink-0 flex items-center justify-center">
              ➤
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

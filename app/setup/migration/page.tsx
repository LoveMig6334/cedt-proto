"use client";

import SetupHeader from "@/components/setup/SetupHeader";
import { useRouter } from "next/navigation";

const fileFormats = [
  { ext: ".xlsx", label: "Excel", icon: "📊", color: "text-fp-green" },
  { ext: ".csv", label: "CSV", icon: "📄", color: "text-fp-blue" },
  { ext: ".pdf", label: "PDF", icon: "📋", color: "text-fp-red" },
];

const aiSteps = [
  { label: "อ่านและแยกแถวข้อมูล", done: true },
  { label: "จับคู่ฟิลด์กับฐานข้อมูล FreshPro", done: true },
  { label: "ตรวจสอบความสมบูรณ์ของข้อมูล", done: false },
  { label: "นำเข้าข้อมูลลงฐานข้อมูล", done: false },
];

export default function MigrationSetupPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <SetupHeader currentStep={4} />

      <main className="flex-1 max-w-[860px] mx-auto px-8 py-10 w-full">
        {/* Title + coming-soon badge */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-[26px] font-extrabold text-n-900">
              นำเข้าข้อมูลจากระบบเดิม
            </h1>
            <span className="bg-fp-yellow/15 border border-fp-yellow/40 text-fp-yellow text-[11.5px] font-bold px-3 py-1 rounded-full">
              เร็วๆ นี้ 🔜
            </span>
          </div>
          <p className="text-[13.5px] text-n-500">
            ระบบ AI จะวิเคราะห์ไฟล์จากโรงงานเก่าและแปลงข้อมูลเข้าสู่ FreshPro
            โดยอัตโนมัติ
          </p>
        </div>

        {/* Upload area (decorative) */}
        <div className="relative bg-white rounded-rlg border-2 border-dashed border-n-300 overflow-hidden mb-5">
          {/* Coming-soon overlay */}
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] z-10 flex items-center justify-center">
            <div className="text-center">
              <div className="text-[40px] mb-2">🚧</div>
              <div className="text-[15px] font-bold text-n-700 mb-1">
                กำลังพัฒนา
              </div>
              <div className="text-[12.5px] text-n-500">
                ฟีเจอร์นี้จะพร้อมใช้งานในเวอร์ชันถัดไป
              </div>
            </div>
          </div>

          {/* Decorative upload content (behind overlay) */}
          <div className="p-10 flex flex-col items-center">
            <div className="w-16 h-16 rounded-[18px] bg-p-50 border-2 border-p-200 flex items-center justify-center text-[28px] mb-4">
              ☁️
            </div>
            <p className="text-[15px] font-semibold text-n-700 mb-1">
              ลากไฟล์วางที่นี่ หรือคลิกเพื่อเลือกไฟล์
            </p>
            <p className="text-[12.5px] text-n-400 mb-5">
              รองรับไฟล์ขนาดสูงสุด 50 MB
            </p>
            <div className="flex gap-3">
              {fileFormats.map((f) => (
                <div
                  key={f.ext}
                  className="flex items-center gap-1.5 bg-n-50 border border-n-200 rounded-[8px] px-3 py-1.5"
                >
                  <span className={`text-[15px] ${f.color}`}>{f.icon}</span>
                  <span className="text-[12px] font-semibold text-n-600">
                    {f.label}
                  </span>
                  <span className="text-[10.5px] text-n-400">{f.ext}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI processing preview (decorative) */}
        <div className="relative bg-white rounded-rlg border border-p-100 overflow-hidden mb-8">
          {/* Coming-soon overlay */}
          <div className="absolute inset-0 bg-white/75 backdrop-blur-[1px] z-10" />

          <div className="px-6 py-4 border-b border-n-100 flex items-center justify-between">
            <div>
              <h2 className="text-[15px] font-bold text-n-900 flex items-center gap-2">
                AI วิเคราะห์ข้อมูล
                <span className="bg-p-100 text-p-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  AI-Powered
                </span>
              </h2>
              <p className="text-[12px] text-n-500 mt-0.5">
                ระบบจะจับคู่ข้อมูลเก่ากับโครงสร้างของ FreshPro อัตโนมัติ
              </p>
            </div>
          </div>

          <div className="p-6">
            <div className="flex flex-col gap-3">
              {aiSteps.map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      step.done
                        ? "bg-fp-green text-white"
                        : "bg-n-100 text-n-400 border border-n-200"
                    }`}
                  >
                    {step.done ? "✓" : i + 1}
                  </div>
                  <span
                    className={`text-[13px] ${step.done ? "text-n-700 font-medium" : "text-n-400"}`}
                  >
                    {step.label}
                  </span>
                  {!step.done && (
                    <span className="text-[11px] text-n-300 ml-auto">
                      รอดำเนินการ
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center">
          <a
            href="/setup/suppliers"
            className="text-[13px] text-n-500 hover:text-n-700 transition-colors"
          >
            ← กลับ
          </a>
          <div className="flex flex-col items-end gap-1.5">
            <button
              onClick={() => router.push("/dashboard")}
              className="bg-linear-to-br from-p-400 to-p-500 text-white rounded-r px-10 py-3 text-[14.5px] font-bold shadow-[0_4px_20px_rgba(244,114,182,.3)] hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(244,114,182,.4)] transition-all"
            >
              ข้ามและเริ่มใช้งาน FreshPro →
            </button>
            <p className="text-[11.5px] text-n-400">
              นำเข้าข้อมูลได้ภายหลังใน ตั้งค่าโรงงาน
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

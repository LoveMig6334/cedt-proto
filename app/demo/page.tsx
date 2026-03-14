import { WorkflowCarousel } from "@/components/motion/WorkflowCarousel";
import Link from "next/link";

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Header */}
      <nav className="bg-white border-b border-n-200/70 shadow-sm">
        <div className="max-w-7xl mx-auto px-10 py-5 flex items-center justify-between">
          <Link
            href="/"
            className="text-n-500 text-[13px] font-medium hover:text-p-500 transition-colors flex items-center gap-1.5"
          >
            ← กลับหน้าหลัก
          </Link>
          <span className="text-[15px] font-bold text-n-900">
            ตัวอย่างระบบ <b className="text-p-500">FreshPro</b>
          </span>
          <Link
            href="/login"
            className="bg-p-500 text-white rounded-[9px] px-5 py-2.25 text-[13px] font-semibold hover:bg-p-400 transition-colors"
          >
            เริ่มใช้งาน
          </Link>
        </div>
      </nav>

      {/* Carousel */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-10 py-16">
        <h1 className="text-center text-[34px] font-extrabold text-n-900 mb-2.5">
          ครอบคลุมทุกขั้นตอนการผลิต
        </h1>
        <p className="text-center text-n-500 text-[14.5px] mb-13">
          ระบบเดียวที่จัดการกระบวนการทั้งหมดของโรงงานแปรรูปเนื้อวัว
          ตั้งแต่ต้นน้ำถึงปลายน้ำ
        </p>
        <WorkflowCarousel />
      </div>
    </div>
  );
}

"use client";

import SetupHeader from "@/components/setup/SetupHeader";
import { saveSelectedSupplierIds } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Supplier = {
  id: string;
  name: string;
  type: "cattle_farm" | "meat_import" | "domestic";
  rating: number;
  province: string;
  products: string[];
  verified: boolean;
};

const mockSuppliers: Supplier[] = [
  {
    id: "sup-1",
    name: "บริษัท ฟาร์มโคทอง จำกัด",
    type: "cattle_farm",
    rating: 4.8,
    province: "เชียงใหม่",
    products: ["วัวพ่อพันธุ์", "วัวขุน", "ลูกวัว"],
    verified: true,
  },
  {
    id: "sup-2",
    name: "วิสาหกิจชุมชนวัวดี",
    type: "cattle_farm",
    rating: 4.5,
    province: "นครราชสีมา",
    products: ["วัวพื้นเมือง", "วัวนม"],
    verified: true,
  },
  {
    id: "sup-3",
    name: "บริษัท ไทยมีทอิมพอร์ต จำกัด",
    type: "meat_import",
    rating: 4.2,
    province: "กรุงเทพฯ",
    products: ["เนื้อสด", "เนื้อแช่แข็ง", "เนื้อออสเตรเลีย"],
    verified: true,
  },
  {
    id: "sup-4",
    name: "ห้างหุ้นส่วน สยามแคทเทิล",
    type: "domestic",
    rating: 3.9,
    province: "ขอนแก่น",
    products: ["วัวพื้นเมือง", "เนื้อสด"],
    verified: true,
  },
  {
    id: "sup-5",
    name: "บริษัท อีสานโปรตีน จำกัด",
    type: "domestic",
    rating: 3.4,
    province: "อุดรธานี",
    products: ["เนื้อชิ้น", "เนื้อบด"],
    verified: false,
  },
  {
    id: "sup-6",
    name: "ฟาร์มวัวสุขสมบูรณ์",
    type: "cattle_farm",
    rating: 3.1,
    province: "ลพบุรี",
    products: ["วัวขุน", "ลูกวัว"],
    verified: false,
  },
  {
    id: "sup-7",
    name: "บริษัท แพคเกจมีท จำกัด",
    type: "meat_import",
    rating: 2.7,
    province: "ชลบุรี",
    products: ["เนื้อแช่แข็ง", "เนื้อนำเข้า"],
    verified: false,
  },
  {
    id: "sup-8",
    name: "ห้างหุ้นส่วน โคราชฟาร์ม",
    type: "cattle_farm",
    rating: 2.3,
    province: "นครราชสีมา",
    products: ["วัวพื้นเมือง"],
    verified: false,
  },
];

const typeLabel: Record<Supplier["type"], string> = {
  cattle_farm: "ฟาร์มวัว",
  meat_import: "นำเข้า",
  domestic: "ในประเทศ",
};

const typeBadgeClass: Record<Supplier["type"], string> = {
  cattle_farm: "bg-fp-green/10 text-fp-green",
  meat_import: "bg-fp-blue/10 text-fp-blue",
  domestic: "bg-fp-yellow/15 text-fp-yellow",
};

function StarRating({ rating }: { rating: number }) {
  const filled = Math.round(rating);
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          className={`text-[14px] leading-none ${s <= filled ? "text-fp-yellow" : "text-n-200"}`}
        >
          ★
        </span>
      ))}
      <span className="text-[12px] font-bold text-n-700 ml-1">{rating}</span>
    </div>
  );
}

const MIN_RATING = 3;

export default function SuppliersSetupPage() {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [aiLoading, setAiLoading] = useState(false);

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function handleAiRecommend() {
    setAiLoading(true);
    setTimeout(() => {
      const top3 = [...mockSuppliers]
        .filter((s) => s.rating >= MIN_RATING)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3)
        .map((s) => s.id);
      setSelectedIds(new Set(top3));
      setAiLoading(false);
    }, 1500);
  }

  function handleNext() {
    saveSelectedSupplierIds([...selectedIds]);
    router.push("/setup/migration");
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <SetupHeader currentStep={3} />

      <main className="flex-1 max-w-[920px] mx-auto px-8 py-10 w-full">
        {/* Title row */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-[26px] font-extrabold text-n-900 mb-1.5">
              เลือกผู้จัดส่งวัตถุดิบ
            </h1>
            <p className="text-[13.5px] text-n-500">
              เลือกผู้จัดส่งที่มีคะแนน{" "}
              <span className="font-semibold text-n-700">3/5 ขึ้นไป</span>{" "}
              เพื่อลดความเสี่ยงในการจัดหาวัตถุดิบ (ไม่บังคับ)
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {selectedIds.size > 0 && (
              <span className="bg-p-100 text-p-600 text-[12.5px] font-semibold px-3 py-1.5 rounded-full border border-p-200">
                เลือกแล้ว {selectedIds.size} ราย
              </span>
            )}
            <button
              onClick={handleAiRecommend}
              disabled={aiLoading}
              className="flex items-center gap-2 bg-linear-to-br from-p-400 to-p-500 text-white text-[13px] font-bold px-5 py-2.5 rounded-r shadow-[0_4px_14px_rgba(244,114,182,.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(244,114,182,.4)] disabled:opacity-80 transition-all"
            >
              {aiLoading ? (
                <>
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  AI กำลังวิเคราะห์...
                </>
              ) : (
                <>🤖 ให้ AI แนะนำ</>
              )}
            </button>
          </div>
        </div>

        {/* Rating threshold notice */}
        <div className="bg-fp-yellow/8 border border-fp-yellow/30 rounded-[10px] px-4 py-2.5 mb-6 flex items-center gap-2">
          <span className="text-fp-yellow text-[15px]">⚠️</span>
          <p className="text-[12.5px] text-n-700">
            ผู้จัดส่งที่มีคะแนน{" "}
            <span className="font-bold text-fp-red">ต่ำกว่า 3/5</span>{" "}
            ถูกล็อกไว้เพื่อลดความเสี่ยง — ไม่สามารถเลือกได้
          </p>
        </div>

        {/* Supplier grid */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {mockSuppliers.map((sup) => {
            const isLocked = sup.rating < MIN_RATING;
            const isSelected = selectedIds.has(sup.id);

            return (
              <div
                key={sup.id}
                className={`bg-white rounded-rlg border-2 p-5 flex flex-col transition-all duration-200 ${
                  isLocked
                    ? "border-n-200 opacity-55 cursor-not-allowed select-none"
                    : isSelected
                      ? "border-p-400 shadow-[0_0_0_3px_rgba(244,114,182,.12)] cursor-pointer"
                      : "border-p-100 hover:border-p-300 hover:shadow-[0_2px_12px_rgba(0,0,0,.06)] cursor-pointer"
                }`}
                onClick={() => !isLocked && toggleSelect(sup.id)}
                title={
                  isLocked ? "คะแนนต่ำกว่าเกณฑ์ขั้นต่ำ (3/5)" : undefined
                }
              >
                {/* Card header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-[13.5px] font-bold text-n-900 leading-snug mb-1">
                      {sup.name}
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`text-[10.5px] font-semibold px-2 py-0.5 rounded-full ${typeBadgeClass[sup.type]}`}
                      >
                        {typeLabel[sup.type]}
                      </span>
                      {sup.verified && (
                        <span className="text-[10px] font-semibold text-fp-green bg-fp-green/10 px-1.5 py-0.5 rounded-full">
                          ✓ ยืนยันแล้ว
                        </span>
                      )}
                      {isLocked && (
                        <span className="text-[10px] font-semibold text-fp-red bg-fp-red/10 px-1.5 py-0.5 rounded-full">
                          🔒 ล็อก
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Selected checkmark */}
                  {isSelected && (
                    <div className="w-5.5 h-5.5 rounded-full bg-p-500 text-white text-[11px] font-bold flex items-center justify-center shrink-0 ml-2">
                      ✓
                    </div>
                  )}
                </div>

                {/* Rating */}
                <div className="mb-2">
                  <StarRating rating={sup.rating} />
                </div>

                {/* Province */}
                <div className="text-[11.5px] text-n-500 mb-2.5">
                  📍 {sup.province}
                </div>

                {/* Products */}
                <div className="flex flex-wrap gap-1 mb-4 flex-1">
                  {sup.products.map((p) => (
                    <span
                      key={p}
                      className="text-[10.5px] bg-n-100 text-n-600 px-2 py-0.5 rounded-md"
                    >
                      {p}
                    </span>
                  ))}
                </div>

                {/* Action button */}
                <button
                  disabled={isLocked}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isLocked) toggleSelect(sup.id);
                  }}
                  className={`w-full py-2 rounded-[9px] text-[12.5px] font-semibold transition-colors ${
                    isLocked
                      ? "bg-n-100 text-n-400 cursor-not-allowed"
                      : isSelected
                        ? "bg-p-500 text-white"
                        : "bg-p-50 text-p-600 border border-p-200 hover:bg-p-100"
                  }`}
                >
                  {isLocked
                    ? "ไม่ผ่านเกณฑ์"
                    : isSelected
                      ? "✓ เลือกแล้ว"
                      : "+ เลือก"}
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center">
          <a
            href="/setup/employees"
            className="text-[13px] text-n-500 hover:text-n-700 transition-colors"
          >
            ← กลับ
          </a>
          <button
            onClick={handleNext}
            className="bg-linear-to-br from-p-400 to-p-500 text-white rounded-r px-8 py-3 text-[14.5px] font-bold shadow-[0_4px_20px_rgba(244,114,182,.3)] hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(244,114,182,.4)] transition-all"
          >
            ถัดไป: นำเข้าข้อมูล →
          </button>
        </div>
      </main>
    </div>
  );
}

"use client";

import SetupHeader from "@/components/setup/SetupHeader";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveFactory } from "@/lib/auth";

// Dynamically import FreeMapPicker to avoid SSR window issues
const FreeMapPicker = dynamic(
  () => import("@/components/setup/FreeMapPicker"),
  { 
    ssr: false,
    loading: () => <div className="h-[300px] w-full bg-n-50 animate-pulse rounded-[12px] flex items-center justify-center text-n-400">Loading Map...</div>
  }
);

const inputClass =
  "w-full bg-white border-2 border-n-200 rounded-[9px] px-4 py-2.5 text-[13.5px] font-medium text-n-800 outline-none focus:border-p-400 focus:shadow-[0_0_0_4px_rgba(244,114,182,.08)] transition-colors";

const selectClass =
  "w-full bg-white border-2 border-n-200 rounded-[9px] px-4 py-2.5 text-[13.5px] font-medium text-n-800 outline-none focus:border-p-400 transition-colors disabled:bg-n-50 disabled:text-n-400 cursor-pointer disabled:cursor-not-allowed";

export default function FactorySetupPage() {
  const router = useRouter();

  const [factoryName, setFactoryName] = useState("");
  const [factoryType, setFactoryType] = useState("");
  const [locationData, setLocationData] = useState<{ address: string; lat: number; lng: number } | null>(null);
  const [error, setError] = useState("");

  function handleNext() {
    if (!factoryName.trim()) {
      setError("*กรุณากรอกชื่อโรงงาน");
      return;
    }
    setError("");

    saveFactory({
      id: "factory-1",
      name: factoryName.trim(),
      type: factoryType,
      province: "",
      district: "",
      subDistrict: "",
      zipcode: "",
      address: locationData?.address ?? "",
      lat: locationData?.lat ?? 0,
      lng: locationData?.lng ?? 0,
    });

    router.push("/setup/employees");
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <SetupHeader currentStep={1} />

      <main className="flex-1 max-w-[860px] mx-auto px-8 py-10 w-full">
        <div className="mb-8">
          <h1 className="text-[26px] font-extrabold text-n-900 mb-1.5">
            ตั้งค่าโรงงานของคุณ
          </h1>
          <p className="text-[13.5px] text-n-500">
            กรอกข้อมูลพื้นฐานเพื่อเริ่มต้นใช้งาน FreshPro
          </p>
        </div>

        {/* Section 1: Factory Info */}
        <div className="bg-white rounded-rlg border border-p-100 shadow-[0_1px_3px_rgba(0,0,0,.04)] overflow-hidden mb-5">
          <div className="px-6 py-4 border-b border-n-100">
            <h2 className="text-[15px] font-bold text-n-900">ข้อมูลโรงงาน</h2>
          </div>
          <div className="p-6 grid grid-cols-2 gap-5">
            <div className="col-span-2">
              <label className="block text-[12.5px] font-bold text-n-800 mb-2">
                ชื่อโรงงาน <span className="text-fp-red">*</span>
              </label>
              <input
                type="text"
                value={factoryName}
                onChange={(e) => setFactoryName(e.target.value)}
                placeholder="เช่น โรงงานแปรรูปเนื้อขุนสยาม"
                className={inputClass}
              />
              {error && <p className="text-fp-red text-[11.5px] mt-1.5">{error}</p>}
            </div>
            <div className="col-span-2">
              <label className="block text-[12.5px] font-bold text-n-800 mb-2">
                ประเภทโรงงาน
              </label>
              <select
                value={factoryType}
                onChange={(e) => setFactoryType(e.target.value)}
                className={selectClass}
              >
                <option value="">-- เลือกประเภทโรงงาน --</option>
                <option value="beef">โรงงานชำแหละและแปรรูปเนื้อวัว (Beef Processing)</option>
                <option value="chicken">โรงงานชำแหละและแปรรูปเนื้อไก่ (Chicken Processing)</option>
                <option value="fish">โรงงานชำแหละและแปรรูปเนื้อปลา (Fish Processing)</option>
                <option value="pork">โรงงานชำแหละและแปรรูปเนื้อหมู (Pork Processing)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Free Map Location */}
        <div className="bg-white rounded-rlg border border-p-100 shadow-[0_1px_3px_rgba(0,0,0,.04)] overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-n-100">
            <h2 className="text-[15px] font-bold text-n-900">ที่ตั้งโรงงาน</h2>
            <p className="text-[12px] text-n-500 mt-0.5">ค้นหาที่อยู่หรือคลิกลูกศรเพื่อปักหมุด</p>
          </div>
          <div className="p-6">
            <FreeMapPicker
              onAddressSelect={(data) => setLocationData(data)}
              initialLocation={locationData}
            />

            {locationData && (
              <div className="mt-4 p-3.5 bg-p-50 border border-p-100 rounded-[10px]">
                <p className="text-[12px] font-bold text-p-600 mb-1">📍 ที่อยู่ที่เลือก:</p>
                <p className="text-[13px] text-n-700 leading-relaxed font-medium">
                  {locationData.address}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center">
          <a href="/login" className="text-[13px] text-n-500 hover:text-n-700 transition-colors">
            ← กลับสู่หน้าเข้าสู่ระบบ
          </a>
          <button
            onClick={handleNext}
            className="bg-linear-to-br from-p-400 to-p-500 text-white rounded-r px-8 py-3 text-[14.5px] font-bold shadow-[0_4px_20px_rgba(244,114,182,.3)] hover:-translate-y-0.5 transition-all"
          >
            ถัดไป: ข้อมูลพนักงาน →
          </button>
        </div>
      </main>
    </div>
  );
}

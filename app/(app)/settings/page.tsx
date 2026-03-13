"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

// Dynamically import FreeMapPicker
const FreeMapPicker = dynamic(
  () => import("@/components/setup/FreeMapPicker"),
  { 
    ssr: false,
    loading: () => <div className="h-[300px] w-full bg-n-50 animate-pulse rounded-[12px] flex items-center justify-center text-n-400">Loading Map...</div>
  }
);

export default function SettingsPage() {
  const [factoryType, setFactoryType] = useState<string>("");
  const [locationData, setLocationData] = useState<{ address: string; lat: number; lng: number } | null>(null);

  return (
    <div>
      {/* Page header */}
      <div className="flex justify-between items-start mb-5.5">
        <div>
          <div className="text-[20px] font-extrabold text-n-900 mb-0.75">
            ตั้งค่าโรงงาน
          </div>
          <div className="text-[12.5px] text-n-500">  
            จัดการข้อมูลและรายละเอียดสถานที่ตั้งของโรงงาน
          </div>
        </div>
        <button className="bg-linear-to-br from-p-400 to-p-500 text-white rounded-[9px] px-5 py-2.5 text-[13px] font-semibold shadow-[0_4px_20px_rgba(244,114,182,.25)] hover:-translate-y-0.5 transition-all">
          บันทึกการตั้งค่า
        </button>
      </div>

      <div className="max-w-3xl">
        {/* Section: ข้อมูลทั่วไป */}
        <div className="bg-white rounded-rlg border border-p-100 shadow-[0_1px_3px_rgba(0,0,0,.04)] overflow-hidden">
          <div className="px-6 py-5 border-b border-n-100">
            <h2 className="text-[16px] font-bold text-n-900">ข้อมูลทั่วไป</h2>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <label className="block text-[13px] font-bold text-n-800 mb-2">
                ประเภทโรงงาน
              </label>
              <select
                value={factoryType}
                onChange={(e) => setFactoryType(e.target.value)}
                className="w-full bg-white border-2 border-n-200 rounded-[9px] px-4 py-2.5 text-[14px] font-medium text-n-800 outline-none focus:border-p-400 cursor-pointer transition-colors appearance-none"
              >
                <option value="">-- เลือกประเภทโรงงาน --</option>
                <option value="beef">โรงงานชำแหละและแปรรูปเนื้อวัว (Beef Processing)</option>
                <option value="chicken">โรงงานชำแหละและแปรรูปเนื้อวัวไก่ (Chicken Processing)</option>
                <option value="fish">โรงงานชำแหละและแปรรูปเนื้อวัวปลา (Fish Processing)</option>
                <option value="pork">โรงงานชำแหละและแปรรูปเนื้อวัวหมู (Pork Processing)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section: ที่ตั้งโรงงาน */}
        <div className="bg-white rounded-rlg border border-p-100 shadow-[0_1px_3px_rgba(0,0,0,.04)] overflow-hidden mt-6">
          <div className="px-6 py-5 border-b border-n-100">
            <h2 className="text-[16px] font-bold text-n-900">ที่ตั้งโรงงาน</h2>
            <p className="text-[12.5px] text-n-500 mt-1">
              ค้นหาที่อยู่หรือคลิกบนแผนที่เพื่อระบุตำแหน่งโรงงาน
            </p>
          </div>

          <div className="p-6">
            <FreeMapPicker
              onAddressSelect={(data) => setLocationData(data)}
              initialLocation={locationData}
            />

            {/* Address summary */}
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
      </div>
    </div>
  );
}

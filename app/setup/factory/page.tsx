"use client";

import SetupHeader from "@/components/setup/SetupHeader";
import { saveFactory } from "@/lib/auth";
import locationsData from "@/data/thailand-locations.json";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";

const MapPicker = dynamic(
  () => import("@/components/setup/MapPicker"),
  { ssr: false },
);

type SubDistrictType = {
  subDistrictId: number;
  subDistrictName: string;
  zipcode: string;
};

type DistrictType = {
  districtId: number;
  districtName: string;
  subDistricts: SubDistrictType[];
};

type ProvinceType = {
  provinceId: number;
  provinceName: string;
  districts: DistrictType[];
};

const inputClass =
  "w-full bg-white border-2 border-n-200 rounded-[9px] px-4 py-2.5 text-[13.5px] font-medium text-n-800 outline-none focus:border-p-400 focus:shadow-[0_0_0_4px_rgba(244,114,182,.08)] transition-colors";

const selectClass =
  "w-full bg-white border-2 border-n-200 rounded-[9px] px-4 py-2.5 text-[13.5px] font-medium text-n-800 outline-none focus:border-p-400 transition-colors disabled:bg-n-50 disabled:text-n-400 cursor-pointer disabled:cursor-not-allowed";

export default function FactorySetupPage() {
  const router = useRouter();
  const provinces: ProvinceType[] = locationsData;

  const [factoryName, setFactoryName] = useState("");
  const [selectedProvinceId, setSelectedProvinceId] = useState("");
  const [selectedDistrictId, setSelectedDistrictId] = useState("");
  const [selectedSubDistrictId, setSelectedSubDistrictId] = useState("");
  const [address, setAddress] = useState("");
  const [markerPos, setMarkerPos] = useState<[number, number] | null>(null);
  const [error, setError] = useState("");

  const districts = selectedProvinceId
    ? (provinces.find((p) => p.provinceId.toString() === selectedProvinceId)
        ?.districts ?? [])
    : [];

  const subDistricts = selectedDistrictId
    ? (districts.find((d) => d.districtId.toString() === selectedDistrictId)
        ?.subDistricts ?? [])
    : [];

  const zipcode = selectedSubDistrictId
    ? (subDistricts.find(
        (sd) => sd.subDistrictId.toString() === selectedSubDistrictId,
      )?.zipcode ?? "")
    : "";

  function handleNext() {
    if (!factoryName.trim()) {
      setError("กรุณากรอกชื่อโรงงาน");
      return;
    }
    setError("");

    saveFactory({
      id: "factory-1",
      name: factoryName.trim(),
      type: "meat_processing",
      province:
        provinces.find((p) => p.provinceId.toString() === selectedProvinceId)
          ?.provinceName ?? "",
      district:
        districts.find((d) => d.districtId.toString() === selectedDistrictId)
          ?.districtName ?? "",
      subDistrict:
        subDistricts.find(
          (sd) => sd.subDistrictId.toString() === selectedSubDistrictId,
        )?.subDistrictName ?? "",
      zipcode,
      address: address.trim(),
      lat: markerPos?.[0] ?? 0,
      lng: markerPos?.[1] ?? 0,
    });

    router.push("/setup/employees");
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <SetupHeader currentStep={1} />

      {/* Content */}
      <main className="flex-1 max-w-[860px] mx-auto px-8 py-10 w-full">
        <div className="mb-8">
          <h1 className="text-[26px] font-extrabold text-n-900 mb-1.5">
            ตั้งค่าโรงงานของคุณ
          </h1>
          <p className="text-[13.5px] text-n-500">
            กรอกข้อมูลพื้นฐานของโรงงาน เพื่อเริ่มต้นใช้งาน FreshPro
          </p>
        </div>

        {/* Section 1: Factory Info */}
        <div className="bg-white rounded-rlg border border-p-100 shadow-[0_1px_3px_rgba(0,0,0,.04)] overflow-hidden mb-5">
          <div className="px-6 py-4 border-b border-n-100">
            <h2 className="text-[15px] font-bold text-n-900">ข้อมูลโรงงาน</h2>
            <p className="text-[12px] text-n-500 mt-0.5">
              ชื่อและประเภทของโรงงานแปรรูป
            </p>
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
                placeholder="เช่น โรงงานแปรรูปเนื้อวัวสยาม"
                className={inputClass}
              />
              {error && (
                <p className="text-fp-red text-[11.5px] mt-1.5">{error}</p>
              )}
            </div>
            <div className="col-span-2">
              <label className="block text-[12.5px] font-bold text-n-800 mb-2">
                ประเภทโรงงาน
              </label>
              <select
                disabled
                className="w-full bg-n-50 text-n-500 border-2 border-n-200 rounded-[9px] px-4 py-2.5 text-[13.5px] font-medium outline-none cursor-not-allowed"
              >
                <option>
                  โรงงานชำแหละและแปรรูปเนื้อสัตว์ (Meat Processing)
                </option>
              </select>
              <p className="text-[11px] text-n-400 mt-1.5">
                * ขณะนี้รองรับเฉพาะโรงงานประเภทเนื้อสัตว์
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Location */}
        <div className="bg-white rounded-rlg border border-p-100 shadow-[0_1px_3px_rgba(0,0,0,.04)] overflow-hidden mb-5">
          <div className="px-6 py-4 border-b border-n-100">
            <h2 className="text-[15px] font-bold text-n-900">ที่ตั้งโรงงาน</h2>
            <p className="text-[12px] text-n-500 mt-0.5">
              ระบุที่อยู่โรงงาน (เฉพาะในประเทศไทย)
            </p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-[12.5px] font-bold text-n-800 mb-2">
                  จังหวัด
                </label>
                <select
                  value={selectedProvinceId}
                  onChange={(e) => {
                    setSelectedProvinceId(e.target.value);
                    setSelectedDistrictId("");
                    setSelectedSubDistrictId("");
                  }}
                  className={selectClass}
                >
                  <option value="">-- เลือกจังหวัด --</option>
                  {provinces.map((p) => (
                    <option key={p.provinceId} value={p.provinceId}>
                      {p.provinceName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[12.5px] font-bold text-n-800 mb-2">
                  อำเภอ / เขต
                </label>
                <select
                  value={selectedDistrictId}
                  onChange={(e) => {
                    setSelectedDistrictId(e.target.value);
                    setSelectedSubDistrictId("");
                  }}
                  disabled={!selectedProvinceId}
                  className={selectClass}
                >
                  <option value="">-- เลือกอำเภอ/เขต --</option>
                  {districts.map((d) => (
                    <option key={d.districtId} value={d.districtId}>
                      {d.districtName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[12.5px] font-bold text-n-800 mb-2">
                  ตำบล / แขวง
                </label>
                <select
                  value={selectedSubDistrictId}
                  onChange={(e) => setSelectedSubDistrictId(e.target.value)}
                  disabled={!selectedDistrictId}
                  className={selectClass}
                >
                  <option value="">-- เลือกตำบล/แขวง --</option>
                  {subDistricts.map((sd) => (
                    <option key={sd.subDistrictId} value={sd.subDistrictId}>
                      {sd.subDistrictName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[12.5px] font-bold text-n-800 mb-2">
                  รหัสไปรษณีย์
                </label>
                <input
                  type="text"
                  value={zipcode}
                  readOnly
                  placeholder="อัตโนมัติ"
                  className="w-full bg-n-50 border-2 border-n-200 rounded-[9px] px-4 py-2.5 text-[13.5px] font-bold text-n-600 outline-none cursor-not-allowed"
                />
              </div>
            </div>
            <div>
              <label className="block text-[12.5px] font-bold text-n-800 mb-2">
                รายละเอียดที่อยู่ (บ้านเลขที่, ถนน, ซอย, อาคาร)
              </label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="บ้านเลขที่ 99/9 หมู่ 1 ถนน..."
                className="w-full bg-white border-2 border-n-200 rounded-[9px] px-4 py-3 text-[13.5px] font-medium text-n-800 outline-none focus:border-p-400 focus:shadow-[0_0_0_4px_rgba(244,114,182,.08)] transition-colors resize-none"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Map */}
        <div className="bg-white rounded-rlg border border-p-100 shadow-[0_1px_3px_rgba(0,0,0,.04)] overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-n-100">
            <h2 className="text-[15px] font-bold text-n-900">
              ปักหมุดตำแหน่งโรงงาน
            </h2>
            <p className="text-[12px] text-n-500 mt-0.5">
              คลิกบนแผนที่เพื่อระบุตำแหน่งโรงงาน (ใช้ OpenStreetMap)
            </p>
          </div>
          <div className="p-6">
            <MapPicker
              onLocationChange={(lat, lng) => setMarkerPos([lat, lng])}
              markerPos={markerPos}
            />
            {markerPos && (
              <p className="text-[11.5px] text-n-500 mt-2">
                📍 ตำแหน่งที่เลือก: {markerPos[0].toFixed(5)},{" "}
                {markerPos[1].toFixed(5)}
              </p>
            )}
            {!markerPos && (
              <p className="text-[11.5px] text-n-400 mt-2">
                คลิกบนแผนที่เพื่อปักหมุดตำแหน่ง
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center">
          <a
            href="/login"
            className="text-[13px] text-n-500 hover:text-n-700 transition-colors"
          >
            ← กลับสู่หน้าเข้าสู่ระบบ
          </a>
          <button
            onClick={handleNext}
            className="bg-linear-to-br from-p-400 to-p-500 text-white rounded-r px-8 py-3 text-[14.5px] font-bold shadow-[0_4px_20px_rgba(244,114,182,.3)] hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(244,114,182,.4)] transition-all"
          >
            ถัดไป: ข้อมูลพนักงาน →
          </button>
        </div>
      </main>
    </div>
  );
}

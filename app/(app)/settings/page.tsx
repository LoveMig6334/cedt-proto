'use client';

import { useState, useEffect } from 'react';
import locationsData from '@/data/thailand-locations.json';

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

export default function SettingsPage() {
  const [provinces, setProvinces] = useState<ProvinceType[]>(locationsData);
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>('');
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('');
  const [selectedSubDistrictId, setSelectedSubDistrictId] = useState<string>('');

  const [districts, setDistricts] = useState<DistrictType[]>([]);
  const [subDistricts, setSubDistricts] = useState<SubDistrictType[]>([]);
  const [zipcode, setZipcode] = useState<string>('');

  // Handle province change
  useEffect(() => {
    if (selectedProvinceId) {
      const province = provinces.find(p => p.provinceId.toString() === selectedProvinceId);
      setDistricts(province ? province.districts : []);
      setSelectedDistrictId('');
      setSubDistricts([]);
      setSelectedSubDistrictId('');
      setZipcode('');
    } else {
      setDistricts([]);
      setSelectedDistrictId('');
      setSubDistricts([]);
      setSelectedSubDistrictId('');
      setZipcode('');
    }
  }, [selectedProvinceId, provinces]);

  // Handle district change
  useEffect(() => {
    if (selectedDistrictId) {
      const district = districts.find(d => d.districtId.toString() === selectedDistrictId);
      setSubDistricts(district ? district.subDistricts : []);
      setSelectedSubDistrictId('');
      setZipcode('');
    } else {
      setSubDistricts([]);
      setSelectedSubDistrictId('');
      setZipcode('');
    }
  }, [selectedDistrictId, districts]);

  // Handle sub-district change
  useEffect(() => {
    if (selectedSubDistrictId) {
      const subDistrict = subDistricts.find(sd => sd.subDistrictId.toString() === selectedSubDistrictId);
      setZipcode(subDistrict ? subDistrict.zipcode : '');
    } else {
      setZipcode('');
    }
  }, [selectedSubDistrictId, subDistricts]);

  return (
    <div>
      {/* Page header */}
      <div className="flex justify-between items-start mb-[22px]">
        <div>
          <div className="text-[20px] font-extrabold text-n-900 mb-[3px]">ตั้งค่าโรงงาน</div>
          <div className="text-[12.5px] text-n-500">จัดการข้อมูลและรายละเอียดสถานที่ตั้งของโรงงาน</div>
        </div>
        <button className="bg-gradient-to-br from-p-400 to-p-500 text-white rounded-[9px] px-5 py-[10px] text-[13px] font-semibold shadow-[0_4px_20px_rgba(244,114,182,.25)] hover:-translate-y-0.5 transition-all">
          บันทึกการตั้งค่า
        </button>
      </div>

      <div className="max-w-3xl">
        <div className="bg-white rounded-rlg border border-p-100 shadow-[0_1px_3px_rgba(0,0,0,.04)] overflow-hidden">
          <div className="px-6 py-5 border-b border-n-100">
            <h2 className="text-[16px] font-bold text-n-900">ข้อมูลทั่วไป</h2>
            <p className="text-[12.5px] text-n-500 mt-1">ตั้งค่าประเภทโรงงานและรายละเอียดพื้นฐาน</p>
          </div>
          
          <div className="p-6">
            <div className="mb-6">
              <label className="block text-[13px] font-bold text-n-800 mb-2">ประเภทโรงงาน</label>
              <select 
                value="meat"
                disabled
                className="w-full bg-n-50 text-n-500 border-2 border-n-200 rounded-[9px] px-4 py-2.5 text-[14px] font-medium outline-none cursor-not-allowed appearance-none"
              >
                <option value="meat">โรงงานชำแหละและแปรรูปเนื้อสัตว์ (Meat Processing)</option>
              </select>
              <p className="text-[11.5px] text-n-400 mt-2">* ขณะนี้ระบบรองรับเฉพาะการตั้งค่าโรงงานประเภทเนื้อสัตว์เท่านั้น</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-rlg border border-p-100 shadow-[0_1px_3px_rgba(0,0,0,.04)] overflow-hidden mt-6">
          <div className="px-6 py-5 border-b border-n-100">
            <h2 className="text-[16px] font-bold text-n-900">ที่ตั้งโรงงาน</h2>
            <p className="text-[12.5px] text-n-500 mt-1">ระบุที่อยู่ของโรงงานแบบละเอียด (เฉพาะในประเทศไทย)</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block text-[13px] font-bold text-n-800 mb-2">จังหวัด</label>
                <select 
                  value={selectedProvinceId}
                  onChange={(e) => setSelectedProvinceId(e.target.value)}
                  className="w-full bg-white border-2 border-n-200 rounded-[9px] px-4 py-2.5 text-[14px] font-medium text-n-800 outline-none focus:border-p-400 transition-colors"
                >
                  <option value="">-- เลือกจังหวัด --</option>
                  {provinces.map(p => (
                    <option key={p.provinceId} value={p.provinceId}>{p.provinceName}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-[13px] font-bold text-n-800 mb-2">อำเภอ / เขต</label>
                <select 
                  value={selectedDistrictId}
                  onChange={(e) => setSelectedDistrictId(e.target.value)}
                  disabled={!selectedProvinceId}
                  className="w-full bg-white border-2 border-n-200 rounded-[9px] px-4 py-2.5 text-[14px] font-medium text-n-800 outline-none focus:border-p-400 disabled:bg-n-50 disabled:text-n-400 cursor-pointer disabled:cursor-not-allowed transition-colors"
                >
                  <option value="">-- เลือกอำเภอ/เขต --</option>
                  {districts.map(d => (
                    <option key={d.districtId} value={d.districtId}>{d.districtName}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-[13px] font-bold text-n-800 mb-2">ตำบล / แขวง</label>
                <select 
                  value={selectedSubDistrictId}
                  onChange={(e) => setSelectedSubDistrictId(e.target.value)}
                  disabled={!selectedDistrictId}
                  className="w-full bg-white border-2 border-n-200 rounded-[9px] px-4 py-2.5 text-[14px] font-medium text-n-800 outline-none focus:border-p-400 disabled:bg-n-50 disabled:text-n-400 cursor-pointer disabled:cursor-not-allowed transition-colors"
                >
                  <option value="">-- เลือกตำบล/แขวง --</option>
                  {subDistricts.map(sd => (
                    <option key={sd.subDistrictId} value={sd.subDistrictId}>{sd.subDistrictName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-n-800 mb-2">รหัสไปรษณีย์</label>
                <input 
                  type="text" 
                  value={zipcode}
                  readOnly
                  placeholder="รหัสไปรษณีย์"
                  className="w-full bg-n-50 border-2 border-n-200 rounded-[9px] px-4 py-2.5 text-[14px] font-bold text-n-600 outline-none cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-bold text-n-800 mb-2">รายละเอียดที่อยู่ (บ้านเลขที่, ถนน, ซอย, ตึก)</label>
              <textarea 
                rows={3}
                placeholder="บ้านเลขที่ 99/9 หมู่ 1 ถนน..."
                className="w-full bg-white border-2 border-n-200 rounded-[9px] px-4 py-3 text-[14px] font-medium text-n-800 outline-none focus:border-p-400 transition-colors resize-none"
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

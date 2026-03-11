'use client';

import { usePathname } from 'next/navigation';

const sectionTitles: Record<string, string> = {
  '/dashboard': 'ภาพรวม',
  '/sourcing': 'จัดหาวัตถุดิบ',
  '/intake': 'รับเข้าวัตถุดิบ',
  '/production': 'ควบคุมการผลิต',
  '/qc': 'ตรวจสอบคุณภาพ',
  '/warehouse': 'คลังสินค้า',
  '/sales': 'ขาย & จัดส่ง',
  '/reports': 'รายงานและสรุปผล',
};

export default function Topbar() {
  const pathname = usePathname();
  const currentTitle = sectionTitles[pathname] ?? 'ภาพรวม';

  return (
    <div className="h-[58px] bg-white border-b border-p-100 flex items-center px-6 gap-3 flex-shrink-0">
      <span className="text-[15.5px] font-bold text-n-900">FreshPro</span>
      <span className="text-n-300 text-[13px]">›</span>
      <span className="text-p-500 text-[13px] font-semibold">{currentTitle}</span>

      <div className="ml-auto flex items-center gap-[9px]">
        <button className="relative w-9 h-9 rounded-[9px] border border-n-200 bg-white flex items-center justify-center text-[15px] hover:bg-p-50 hover:border-p-200 transition-all cursor-pointer">
          🔔
          <span className="absolute top-[7px] right-[7px] w-[7px] h-[7px] bg-p-500 rounded-full border-[1.5px] border-white" />
        </button>
        <button className="w-9 h-9 rounded-[9px] border border-n-200 bg-white flex items-center justify-center text-[15px] hover:bg-p-50 hover:border-p-200 transition-all cursor-pointer">
          🔍
        </button>
        <button className="w-9 h-9 rounded-[9px] border border-n-200 bg-white flex items-center justify-center text-[15px] hover:bg-p-50 hover:border-p-200 transition-all cursor-pointer">
          ⚙️
        </button>
        <div className="w-9 h-9 rounded-[9px] bg-gradient-to-br from-p-400 to-p-500 flex items-center justify-center text-white text-[12.5px] font-bold cursor-pointer">
          สม
        </div>
      </div>
    </div>
  );
}

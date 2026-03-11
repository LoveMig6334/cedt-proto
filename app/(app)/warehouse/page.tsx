import type { Metadata } from 'next';
import { AnimatedButton } from '@/components/motion/AnimatedButton';

export const metadata: Metadata = { title: 'คลังสินค้า | FreshPro' };

const inventoryItems = [
  { id: 'INV-001', name: 'สันใน Wagyu เกรด A', lot: 'LP-0441', qty: '48 กก.', exp: '12 มี.ค. 68', temp: '-2°C', status: 'ดี', statusCls: 'bg-[#D1FAE5] text-[#059669]' },
  { id: 'INV-002', name: 'สันนอก เกรด B', lot: 'LP-0440', qty: '112 กก.', exp: '11 มี.ค. 68', temp: '-2°C', status: 'ดี', statusCls: 'bg-[#D1FAE5] text-[#059669]' },
  { id: 'INV-003', name: 'เนื้อสับ เกรด C', lot: 'LP-0439', qty: '65 กก.', exp: '10 มี.ค. 68', temp: '-4°C', status: 'ใกล้หมดอายุ', statusCls: 'bg-[#FEE2E2] text-[#DC2626]' },
  { id: 'INV-004', name: 'ซี่โครง Wagyu เกรด A', lot: 'LP-0438', qty: '84 กก.', exp: '13 มี.ค. 68', temp: '-2°C', status: 'ดี', statusCls: 'bg-[#D1FAE5] text-[#059669]' },
  { id: 'INV-005', name: 'เนื้อสำหรับสเต็ก', lot: 'LP-0437', qty: '30 กก.', exp: '14 มี.ค. 68', temp: '-2°C', status: 'จอง', statusCls: 'bg-p-100 text-p-500' },
];

export default function WarehousePage() {
  return (
    <div>
      <div className="flex justify-between items-start mb-[22px]">
        <div>
          <div className="text-[20px] font-extrabold text-n-900 mb-[3px]">🏪 คลังสินค้า</div>
          <div className="text-[12.5px] text-n-500">จัดการสต็อกสินค้าและติดตามวันหมดอายุแบบ Real-time</div>
        </div>
        <AnimatedButton>
          <button className="bg-gradient-to-br from-p-400 to-p-500 text-white rounded-[9px] px-5 py-[10px] text-[13px] font-semibold shadow-[0_4px_20px_rgba(244,114,182,.25)]">
            + เพิ่มสินค้าคลัง
          </button>
        </AnimatedButton>
      </div>

      {/* Storage stats */}
      <div className="grid grid-cols-4 gap-[15px] mb-5">
        {[
          { icon: '📦', v: '339 กก.', l: 'สต็อกรวม', sub: '5 รายการ' },
          { icon: '❄️', v: '-2°C', l: 'อุณหภูมิเฉลี่ย', sub: 'ปลอดภัย' },
          { icon: '⚠️', v: '1 ล็อต', l: 'ใกล้หมดอายุ', sub: 'ต้องขายด่วน' },
          { icon: '🔒', v: '30 กก.', l: 'สินค้าจอง', sub: 'รอจัดส่ง' },
        ].map((k) => (
          <div key={k.l} className="bg-white rounded-rlg border border-p-100 p-4 relative overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,.04)]">
            <div className="absolute -top-2 -right-2 w-16 h-16 bg-p-50 rounded-full" />
            <div className="text-[20px] mb-[9px]">{k.icon}</div>
            <div className="text-[20px] font-extrabold text-n-900 mb-0.5">{k.v}</div>
            <div className="text-[11px] text-n-500">{k.l}</div>
            <div className="text-[10.5px] text-n-400 mt-1">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Inventory table */}
      <div className="bg-white rounded-rlg border border-p-100 shadow-[0_1px_3px_rgba(0,0,0,.04)]">
        <div className="px-5 pt-4 pb-[13px] border-b border-n-100 flex items-center justify-between">
          <div className="text-[13.5px] font-bold text-n-900">รายการสินค้าในคลัง</div>
          <div className="flex items-center gap-2 bg-n-100 p-[3px] rounded-[10px]">
            {['ทั้งหมด', 'พร้อมขาย', 'จอง', 'ใกล้หมดอายุ'].map((t, i) => (
              <button key={t} className={`px-3 py-[7px] rounded-[8px] font-sans text-[12px] font-medium transition-all ${i === 0 ? 'bg-white text-n-900 font-bold shadow-[0_1px_3px_rgba(0,0,0,.07)]' : 'text-n-500'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {['รหัส', 'สินค้า', 'ล็อต', 'น้ำหนัก', 'หมดอายุ', 'อุณหภูมิ', 'สถานะ', ''].map((h) => (
                  <th key={h} className="bg-cream text-n-500 text-[10px] font-bold uppercase tracking-[.5px] px-[13px] py-[10px] text-left border-b border-n-100 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {inventoryItems.map((item) => (
                <tr key={item.id} className="hover:[&>td]:bg-p-50">
                  <td className="px-[13px] py-[11px] text-[11px] text-n-400 border-b border-n-100 font-mono">{item.id}</td>
                  <td className="px-[13px] py-[11px] text-[12.5px] text-n-900 border-b border-n-100 font-semibold">{item.name}</td>
                  <td className="px-[13px] py-[11px] text-[11px] text-n-500 border-b border-n-100 font-mono">{item.lot}</td>
                  <td className="px-[13px] py-[11px] text-[12.5px] text-n-700 border-b border-n-100">{item.qty}</td>
                  <td className="px-[13px] py-[11px] text-[12.5px] text-n-700 border-b border-n-100 whitespace-nowrap">{item.exp}</td>
                  <td className="px-[13px] py-[11px] text-[12.5px] text-n-700 border-b border-n-100">{item.temp}</td>
                  <td className="px-[13px] py-[11px] border-b border-n-100">
                    <span className={`inline-flex items-center px-[9px] py-[3px] rounded-full text-[10.5px] font-semibold ${item.statusCls}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-[13px] py-[11px] border-b border-n-100">
                    <button className="text-p-500 text-[12px] font-semibold hover:text-p-400 transition-colors">จัดส่ง</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

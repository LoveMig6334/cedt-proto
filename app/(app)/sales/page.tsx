import type { Metadata } from 'next';
import { AnimatedButton } from '@/components/motion/AnimatedButton';

export const metadata: Metadata = { title: 'ขาย & จัดส่ง | FreshPro' };

const orders = [
  { id: 'ORD-882', customer: 'Makro ลาดพร้าว', items: 'สันใน Wagyu 20 กก.', total: '฿42,000', delivery: '10 มี.ค. 14:00', status: 'กำลังจัดส่ง', statusCls: 'bg-[#D1FAE5] text-[#059669]' },
  { id: 'ORD-881', customer: 'Villa Market', items: 'สันนอก + ซี่โครง 35 กก.', total: '฿28,500', delivery: '10 มี.ค. 16:30', status: 'รอจัดส่ง', statusCls: 'bg-[#FEF3C7] text-[#D97706]' },
  { id: 'ORD-880', customer: 'Tops Supermarket', items: 'เนื้อสับ 30 กก.', total: '฿19,800', delivery: '11 มี.ค. 09:00', status: 'วางแผน', statusCls: 'bg-[#DBEAFE] text-[#2563EB]' },
  { id: 'ORD-879', customer: 'The Mall Group', items: 'สันใน + สันนอก 60 กก.', total: '฿86,400', delivery: '9 มี.ค. 10:00', status: 'ส่งแล้ว', statusCls: 'bg-n-100 text-n-500' },
  { id: 'ORD-878', customer: 'Foodland', items: 'Wagyu เกรด A 15 กก.', total: '฿32,000', delivery: '8 มี.ค. 13:00', status: 'ส่งแล้ว', statusCls: 'bg-n-100 text-n-500' },
];

const salesChart = [62, 78, 55, 90, 72, 84, 68, 95, 80, 74, 88, 100];
const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

export default function SalesPage() {
  return (
    <div>
      <div className="flex justify-between items-start mb-[22px]">
        <div>
          <div className="text-[20px] font-extrabold text-n-900 mb-[3px]">🚚 ขาย & จัดส่ง</div>
          <div className="text-[12.5px] text-n-500">จัดการออร์เดอร์และติดตามสถานะการจัดส่งแบบ Real-time</div>
        </div>
        <div className="flex gap-2">
          <button className="bg-white text-n-800 border-[1.5px] border-n-200 rounded-[9px] px-5 py-[9px] text-[13px] font-semibold hover:border-p-300 hover:text-p-500 transition-all">
            📥 Export
          </button>
          <AnimatedButton>
            <button className="bg-gradient-to-br from-p-400 to-p-500 text-white rounded-[9px] px-5 py-[10px] text-[13px] font-semibold shadow-[0_4px_20px_rgba(244,114,182,.25)]">
              + สร้างออร์เดอร์
            </button>
          </AnimatedButton>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-[15px] mb-5">
        {[
          { icon: '💰', v: '฿2.8M', l: 'ยอดขายเดือนนี้', chg: '↓ -2.1%', up: false },
          { icon: '📋', v: '47', l: 'ออร์เดอร์ทั้งหมด', chg: '↑ +12', up: true },
          { icon: '🚚', v: '3', l: 'จัดส่งวันนี้', chg: '1 กำลังส่ง', up: true },
          { icon: '⭐', v: '4.8/5', l: 'ความพึงพอใจ', chg: '↑ +0.2', up: true },
        ].map((k) => (
          <div key={k.l} className="bg-white rounded-rlg border border-p-100 p-4 relative overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,.04)]">
            <div className="absolute -top-2 -right-2 w-16 h-16 bg-p-50 rounded-full" />
            <div className="text-[20px] mb-[9px]">{k.icon}</div>
            <div className="text-[23px] font-extrabold text-n-900 mb-0.5">{k.v}</div>
            <div className="text-[11px] text-n-500">{k.l}</div>
            <div className={`inline-flex items-center text-[10.5px] font-semibold mt-1.5 px-2 py-[2px] rounded-full ${k.up ? 'bg-[#D1FAE5] text-[#059669]' : 'bg-[#FEE2E2] text-[#DC2626]'}`}>
              {k.chg}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-[1fr_280px] gap-[18px]">
        {/* Orders table */}
        <div className="bg-white rounded-rlg border border-p-100 shadow-[0_1px_3px_rgba(0,0,0,.04)]">
          <div className="px-5 pt-4 pb-[13px] border-b border-n-100 flex items-center justify-between">
            <div className="text-[13.5px] font-bold text-n-900">รายการออร์เดอร์</div>
            <div className="flex items-center gap-2 bg-n-100 p-[3px] rounded-[10px]">
              {['ทั้งหมด', 'วันนี้', 'รอส่ง'].map((t, i) => (
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
                  {['ออร์เดอร์', 'ลูกค้า', 'รายการ', 'ยอดรวม', 'กำหนดส่ง', 'สถานะ'].map((h) => (
                    <th key={h} className="bg-cream text-n-500 text-[10px] font-bold uppercase tracking-[.5px] px-[13px] py-[10px] text-left border-b border-n-100 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="hover:[&>td]:bg-p-50">
                    <td className="px-[13px] py-[11px] text-[11px] text-n-400 border-b border-n-100 font-mono">{o.id}</td>
                    <td className="px-[13px] py-[11px] text-[12.5px] text-n-900 border-b border-n-100 font-semibold">{o.customer}</td>
                    <td className="px-[13px] py-[11px] text-[12.5px] text-n-700 border-b border-n-100">{o.items}</td>
                    <td className="px-[13px] py-[11px] text-[12.5px] text-n-900 border-b border-n-100 font-bold">{o.total}</td>
                    <td className="px-[13px] py-[11px] text-[12.5px] text-n-700 border-b border-n-100 whitespace-nowrap">{o.delivery}</td>
                    <td className="px-[13px] py-[11px] border-b border-n-100">
                      <span className={`inline-flex items-center px-[9px] py-[3px] rounded-full text-[10.5px] font-semibold ${o.statusCls}`}>
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Monthly chart */}
        <div className="bg-white rounded-rlg border border-p-100 shadow-[0_1px_3px_rgba(0,0,0,.04)]">
          <div className="px-5 pt-4 pb-[13px] border-b border-n-100">
            <div className="text-[13.5px] font-bold text-n-900">📈 ยอดขายรายเดือน</div>
            <div className="text-[11px] text-n-500 mt-0.5">ปี 2568</div>
          </div>
          <div className="p-4">
            <div className="flex items-end gap-1 h-[120px] mb-3">
              {salesChart.map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-[3px] h-full justify-end">
                  <div
                    className={`w-full rounded-[3px_3px_0_0] ${i === 2 ? 'bg-p-500' : 'bg-gradient-to-t from-p-400 to-p-200'} min-h-[3px]`}
                    style={{ height: `${h}%` }}
                  />
                  <div className="text-[7px] text-n-400 whitespace-nowrap">{months[i]}</div>
                </div>
              ))}
            </div>
            <div className="h-px bg-n-100 my-3" />
            <div className="space-y-2">
              {[
                { label: 'สูงสุด (ธ.ค.)', val: '฿3.4M', cls: 'text-fp-green' },
                { label: 'เดือนนี้ (มี.ค.)', val: '฿2.8M', cls: 'text-p-500' },
                { label: 'เฉลี่ย/เดือน', val: '฿2.6M', cls: 'text-n-700' },
              ].map((s) => (
                <div key={s.label} className="flex justify-between items-center">
                  <span className="text-[11px] text-n-500">{s.label}</span>
                  <span className={`text-[13px] font-bold ${s.cls}`}>{s.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Mock data for the reports
 */
const reportData = {
  week: {
    title: 'รายงานรายสัปดาห์ (1-7 มี.ค. 2026)',
    kpis: [
      { label: 'รับเข้าทั้งหมด', value: '168 ตัว', sub: 'วัวเนื้อพันธุ์ผสม', trend: '+12% จากสัปดาห์ที่แล้ว', up: true },
      { label: 'ยอดขายผลิต', value: '฿1.24M', sub: 'เนื้อบรรจุกล่อง', trend: '+5.4% จากสัปดาห์ที่แล้ว', up: true },
      { label: 'อัตราผ่าน QC', value: '96.8%', sub: 'เกรด A / B+', trend: '-1.2% จากสัปดาห์ที่แล้ว', up: false },
      { label: 'สต็อกคงเหลือ', value: '3,450 กก.', sub: 'ในคลังความเย็น', trend: 'กำลังพอดี', up: true },
    ],
    chartData: [
      { h: 42, label: 'จ.' },
      { h: 68, label: 'อ.' },
      { h: 52, label: 'พ.' },
      { h: 84, label: 'พฤ.' },
      { h: 76, label: 'ศ.' },
      { h: 32, label: 'ส.' },
      { h: 25, label: 'อา.' },
    ],
    categories: [
      { name: 'สันนอก / ซี่โครง', value: '450 กก.', pct: 35, color: 'bg-p-400' },
      { name: 'สันใน / สเต็ก', value: '280 กก.', pct: 22, color: 'bg-p-300' },
      { name: 'เนื้อบด / เศษเนื้อ', value: '550 กก.', pct: 43, color: 'bg-p-100' },
    ]
  },
  month: {
    title: 'รายงานรายเดือน (มีนาคม 2026)',
    kpis: [
      { label: 'รับเข้าทั้งหมด', value: '742 ตัว', sub: 'ยอดสะสมเดือนนี้', trend: '+8% จากเดือนที่แล้ว', up: true },
      { label: 'ยอดขายผลิต', value: '฿4.82M', sub: 'ยอดสะสมเดือนนี้', trend: '+12.5% จากเดือนที่แล้ว', up: true },
      { label: 'อัตราผ่าน QC', value: '95.2%', sub: 'เฉลี่ยรายเดือน', trend: '+2.1% จากเดือนที่แล้ว', up: true },
      { label: 'สต็อกคงเหลือ', value: '2,120 กก.', sub: 'ในคลังความเย็น', trend: 'ลดลง (ขายดี)', up: true },
    ],
    chartData: [
      { h: 35, label: 'สัปดาห์ 1' },
      { h: 55, label: 'สัปดาห์ 2' },
      { h: 40, label: 'สัปดาห์ 3' },
      { h: 90, label: 'สัปดาห์ 4' },
    ],
    categories: [
      { name: 'สันนอก / ซี่โครง', value: '1,850 กก.', pct: 38, color: 'bg-p-400' },
      { name: 'สันใน / สเต็ก', value: '1,100 กก.', pct: 23, color: 'bg-p-300' },
      { name: 'เนื้อบด / เศษเนื้อ', value: '1,870 กก.', pct: 39, color: 'bg-p-100' },
    ]
  },
  year: {
    title: 'รายงานรายปี (2026 Summary)',
    kpis: [
      { label: 'รับเข้าสะสม', value: '12,450 ตัว', sub: 'YTD Performance', trend: '+15% จากปีที่แล้ว', up: true },
      { label: 'ยอดขายสะสม', value: '฿68.4M', sub: 'Revenue YTD', trend: '+18.2% จากปีที่แล้ว', up: true },
      { label: 'อัตราผ่าน QC', value: '94.8%', sub: 'เฉลี่ยรายปี', trend: '+0.4% จากปีที่แล้ว', up: true },
      { label: 'สต็อกคงเหลือ', value: 'ข้ามปี', sub: 'Inventory Health', trend: 'เสถียร', up: true },
    ],
    chartData: [
      { h: 40, label: 'ม.ค.' },
      { h: 45, label: 'ก.พ.' },
      { h: 55, label: 'มี.ค.' },
      { h: 50, label: 'เม.ย.' },
      { h: 65, label: 'พ.ค.' },
      { h: 80, label: 'มิ.ย.' },
      { h: 70, label: 'ก.ค.' },
      { h: 60, label: 'ส.ค.' },
      { h: 75, label: 'ก.ย.' },
      { h: 85, label: 'ต.ค.' },
      { h: 90, label: 'พ.ย.' },
      { h: 95, label: 'ธ.ค.' },
    ],
    categories: [
      { name: 'สันนอก / ซี่โครง', value: '22,400 กก.', pct: 40, color: 'bg-p-400' },
      { name: 'สันใน / สเต็ก', value: '11,200 กก.', pct: 20, color: 'bg-p-300' },
      { name: 'เนื้อบด / เศษเนื้อ', value: '22,400 กก.', pct: 40, color: 'bg-p-100' },
    ]
  }
};

export default function ReportsPage() {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');
  const data = reportData[period];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Header */}
      <div className="flex justify-between items-end mb-7">
        <div>
          <h1 className="text-[26px] font-extrabold text-n-900 tracking-tight leading-none mb-2">
            รายงานและสรุปผล
          </h1>
          <p className="text-[13.5px] text-n-500">วิเคราะห์ข้อมูลประสิทธิภาพของโรงงานแบบเจาะลึก</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-n-100 p-1 rounded-rlg flex gap-1">
            {(['week', 'month', 'year'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-5 py-2 text-[12.5px] font-bold rounded-r transition-all ${
                  period === p 
                    ? 'bg-white text-p-500 shadow-sm' 
                    : 'text-n-500 hover:text-n-800'
                }`}
              >
                {p === 'week' ? 'สัปดาห์' : p === 'month' ? 'เดือน' : 'ปี'}
              </button>
            ))}
          </div>
          
          <button className="bg-n-900 text-white px-5 py-2.5 rounded-rlg text-[12.5px] font-bold flex items-center gap-2 hover:bg-n-800 transition-all shadow-lg shadow-n-900/10">
            <span>📥</span> Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-[18px] mb-6">
        {data.kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            className="bg-white border border-p-100 p-5 rounded-rlg relative overflow-hidden hover:border-p-300 hover:shadow-xl hover:shadow-p-500/5"
            whileHover="hover"
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <motion.div
              className={`absolute -top-3 -right-3 w-16 h-16 bg-gradient-to-br ${kpi.up ? 'from-p-50 to-p-100' : 'from-n-50 to-n-100'}`}
              variants={{ hover: { scale: 1.25 } }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            />
            <div className="relative z-10">
              <div className="text-[12px] font-bold text-n-400 mb-1 uppercase tracking-wider">{kpi.label}</div>
              <div className="text-[28px] font-extrabold text-n-900 mb-0.5 tracking-tight">{kpi.value}</div>
              <div className="text-[11px] text-n-500 mb-3">{kpi.sub}</div>
              <div className={`text-[11px] font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 ${
                kpi.up ? 'bg-fp-green/10 text-fp-green' : 'bg-fp-red/10 text-fp-red'
              }`}>
                {kpi.up ? '↑' : '↓'} {kpi.trend}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-[22px]">
        {/* Main Chart */}
        <div className="col-span-2 bg-white border border-p-100 rounded-rlg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-[17px] font-extrabold text-n-900">{data.title}</h3>
              <p className="text-[12px] text-n-500">ปริมาณการผลิตเนื้อสะสม (กก.)</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-p-500" />
                <span className="text-[11px] font-bold text-n-600">Actual</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-n-200" />
                <span className="text-[11px] font-bold text-n-600">Target</span>
              </div>
            </div>
          </div>

          <div className="flex items-end gap-3 h-[240px] px-2 mb-4">
            {data.chartData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                {/* Tooltip on hover */}
                <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-n-900 text-white text-[10px] px-2 py-1.5 rounded-md pointer-events-none mb-2 z-20 whitespace-nowrap shadow-xl">
                    Value: {Math.round(d.h * 150)} กก.
                    <div className="absolute top-full left-1/2 -ml-1 border-4 border-transparent border-t-n-900" />
                </div>
                
                <div 
                  className="w-full bg-n-50 rounded-t-[6px] relative overflow-hidden transition-all duration-700 ease-out group-hover:brightness-95"
                  style={{ height: '90%' }}
                >
                    <div 
                        className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-p-500 to-p-300 rounded-t-[6px] transition-all duration-1000 ease-out"
                        style={{ height: `${d.h}%` }}
                    />
                </div>
                <div className="mt-4 text-[11px] font-bold text-n-400 group-hover:text-p-500 transition-colors uppercase">{d.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Side Stats */}
        <div className="flex flex-col gap-[22px]">
          {/* Breakdown Card */}
          <div className="bg-white border border-p-100 rounded-rlg p-6 shadow-sm flex-1">
            <h3 className="text-[16px] font-extrabold text-n-900 mb-5">สัดส่วนตามประเภท</h3>
            <div className="space-y-6">
              {data.categories.map((cat) => (
                <div key={cat.name}>
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <div className="text-[13px] font-bold text-n-800">{cat.name}</div>
                      <div className="text-[11px] text-n-400">{cat.value}</div>
                    </div>
                    <div className="text-[14px] font-extrabold text-p-500">{cat.pct}%</div>
                  </div>
                  <div className="h-2.5 bg-n-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${cat.color}`}
                      style={{ width: `${cat.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-n-100">
              <div className="flex items-center gap-3 p-4 bg-cream rounded-r border border-p-50">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-xl shadow-sm">
                  ✨
                </div>
                <div>
                  <div className="text-[12px] font-bold text-n-800">สรุปความเห็น AI</div>
                  <div className="text-[10.5px] text-n-500 leading-tight">สัปดาห์นี้สันนอกขายดีกว่าปกติ 15% แนะนำให้เพิ่มการผลิตสายนี้</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Table section placeholder */}
      <div className="mt-6 bg-white border border-p-100 rounded-rlg overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-n-100 flex justify-between items-center">
            <h3 className="text-[15px] font-extrabold text-n-900">รายการล่าสุดในรอบ{period === 'week' ? 'สัปดาห์' : period === 'month' ? 'เดือน' : 'ปี'}</h3>
            <button className="text-p-500 text-[12px] font-bold hover:underline">ดูทั้งหมด</button>
        </div>
        <div className="p-0">
            <table className="w-full text-left">
                <thead className="bg-n-50 text-[11px] font-bold text-n-500 uppercase tracking-wider">
                    <tr>
                        <th className="px-6 py-3">วันที่ / ล็อต</th>
                        <th className="px-6 py-3">ประเภท</th>
                        <th className="px-6 py-3">ปริมาณ</th>
                        <th className="px-6 py-3">มูลค่า</th>
                        <th className="px-6 py-3">สถานะ QC</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-n-100">
                    {[
                        { id: '#LP-250311-01', date: 'วันนี้', type: 'สันนอกพรีเมียม', qty: '120 กก.', val: '฿42,000', qc: 'Grade A', cls: 'text-fp-green' },
                        { id: '#LP-250310-44', date: 'เมื่อวาน', type: 'ซี่โครงเนื้อวัว', qty: '85 กก.', val: '฿21,500', qc: 'Grade B', cls: 'text-p-500' },
                        { id: '#LP-250310-12', date: 'เมื่อวาน', type: 'เนื้อบดละเอียด', qty: '200 กก.', val: '฿28,000', qc: 'Grade A', cls: 'text-fp-green' },
                    ].map((row, i) => (
                        <tr key={i} className="hover:bg-cream transition-colors group cursor-pointer">
                            <td className="px-6 py-4">
                                <div className="text-[13px] font-bold text-n-900">{row.date}</div>
                                <div className="text-[10px] text-n-400">{row.id}</div>
                            </td>
                            <td className="px-6 py-4 text-[12.5px] text-n-700">{row.type}</td>
                            <td className="px-6 py-4 text-[12.5px] text-n-700 font-medium">{row.qty}</td>
                            <td className="px-6 py-4 text-[13px] font-extrabold text-n-900">{row.val}</td>
                            <td className="px-6 py-4">
                                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full bg-n-100 ${row.cls}`}>
                                    {row.qc}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </motion.div>
  );
}

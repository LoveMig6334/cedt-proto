import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'ตรวจสอบคุณภาพ | FreshPro' };

const qcResults = [
  { id: 'QC-2025-0441', lot: 'LP-0441', product: 'สันใน Wagyu', grade: 'A', score: 97.4, status: 'ผ่าน', statusCls: 'bg-[#D1FAE5] text-[#059669]', gradeCls: 'bg-gradient-to-br from-[#34D399] to-[#10B981]' },
  { id: 'QC-2025-0440', lot: 'LP-0440', product: 'สันนอก มาตรฐาน', grade: 'B', score: 84.1, status: 'ผ่าน', statusCls: 'bg-[#D1FAE5] text-[#059669]', gradeCls: 'bg-gradient-to-br from-p-300 to-p-500' },
  { id: 'QC-2025-0439', lot: 'LP-0439', product: 'เนื้อสับ รวม', grade: 'C', score: 71.8, status: 'ผ่าน (ขั้นต่ำ)', statusCls: 'bg-[#FEF3C7] text-[#D97706]', gradeCls: 'bg-gradient-to-br from-[#FCD34D] to-[#F59E0B]' },
  { id: 'QC-2025-0438', lot: 'LP-0438', product: 'ซี่โครง Wagyu', grade: 'A', score: 95.2, status: 'ผ่าน', statusCls: 'bg-[#D1FAE5] text-[#059669]', gradeCls: 'bg-gradient-to-br from-[#34D399] to-[#10B981]' },
];

const metrics = [
  { label: 'สีของเนื้อ', value: '98.2%', pct: 98 },
  { label: 'ความชื้น', value: '94.5%', pct: 94 },
  { label: 'ความสมบูรณ์', value: '97.1%', pct: 97 },
  { label: 'ไขมันแทรก', value: '89.3%', pct: 89 },
];

export default function QCPage() {
  return (
    <div>
      <div className="flex justify-between items-start mb-[22px]">
        <div>
          <div className="text-[20px] font-extrabold text-n-900 mb-[3px]">🔬 ตรวจสอบคุณภาพ AI</div>
          <div className="text-[12.5px] text-n-500">Computer Vision วิเคราะห์คุณภาพแต่ละล็อตด้วยความแม่นยำ 98.5%</div>
        </div>
        <button className="bg-gradient-to-br from-p-400 to-p-500 text-white rounded-[9px] px-5 py-[10px] text-[13px] font-semibold shadow-[0_4px_20px_rgba(244,114,182,.25)] hover:-translate-y-0.5 transition-all">
          + สแกนล็อตใหม่
        </button>
      </div>

      <div className="grid grid-cols-[1fr_300px] gap-[18px]">
        {/* QC table */}
        <div>
          {/* Scanner widget */}
          <div className="bg-n-900 rounded-r p-[26px] text-center relative overflow-hidden mb-4"
            style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 26px,rgba(244,114,182,.035) 26px,rgba(244,114,182,.035) 27px)' }}>
            <div className="w-[130px] h-[130px] mx-auto mb-3 relative z-10">
              <div className="absolute top-0 left-0 w-[26px] h-[26px] border-t-2 border-l-2 border-p-400 rounded-[4px_0_0_0]" />
              <div className="absolute bottom-0 right-0 w-[26px] h-[26px] border-b-2 border-r-2 border-p-400 rounded-[0_0_4px_0]" />
              <div className="w-full h-full flex items-center justify-center text-[42px] bg-[rgba(244,114,182,.04)] rounded-[8px] relative overflow-hidden">
                🥩
                <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-p-400 to-transparent animate-scan-line" />
              </div>
            </div>
            <div className="text-white text-[13px] font-semibold relative z-10 mb-1">AI กำลังสแกน...</div>
            <div className="text-white/40 text-[11px] relative z-10">ล็อต #LP-2025-0442 — สายผลิต A</div>
          </div>

          {/* Results table */}
          <div className="bg-white rounded-rlg border border-p-100 shadow-[0_1px_3px_rgba(0,0,0,.04)]">
            <div className="px-5 pt-4 pb-[13px] border-b border-n-100">
              <div className="text-[13.5px] font-bold text-n-900">ผลตรวจล่าสุด</div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    {['ล็อต', 'สินค้า', 'เกรด', 'คะแนน', 'สถานะ'].map((h) => (
                      <th key={h} className="bg-cream text-n-500 text-[10px] font-bold uppercase tracking-[.5px] px-[13px] py-[10px] text-left border-b border-n-100 whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {qcResults.map((r) => (
                    <tr key={r.id} className="hover:[&>td]:bg-p-50">
                      <td className="px-[13px] py-[11px] text-[11px] text-n-700 border-b border-n-100 font-mono">{r.lot}</td>
                      <td className="px-[13px] py-[11px] text-[12.5px] text-n-700 border-b border-n-100 font-semibold">{r.product}</td>
                      <td className="px-[13px] py-[11px] border-b border-n-100">
                        <div className={`w-8 h-8 rounded-full ${r.gradeCls} flex items-center justify-center text-white font-extrabold text-[14px]`}>
                          {r.grade}
                        </div>
                      </td>
                      <td className="px-[13px] py-[11px] text-[12.5px] text-n-700 border-b border-n-100 font-semibold">{r.score}%</td>
                      <td className="px-[13px] py-[11px] border-b border-n-100">
                        <span className={`inline-flex items-center px-[9px] py-[3px] rounded-full text-[10.5px] font-semibold ${r.statusCls}`}>
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* AI metrics */}
        <div className="bg-white rounded-rlg border border-p-100 shadow-[0_1px_3px_rgba(0,0,0,.04)]">
          <div className="px-5 pt-4 pb-[13px] border-b border-n-100">
            <div className="text-[13.5px] font-bold text-n-900">🤖 ตัวชี้วัด AI</div>
            <div className="text-[11px] text-n-500 mt-0.5">ล็อต LP-0441 — วิเคราะห์แล้ว</div>
          </div>
          <div className="p-4 space-y-4">
            <div className="w-[84px] h-[84px] rounded-full bg-gradient-to-br from-[#34D399] to-[#10B981] flex flex-col items-center justify-center mx-auto mb-5">
              <div className="text-[28px] font-extrabold text-white leading-none">A</div>
              <div className="text-[10px] text-white/80">97.4%</div>
            </div>
            {metrics.map((m) => (
              <div key={m.label}>
                <div className="flex justify-between items-center mb-[6px]">
                  <span className="text-[12px] text-n-600">{m.label}</span>
                  <span className="text-[12px] font-semibold text-n-900">{m.value}</span>
                </div>
                <div className="h-[6px] bg-n-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-p-300 to-p-500" style={{ width: `${m.pct}%` }} />
                </div>
              </div>
            ))}
            <div className="h-px bg-n-100 my-2" />
            <button className="w-full py-2.5 bg-gradient-to-br from-p-400 to-p-500 text-white rounded-r text-[13px] font-bold shadow-[0_4px_20px_rgba(244,114,182,.25)] hover:-translate-y-0.5 transition-all">
              อนุมัติล็อตนี้
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

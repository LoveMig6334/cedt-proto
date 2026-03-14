"use client";

import Link from "next/link";
import { Fragment, useState } from "react";
import type { QCGrade, QCScanSession } from "../QCClient";
import { MOCK_SESSIONS_FOR_HISTORY } from "../QCClient";

type Period = "รายวัน" | "รายสัปดาห์" | "รายเดือน" | "รายปี";

const PERIODS: Period[] = ["รายวัน", "รายสัปดาห์", "รายเดือน", "รายปี"];

function filterByPeriod(sessions: QCScanSession[], period: Period): QCScanSession[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return sessions.filter((s) => {
    const d = new Date(s.isoDate);
    d.setHours(0, 0, 0, 0);

    switch (period) {
      case "รายวัน":
        return s.isoDate === today.toISOString().split("T")[0];
      case "รายสัปดาห์": {
        const dow = today.getDay();
        const mon = new Date(today);
        mon.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1));
        const sun = new Date(mon);
        sun.setDate(mon.getDate() + 6);
        return d >= mon && d <= sun;
      }
      case "รายเดือน":
        return (
          d.getFullYear() === today.getFullYear() &&
          d.getMonth() === today.getMonth()
        );
      case "รายปี":
        return d.getFullYear() === today.getFullYear();
    }
  });
}

function loadFromStorage(): QCScanSession[] {
  try {
    const raw = localStorage.getItem("qc_records");
    if (!raw) return MOCK_SESSIONS_FOR_HISTORY;
    const saved: QCScanSession[] = JSON.parse(raw);
    const mockFiltered = MOCK_SESSIONS_FOR_HISTORY.filter(
      (m) => !saved.some((s) => s.id === m.id),
    );
    return [...saved, ...mockFiltered];
  } catch {
    return MOCK_SESSIONS_FOR_HISTORY;
  }
}

function gradeBgClass(grade: QCGrade): string {
  switch (grade) {
    case "A": return "bg-linear-to-br from-[#34D399] to-fp-green";
    case "B": return "bg-linear-to-br from-p-300 to-p-500";
    case "C": return "bg-linear-to-br from-[#FCD34D] to-[#F59E0B]";
    case "D": return "bg-linear-to-br from-[#FCA5A5] to-fp-red";
  }
}

export function QCHistoryClient() {
  const [sessions] = useState<QCScanSession[]>(() => loadFromStorage());
  const [period, setPeriod] = useState<Period>("รายเดือน");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = filterByPeriod(sessions, period);

  const totalLots = filtered.length;
  const totalPassed = filtered.reduce((sum, s) => sum + s.passedPieces, 0);
  const totalPieces = filtered.reduce((sum, s) => sum + s.totalPieces, 0);
  const gradeACount = filtered.filter((s) => s.overallGrade === "A").length;
  const passRate = totalPieces > 0 ? Math.round((totalPassed / totalPieces) * 100) : 0;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-5.5">
        <Link
          href="/qc"
          className="flex items-center gap-1.5 text-[13px] text-n-500 hover:text-p-500 font-semibold transition-colors"
        >
          ← กลับ
        </Link>
        <div>
          <div className="text-[20px] font-extrabold text-n-900 mb-0.75">
            📋 ประวัติตรวจสอบคุณภาพ
          </div>
          <div className="text-[12.5px] text-n-500">
            ข้อมูลย้อนหลังของทุกล็อตที่ผ่านการตรวจสอบ
          </div>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-4 gap-3.5 mb-5.5">
        {[
          { label: "ล็อตทั้งหมด", value: totalLots, icon: "🔬", color: "text-p-500" },
          { label: "ชิ้นผ่านทั้งหมด", value: totalPassed, icon: "✅", color: "text-fp-green" },
          { label: "ล็อตเกรด A", value: gradeACount, icon: "🏆", color: "text-[#059669]" },
          { label: "อัตราผ่าน", value: `${passRate}%`, icon: "📊", color: "text-fp-blue" },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="bg-white rounded-rlg border border-p-100 shadow-[0_1px_3px_rgba(0,0,0,.04)] px-5 py-4"
          >
            <div className="text-[20px] mb-1">{kpi.icon}</div>
            <div className={`text-[22px] font-extrabold ${kpi.color}`}>{kpi.value}</div>
            <div className="text-[11.5px] text-n-500 mt-0.5">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Session table with period filter */}
      <div className="bg-white rounded-rlg border border-p-100 shadow-[0_1px_3px_rgba(0,0,0,.04)]">
        <div className="px-5 pt-4 pb-3.25 border-b border-n-100 flex items-center justify-between">
          <div className="text-[13.5px] font-bold text-n-900">ประวัติล็อต</div>
          <div className="flex items-center gap-2 bg-n-100 p-0.75 rounded-[10px]">
            {PERIODS.map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded-lg font-sans text-[12.5px] font-medium transition-all ${
                  period === p
                    ? "bg-white text-n-900 font-bold shadow-[0_1px_3px_rgba(0,0,0,.07)]"
                    : "text-n-500 hover:text-n-700"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {["วันที่", "ล็อต ID", "สินค้า", "ชิ้น", "ผ่าน", "เฉลี่ยคะแนน", "เกรดรวม", ""].map((h) => (
                  <th
                    key={h}
                    className="bg-cream text-n-500 text-[10px] font-bold uppercase tracking-[.5px] px-3.25 py-2.5 text-left border-b border-n-100 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-3.25 py-10 text-center text-[12.5px] text-n-400">
                    ไม่มีข้อมูลในช่วงเวลานี้
                  </td>
                </tr>
              ) : (
                filtered.map((s) => {
                  const isExpanded = expandedId === s.id;
                  return (
                    <Fragment key={s.id}>
                      <tr className="hover:[&>td]:bg-p-50">
                        <td className="px-3.25 py-2.75 text-[12px] text-n-600 border-b border-n-100 whitespace-nowrap">
                          {s.scannedAt}
                        </td>
                        <td className="px-3.25 py-2.75 text-[11px] text-n-700 border-b border-n-100 font-mono">
                          {s.lotId}
                        </td>
                        <td className="px-3.25 py-2.75 text-[12.5px] text-n-700 border-b border-n-100 font-semibold">
                          {s.productName}
                        </td>
                        <td className="px-3.25 py-2.75 text-[12.5px] text-n-700 border-b border-n-100">
                          {s.totalPieces}
                        </td>
                        <td className="px-3.25 py-2.75 text-[12.5px] text-n-700 border-b border-n-100">
                          {s.passedPieces}
                        </td>
                        <td className="px-3.25 py-2.75 text-[12.5px] text-n-700 border-b border-n-100 font-semibold">
                          {s.avgScore}%
                        </td>
                        <td className="px-3.25 py-2.75 border-b border-n-100">
                          <div
                            className={`w-8 h-8 rounded-full ${gradeBgClass(s.overallGrade)} flex items-center justify-center text-white font-extrabold text-[14px]`}
                          >
                            {s.overallGrade}
                          </div>
                        </td>
                        <td className="px-3.25 py-2.75 border-b border-n-100">
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : s.id)}
                            className="text-[11px] text-p-500 hover:text-p-400 font-semibold transition-colors whitespace-nowrap"
                          >
                            {isExpanded ? "ซ่อน ▲" : "ดูรายละเอียด ▼"}
                          </button>
                        </td>
                      </tr>

                      {/* Expanded sub-table */}
                      {isExpanded && (
                        <tr key={`${s.id}-expanded`}>
                          <td colSpan={8} className="px-0 py-0 bg-p-50/40 border-b border-n-100">
                            <div className="px-8 py-3">
                              <div className="text-[11px] font-bold text-n-500 uppercase tracking-[.5px] mb-2">
                                รายละเอียดชิ้น — {s.lineName}
                              </div>
                              <table className="w-full border-collapse">
                                <thead>
                                  <tr>
                                    {["ชิ้นที่", "ชิ้น ID", "เกรด", "คะแนน", "สถานะ"].map((h) => (
                                      <th
                                        key={h}
                                        className="text-n-400 text-[10px] font-semibold uppercase tracking-[.3px] px-3 py-1.5 text-left border-b border-n-100"
                                      >
                                        {h}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {s.pieces.map((p, idx) => (
                                    <tr key={p.pieceId} className="hover:[&>td]:bg-white">
                                      <td className="px-3 py-2 text-[12px] text-n-500 border-b border-n-100/60">
                                        {idx + 1}
                                      </td>
                                      <td className="px-3 py-2 text-[11px] text-n-600 border-b border-n-100/60 font-mono">
                                        {p.pieceId}
                                      </td>
                                      <td className="px-3 py-2 border-b border-n-100/60">
                                        <div
                                          className={`w-7 h-7 rounded-full ${p.gradeCls} flex items-center justify-center text-white font-extrabold text-[12px]`}
                                        >
                                          {p.grade}
                                        </div>
                                      </td>
                                      <td className="px-3 py-2 text-[12px] text-n-700 border-b border-n-100/60 font-semibold">
                                        {p.score}%
                                      </td>
                                      <td className="px-3 py-2 border-b border-n-100/60">
                                        <span
                                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${p.statusCls}`}
                                        >
                                          {p.status}
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

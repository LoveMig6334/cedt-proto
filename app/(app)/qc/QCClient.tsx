"use client";

import { AnimatedButton } from "@/components/motion/AnimatedButton";
import { QCScannerWidget } from "@/components/motion/QCScannerWidget";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

// ─── Local types (mirroring ProductionClient shapes) ───────────────────────

type OutputProduct = { id: string; name: string; outputKg: number };
type ProductionLine = {
  id: string;
  name: string;
  status: string;
  outputs: OutputProduct[];
};
type LotEntry = { output: OutputProduct; line: ProductionLine };

export type QCGrade = "A" | "B" | "C" | "D";

export type QCPiece = {
  pieceId: string;
  productName: string;
  grade: QCGrade;
  score: number;
  status: "ผ่าน" | "ผ่าน (ขั้นต่ำ)" | "ไม่ผ่าน";
  statusCls: string;
  gradeCls: string;
};

export type QCScanSession = {
  id: string;
  lotId: string;
  productName: string;
  lineId: string;
  lineName: string;
  pieces: QCPiece[];
  totalPieces: number;
  passedPieces: number;
  avgScore: number;
  overallGrade: QCGrade;
  scannedAt: string;
  isoDate: string;
};

type ScanState = "idle" | "selecting" | "scanning" | "complete";

// ─── Grade helpers ──────────────────────────────────────────────────────────

function gradeFromScore(score: number): QCGrade {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 65) return "C";
  return "D";
}

function gradeStyle(grade: QCGrade): {
  gradeCls: string;
  status: QCPiece["status"];
  statusCls: string;
} {
  switch (grade) {
    case "A":
      return {
        gradeCls: "bg-linear-to-br from-[#34D399] to-fp-green",
        status: "ผ่าน",
        statusCls: "bg-[#D1FAE5] text-[#059669]",
      };
    case "B":
      return {
        gradeCls: "bg-linear-to-br from-p-300 to-p-500",
        status: "ผ่าน",
        statusCls: "bg-[#D1FAE5] text-[#059669]",
      };
    case "C":
      return {
        gradeCls: "bg-linear-to-br from-[#FCD34D] to-[#F59E0B]",
        status: "ผ่าน (ขั้นต่ำ)",
        statusCls: "bg-[#FEF3C7] text-[#D97706]",
      };
    case "D":
      return {
        gradeCls: "bg-linear-to-br from-[#FCA5A5] to-fp-red",
        status: "ไม่ผ่าน",
        statusCls: "bg-[#FEE2E2] text-[#DC2626]",
      };
  }
}

function randomScore(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 10) / 10;
}

function pickGrade(): QCGrade {
  const r = Math.random();
  if (r < 0.6) return "A";
  if (r < 0.85) return "B";
  if (r < 0.95) return "C";
  return "D";
}

function generatePieces(sessionId: string, productName: string, count: number): QCPiece[] {
  return Array.from({ length: count }, (_, idx) => {
    const grade = pickGrade();
    const scoreRange = { A: [92, 99], B: [80, 91], C: [65, 79], D: [55, 64] }[grade];
    const score = randomScore(scoreRange[0], scoreRange[1]);
    const { gradeCls, status, statusCls } = gradeStyle(grade);
    return {
      pieceId: `${sessionId}-${String(idx + 1).padStart(3, "0")}`,
      productName,
      grade,
      score,
      status,
      statusCls,
      gradeCls,
    };
  });
}

function generateSessionId(sessions: QCScanSession[]): string {
  const year = new Date().getFullYear();
  const seq = sessions.length + 1;
  return `SCAN-${year}-${String(seq).padStart(4, "0")}`;
}

function buildSession(
  sessionId: string,
  lot: LotEntry,
  pieces: QCPiece[],
): QCScanSession {
  const passedPieces = pieces.filter((p) => p.status !== "ไม่ผ่าน").length;
  const rawAvg = pieces.reduce((sum, p) => sum + p.score, 0) / pieces.length;
  const avgScore = Math.round(rawAvg * 10) / 10;
  const overallGrade = gradeFromScore(avgScore);
  const now = new Date();
  return {
    id: sessionId,
    lotId: lot.output.id,
    productName: lot.output.name,
    lineId: lot.line.id,
    lineName: lot.line.name,
    pieces,
    totalPieces: pieces.length,
    passedPieces,
    avgScore,
    overallGrade,
    scannedAt: now.toLocaleString("th-TH", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    isoDate: now.toISOString().split("T")[0],
  };
}

// ─── Mock seed data ─────────────────────────────────────────────────────────

export const MOCK_SESSIONS_FOR_HISTORY: QCScanSession[] = [
  {
    id: "SCAN-2026-0002",
    lotId: "MOCK-LP-0441",
    productName: "สันใน Wagyu",
    lineId: "MOCK-LINE-A",
    lineName: "สายผลิต A — สันใน",
    pieces: [
      { pieceId: "SCAN-2026-0002-001", productName: "สันใน Wagyu", grade: "A", score: 98.5, status: "ผ่าน", statusCls: "bg-[#D1FAE5] text-[#059669]", gradeCls: "bg-linear-to-br from-[#34D399] to-fp-green" },
      { pieceId: "SCAN-2026-0002-002", productName: "สันใน Wagyu", grade: "A", score: 97.2, status: "ผ่าน", statusCls: "bg-[#D1FAE5] text-[#059669]", gradeCls: "bg-linear-to-br from-[#34D399] to-fp-green" },
      { pieceId: "SCAN-2026-0002-003", productName: "สันใน Wagyu", grade: "A", score: 98.1, status: "ผ่าน", statusCls: "bg-[#D1FAE5] text-[#059669]", gradeCls: "bg-linear-to-br from-[#34D399] to-fp-green" },
      { pieceId: "SCAN-2026-0002-004", productName: "สันใน Wagyu", grade: "A", score: 97.8, status: "ผ่าน", statusCls: "bg-[#D1FAE5] text-[#059669]", gradeCls: "bg-linear-to-br from-[#34D399] to-fp-green" },
      { pieceId: "SCAN-2026-0002-005", productName: "สันใน Wagyu", grade: "A", score: 96.3, status: "ผ่าน", statusCls: "bg-[#D1FAE5] text-[#059669]", gradeCls: "bg-linear-to-br from-[#34D399] to-fp-green" },
      { pieceId: "SCAN-2026-0002-006", productName: "สันใน Wagyu", grade: "A", score: 97.0, status: "ผ่าน", statusCls: "bg-[#D1FAE5] text-[#059669]", gradeCls: "bg-linear-to-br from-[#34D399] to-fp-green" },
      { pieceId: "SCAN-2026-0002-007", productName: "สันใน Wagyu", grade: "A", score: 96.8, status: "ผ่าน", statusCls: "bg-[#D1FAE5] text-[#059669]", gradeCls: "bg-linear-to-br from-[#34D399] to-fp-green" },
      { pieceId: "SCAN-2026-0002-008", productName: "สันใน Wagyu", grade: "A", score: 99.0, status: "ผ่าน", statusCls: "bg-[#D1FAE5] text-[#059669]", gradeCls: "bg-linear-to-br from-[#34D399] to-fp-green" },
    ],
    totalPieces: 8,
    passedPieces: 8,
    avgScore: 97.6,
    overallGrade: "A",
    scannedAt: "12 มี.ค. 2569 14:30",
    isoDate: "2026-03-12",
  },
  {
    id: "SCAN-2026-0001",
    lotId: "MOCK-LP-0440",
    productName: "สันนอก มาตรฐาน",
    lineId: "MOCK-LINE-B",
    lineName: "สายผลิต B — สันนอก",
    pieces: [
      { pieceId: "SCAN-2026-0001-001", productName: "สันนอก มาตรฐาน", grade: "B", score: 87.2, status: "ผ่าน", statusCls: "bg-[#D1FAE5] text-[#059669]", gradeCls: "bg-linear-to-br from-p-300 to-p-500" },
      { pieceId: "SCAN-2026-0001-002", productName: "สันนอก มาตรฐาน", grade: "B", score: 83.5, status: "ผ่าน", statusCls: "bg-[#D1FAE5] text-[#059669]", gradeCls: "bg-linear-to-br from-p-300 to-p-500" },
      { pieceId: "SCAN-2026-0001-003", productName: "สันนอก มาตรฐาน", grade: "B", score: 86.0, status: "ผ่าน", statusCls: "bg-[#D1FAE5] text-[#059669]", gradeCls: "bg-linear-to-br from-p-300 to-p-500" },
      { pieceId: "SCAN-2026-0001-004", productName: "สันนอก มาตรฐาน", grade: "B", score: 82.3, status: "ผ่าน", statusCls: "bg-[#D1FAE5] text-[#059669]", gradeCls: "bg-linear-to-br from-p-300 to-p-500" },
      { pieceId: "SCAN-2026-0001-005", productName: "สันนอก มาตรฐาน", grade: "B", score: 88.7, status: "ผ่าน", statusCls: "bg-[#D1FAE5] text-[#059669]", gradeCls: "bg-linear-to-br from-p-300 to-p-500" },
      { pieceId: "SCAN-2026-0001-006", productName: "สันนอก มาตรฐาน", grade: "B", score: 80.5, status: "ผ่าน", statusCls: "bg-[#D1FAE5] text-[#059669]", gradeCls: "bg-linear-to-br from-p-300 to-p-500" },
      { pieceId: "SCAN-2026-0001-007", productName: "สันนอก มาตรฐาน", grade: "B", score: 80.7, status: "ผ่าน", statusCls: "bg-[#D1FAE5] text-[#059669]", gradeCls: "bg-linear-to-br from-p-300 to-p-500" },
    ],
    totalPieces: 7,
    passedPieces: 7,
    avgScore: 84.1,
    overallGrade: "B",
    scannedAt: "10 มี.ค. 2569 11:15",
    isoDate: "2026-03-10",
  },
];

// ─── Storage helpers ────────────────────────────────────────────────────────

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

function saveToStorage(sessions: QCScanSession[]) {
  localStorage.setItem("qc_records", JSON.stringify(sessions));
}

// ─── Display helpers ────────────────────────────────────────────────────────

function gradeBgClass(grade: QCGrade): string {
  return gradeStyle(grade).gradeCls;
}

function computeDisplayScore(pieces: QCPiece[]): number {
  if (pieces.length === 0) return 0;
  return Math.round((pieces.reduce((s, p) => s + p.score, 0) / pieces.length) * 10) / 10;
}

// ─── Component ──────────────────────────────────────────────────────────────

export function QCClient() {
  const [scanState, setScanState] = useState<ScanState>("idle");
  const [sessions, setSessions] = useState<QCScanSession[]>(() => loadFromStorage());
  const [selectedLot, setSelectedLot] = useState<LotEntry | null>(null);
  const [allPieces, setAllPieces] = useState<QCPiece[]>([]);
  const [livePieces, setLivePieces] = useState<QCPiece[]>([]);
  const [scanningPieceIdx, setScanningPieceIdx] = useState(0);
  const [totalPiecesCount, setTotalPiecesCount] = useState(0);
  const [currentSessionId, setCurrentSessionId] = useState("");
  const [selectedModalLot, setSelectedModalLot] = useState<LotEntry | null>(null);

  const scanTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      scanTimeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  // Derived: lots from completed production lines that haven't been scanned yet
  const availableLots = useMemo<LotEntry[]>(() => {
    try {
      const lines: ProductionLine[] = JSON.parse(
        localStorage.getItem("production_lines") ?? "[]",
      );
      const scannedIds = new Set(sessions.map((s) => s.lotId));
      return lines
        .filter((l) => l.status === "เสร็จสิ้น")
        .flatMap((l) => l.outputs.map((o) => ({ output: o, line: l })))
        .filter(({ output }) => !scannedIds.has(output.id));
    } catch {
      return [];
    }
  }, [sessions]);

  // ── Scan flow ─────────────────────────────────────────────────────────────

  function openSelectModal() {
    setSelectedModalLot(null);
    setScanState("selecting");
  }

  function startScan(lot: LotEntry) {
    // Clear any leftover timeouts
    scanTimeoutsRef.current.forEach(clearTimeout);
    scanTimeoutsRef.current = [];

    const pieceCount = 6 + Math.floor(Math.random() * 5); // 6–10
    const sessionId = generateSessionId(sessions);
    const pieces = generatePieces(sessionId, lot.output.name, pieceCount);

    setCurrentSessionId(sessionId);
    setSelectedLot(lot);
    setAllPieces(pieces);
    setTotalPiecesCount(pieceCount);
    setLivePieces([]);
    setScanningPieceIdx(0);
    setScanState("scanning");

    // Piece 0 is shown in widget immediately; each tick completes one piece and advances the widget
    pieces.forEach((piece, idx) => {
      const tid = setTimeout(() => {
        setLivePieces((prev) => [...prev, piece]);
        if (idx < pieces.length - 1) {
          setScanningPieceIdx(idx + 1);
        } else {
          setScanState("complete");
        }
      }, (idx + 1) * 1800);
      scanTimeoutsRef.current.push(tid);
    });
  }

  function saveSession() {
    if (!selectedLot || livePieces.length === 0) return;
    const session = buildSession(currentSessionId, selectedLot, livePieces);
    const updated = [session, ...sessions];
    setSessions(updated);
    saveToStorage(updated);
    setScanState("idle");
    setLivePieces([]);
    setAllPieces([]);
    setSelectedLot(null);
  }

  // ── Derived display values ────────────────────────────────────────────────

  const displaySession = sessions[0];
  const displayPieces = scanState === "scanning" || scanState === "complete"
    ? livePieces
    : displaySession?.pieces ?? [];

  const displayScore =
    scanState === "scanning" || scanState === "complete"
      ? computeDisplayScore(livePieces)
      : displaySession?.avgScore ?? 0;
  const displayGrade: QCGrade =
    scanState === "scanning" || scanState === "complete"
      ? gradeFromScore(displayScore)
      : displaySession?.overallGrade ?? "A";

  const colorMetricPct = Math.min(100, Math.round(displayScore * 1.008));
  const completenessMetricPct = Math.min(100, Math.round(displayScore * 0.992));

  const currentScanningPiece = allPieces[scanningPieceIdx];

  const completeSummary = scanState === "complete" ? (() => {
    const passed = livePieces.filter((p) => p.status !== "ไม่ผ่าน").length;
    const avg = computeDisplayScore(livePieces);
    return { passed, avg, grade: gradeFromScore(avg) };
  })() : null;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-start mb-5.5">
        <div>
          <div className="text-[20px] font-extrabold text-n-900 mb-0.75">
            🔬 ตรวจสอบคุณภาพ AI
          </div>
          <div className="text-[12.5px] text-n-500">
            Computer Vision วิเคราะห์คุณภาพแต่ละล็อตด้วยความแม่นยำ 98.5%
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <Link
            href="/qc/history"
            className="px-4 py-2.5 rounded-[9px] border border-p-200 text-p-500 text-[13px] font-semibold hover:bg-p-50 transition-all"
          >
            ดูประวัติ →
          </Link>
          <AnimatedButton>
            <button
              onClick={openSelectModal}
              disabled={scanState === "scanning"}
              className="bg-linear-to-br from-p-400 to-p-500 text-white rounded-[9px] px-5 py-2.5 text-[13px] font-semibold shadow-[0_4px_20px_rgba(244,114,182,.25)] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              + สแกนล็อตใหม่
            </button>
          </AnimatedButton>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_300px] gap-4.5">
        {/* Left column */}
        <div>
          {/* Scanner widget */}
          <QCScannerWidget
            pieceName={scanState === "scanning" ? currentScanningPiece?.productName : undefined}
            pieceLabel={
              scanState === "scanning"
                ? `ชิ้นที่ ${scanningPieceIdx + 1} / ${totalPiecesCount}`
                : scanState === "complete"
                ? "สแกนเสร็จสิ้น ✅"
                : "พร้อมสแกนล็อตใหม่"
            }
            lotLabel={
              selectedLot
                ? `ล็อต #${selectedLot.output.id} — ${selectedLot.line.name}`
                : "กดปุ่ม + สแกนล็อตใหม่ เพื่อเริ่มต้น"
            }
          />

          {/* Completion banner */}
          {scanState === "complete" && completeSummary && (
            <div className="mb-4 bg-green-50 border border-green-200 rounded-rlg px-5 py-3.5 flex items-center justify-between">
              <div>
                <div className="text-[13.5px] font-bold text-green-800">
                  ✅ สแกนเสร็จสิ้น — เกรดรวม {completeSummary.grade}
                </div>
                <div className="text-[12px] text-green-600 mt-0.5">
                  {livePieces.length} ชิ้น · ผ่าน {completeSummary.passed} · เฉลี่ย {completeSummary.avg}%
                </div>
              </div>
              <AnimatedButton>
                <button
                  onClick={saveSession}
                  className="px-4 py-2.5 bg-linear-to-br from-p-400 to-p-500 text-white rounded-[9px] text-[13px] font-bold shadow-[0_4px_20px_rgba(244,114,182,.2)]"
                >
                  บันทึกผล
                </button>
              </AnimatedButton>
            </div>
          )}

          {/* Results table */}
          <div className="bg-white rounded-rlg border border-p-100 shadow-[0_1px_3px_rgba(0,0,0,.04)]">
            <div className="px-5 pt-4 pb-3.25 border-b border-n-100 flex items-center justify-between">
              <div className="text-[13.5px] font-bold text-n-900">
                {scanState === "scanning" || scanState === "complete"
                  ? "ผลตรวจชิ้นปัจจุบัน"
                  : "ผลตรวจล็อตล่าสุด"}
              </div>
              {scanState === "scanning" && (
                <span className="text-[11px] text-p-500 font-semibold animate-pulse">
                  กำลังสแกน...
                </span>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    {["ชิ้น ID", "สินค้า", "เกรด", "คะแนน", "สถานะ"].map((h) => (
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
                  {displayPieces.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-3.25 py-10 text-center text-[12.5px] text-n-400">
                        {scanState === "scanning" ? "กำลังรอผลการสแกน..." : "ยังไม่มีข้อมูลการตรวจ"}
                      </td>
                    </tr>
                  ) : (
                    displayPieces.map((p) => (
                      <tr key={p.pieceId} className="hover:[&>td]:bg-p-50">
                        <td className="px-3.25 py-2.75 text-[11px] text-n-700 border-b border-n-100 font-mono">
                          {p.pieceId}
                        </td>
                        <td className="px-3.25 py-2.75 text-[12.5px] text-n-700 border-b border-n-100 font-semibold">
                          {p.productName}
                        </td>
                        <td className="px-3.25 py-2.75 border-b border-n-100">
                          <div
                            className={`w-8 h-8 rounded-full ${p.gradeCls} flex items-center justify-center text-white font-extrabold text-[14px]`}
                          >
                            {p.grade}
                          </div>
                        </td>
                        <td className="px-3.25 py-2.75 text-[12.5px] text-n-700 border-b border-n-100 font-semibold">
                          {p.score}%
                        </td>
                        <td className="px-3.25 py-2.75 border-b border-n-100">
                          <span
                            className={`inline-flex items-center px-2.25 py-0.75 rounded-full text-[10.5px] font-semibold ${p.statusCls}`}
                          >
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right column — AI metrics */}
        <div className="bg-white rounded-rlg border border-p-100 shadow-[0_1px_3px_rgba(0,0,0,.04)]">
          <div className="px-5 pt-4 pb-3.25 border-b border-n-100">
            <div className="text-[13.5px] font-bold text-n-900">🤖 ตัวชี้วัด AI</div>
            <div className="text-[11px] text-n-500 mt-0.5">
              {scanState === "scanning"
                ? "กำลังวิเคราะห์..."
                : scanState === "complete" && selectedLot
                ? `ล็อต #${selectedLot.output.id} — วิเคราะห์แล้ว`
                : displaySession
                ? `ล็อต #${displaySession.lotId} — วิเคราะห์แล้ว`
                : "ยังไม่มีข้อมูล"}
            </div>
          </div>
          <div className="p-4 space-y-4">
            {/* Grade circle */}
            <div
              className={`w-21 h-21 rounded-full ${gradeBgClass(displayGrade)} flex flex-col items-center justify-center mx-auto mb-5`}
            >
              <div className="text-[28px] font-extrabold text-white leading-none">
                {displayScore > 0 ? displayGrade : "—"}
              </div>
              <div className="text-[10px] text-white/80">
                {displayScore > 0 ? `${displayScore}%` : ""}
              </div>
            </div>

            {/* Metrics — ความชื้น and ไขมันแทรก removed */}
            {[
              { label: "สีของเนื้อ", pct: colorMetricPct },
              { label: "ความสมบูรณ์", pct: completenessMetricPct },
            ].map((m) => (
              <div key={m.label}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[12px] text-n-600">{m.label}</span>
                  <span className="text-[12px] font-semibold text-n-900">
                    {displayScore > 0 ? `${m.pct}%` : "—"}
                  </span>
                </div>
                <div className="h-1.5 bg-n-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-p-300 to-p-500 transition-all duration-500"
                    style={{ width: displayScore > 0 ? `${m.pct}%` : "0%" }}
                  />
                </div>
              </div>
            ))}

            <div className="h-px bg-n-100 my-2" />
            <AnimatedButton className="w-full rounded-r">
              <button
                disabled={scanState !== "idle"}
                className="w-full py-2.5 bg-linear-to-br from-p-400 to-p-500 text-white rounded-r text-[13px] font-bold shadow-[0_4px_20px_rgba(244,114,182,.25)] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                อนุมัติล็อตนี้
              </button>
            </AnimatedButton>
          </div>
        </div>
      </div>

      {/* Lot selection modal */}
      {scanState === "selecting" && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setScanState("idle");
          }}
        >
          <div className="bg-white rounded-rlg p-6 w-[480px] shadow-2xl max-h-[80vh] flex flex-col">
            <div className="flex items-center gap-3 mb-5 shrink-0">
              <div className="w-10 h-10 bg-p-50 rounded-xl flex items-center justify-center text-xl">
                🔬
              </div>
              <div>
                <div className="text-[14px] font-extrabold text-n-900">
                  เลือกล็อตที่ต้องการสแกน
                </div>
                <div className="text-[11px] text-n-400">
                  แสดงเฉพาะล็อตจากสายการผลิตที่เสร็จสิ้นแล้ว
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto mb-5 space-y-2">
              {availableLots.length === 0 ? (
                <div className="py-10 text-center">
                  <div className="text-[28px] mb-2">🏭</div>
                  <div className="text-[13px] font-semibold text-n-700">
                    ยังไม่มีล็อตพร้อมตรวจ
                  </div>
                  <div className="text-[11.5px] text-n-400 mt-1">
                    กรุณาสร้างสายการผลิตและตั้งค่าสถานะเป็น &quot;เสร็จสิ้น&quot; ก่อน
                  </div>
                </div>
              ) : (
                availableLots.map(({ output, line }) => {
                  const isSelected = selectedModalLot?.output.id === output.id;
                  return (
                    <button
                      key={output.id}
                      onClick={() => setSelectedModalLot({ output, line })}
                      className={`w-full text-left px-4 py-3 rounded-r border-2 transition-all ${
                        isSelected
                          ? "border-p-400 bg-p-50"
                          : "border-n-100 hover:border-p-200 hover:bg-p-50/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-[13px] font-bold text-n-900">
                            {output.name}
                          </div>
                          <div className="text-[11px] text-n-500 mt-0.5">
                            {line.name} · {output.outputKg} กก.
                          </div>
                        </div>
                        <div className="text-[10px] font-mono text-n-400 bg-n-100 px-2 py-1 rounded">
                          {output.id}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            <div className="flex gap-3 shrink-0">
              <button
                onClick={() => setScanState("idle")}
                className="flex-1 py-3 border-2 border-n-200 text-n-600 rounded-r text-[13px] font-semibold hover:border-n-300 hover:bg-n-50 transition-all"
              >
                ยกเลิก
              </button>
              <AnimatedButton className="flex-1 rounded-r">
                <button
                  onClick={() => {
                    if (selectedModalLot) startScan(selectedModalLot);
                  }}
                  disabled={!selectedModalLot}
                  className="w-full py-3 bg-linear-to-br from-p-400 to-p-500 text-white rounded-r text-[13px] font-bold shadow-[0_4px_20px_rgba(244,114,182,.2)] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  เริ่มสแกน
                </button>
              </AnimatedButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

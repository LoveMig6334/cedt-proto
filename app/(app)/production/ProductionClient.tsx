"use client";

import { AnimatedButton } from "@/components/motion/AnimatedButton";
import { useEffect, useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

export type ProductionLineStatus =
  | "รอเริ่ม"
  | "กำลังผลิต"
  | "หยุดพัก"
  | "เสร็จสิ้น";

export type RequisitionItem = {
  intakeId: string;
  name: string;
  supplier: string;
  availableKg: number;
  requisitionedKg: number;
};

export type OutputProduct = {
  id: string;
  name: string;
  outputKg: number;
};

export type ProductionLine = {
  id: string;
  name: string;
  status: ProductionLineStatus;
  statusCls: string;
  createdAt: string;
  isoDate: string;
  requisitions: RequisitionItem[];
  outputs: OutputProduct[];
  totalInputKg: number;
  totalOutputKg: number;
  wasteKg: number;
  wastePct: number;
  efficiencyPct: number;
};

type IntakeRecord = {
  id: string;
  name: string;
  supplier: string;
  qty: string;
  date: string;
  isoDate?: string;
  status: string;
  statusCls: string;
};

// ─── Constants ───────────────────────────────────────────────────────────────

const STATUS_CLS: Record<ProductionLineStatus, string> = {
  รอเริ่ม: "bg-[#F3F4F6] text-[#4B5563]",
  กำลังผลิต: "bg-[#D1FAE5] text-[#059669]",
  หยุดพัก: "bg-[#FEF3C7] text-[#D97706]",
  เสร็จสิ้น: "bg-[#E0E7FF] text-[#4F46E5]",
};

const ALL_STATUSES: ProductionLineStatus[] = [
  "รอเริ่ม",
  "กำลังผลิต",
  "หยุดพัก",
  "เสร็จสิ้น",
];

// ─── Helper Functions ─────────────────────────────────────────────────────────

function parseKgFromQty(qty: string): number {
  const m = qty.match(/(\d+(?:\.\d+)?)\s*กก/);
  return m ? parseFloat(m[1]) : 0;
}

function computeMetrics(
  reqs: RequisitionItem[],
  outputs: OutputProduct[],
): {
  totalInputKg: number;
  totalOutputKg: number;
  wasteKg: number;
  wastePct: number;
  efficiencyPct: number;
} {
  const totalInputKg = reqs.reduce((s, r) => s + r.requisitionedKg, 0);
  const totalOutputKg = outputs.reduce((s, o) => s + o.outputKg, 0);
  const wasteKg = Math.max(0, totalInputKg - totalOutputKg);
  const wastePct = totalInputKg > 0 ? (wasteKg / totalInputKg) * 100 : 0;
  const efficiencyPct =
    totalInputKg > 0 ? (totalOutputKg / totalInputKg) * 100 : 0;
  return { totalInputKg, totalOutputKg, wasteKg, wastePct, efficiencyPct };
}

function computeAvailableKg(
  intakeId: string,
  totalKg: number,
  lines: ProductionLine[],
): number {
  const used = lines.reduce((sum, line) => {
    const req = line.requisitions.find((r) => r.intakeId === intakeId);
    return req ? sum + req.requisitionedKg : sum;
  }, 0);
  return Math.max(0, totalKg - used);
}

function generateLineId(lines: ProductionLine[]): string {
  const year = new Date().getFullYear();
  const nums = lines.map((l) => {
    const m = l.id.match(/PL-\d{4}-(\d+)/);
    return m ? parseInt(m[1], 10) : 0;
  });
  const max = nums.length > 0 ? Math.max(...nums) : 0;
  return `PL-${year}-${(max + 1).toString().padStart(4, "0")}`;
}

function formatPct(n: number, hasInput: boolean): string {
  return hasInput ? n.toFixed(1) + "%" : "—";
}

// ─── Mock / Fallback Data ─────────────────────────────────────────────────────

const fallbackIntakeRecords: IntakeRecord[] = [
  {
    id: "IN-2026-0449",
    name: "Wagyu A5 ริบอาย",
    supplier: "พรีเมียมบีฟ ซัพพลาย",
    qty: "4 ตัว / 280 กก.",
    date: "14 มี.ค. 2569 10:15",
    isoDate: "2026-03-14",
    status: "รอตรวจ",
    statusCls: "bg-[#FEF3C7] text-[#D97706]",
  },
  {
    id: "IN-2026-0448",
    name: "เนื้อโคขุน กาญจนบุรี",
    supplier: "วิถีเนื้อไทย กาญจนบุรี",
    qty: "7 ตัว / 410 กก.",
    date: "14 มี.ค. 2569 08:30",
    isoDate: "2026-03-14",
    status: "ผ่าน QC",
    statusCls: "bg-[#D1FAE5] text-[#059669]",
  },
  {
    id: "IN-2026-0447",
    name: "วัวเนื้อมาตรฐาน",
    supplier: "ไทยบีฟ พรีเมียม",
    qty: "8 ตัว / 480 กก.",
    date: "13 มี.ค. 2569 09:00",
    isoDate: "2026-03-13",
    status: "ผ่าน QC",
    statusCls: "bg-[#D1FAE5] text-[#059669]",
  },
  {
    id: "IN-2026-0446",
    name: "Wagyu A4 สเต๊ก",
    supplier: "สยาม วากิว",
    qty: "5 ตัว / 320 กก.",
    date: "11 มี.ค. 2569 08:45",
    isoDate: "2026-03-11",
    status: "ผ่าน QC",
    statusCls: "bg-[#D1FAE5] text-[#059669]",
  },
  {
    id: "IN-2026-0445",
    name: "วัวเนื้ออีสาน",
    supplier: "อีสาน แคตเทิล",
    qty: "10 ตัว / 580 กก.",
    date: "10 มี.ค. 2569 07:30",
    isoDate: "2026-03-10",
    status: "รอตรวจ",
    statusCls: "bg-[#FEF3C7] text-[#D97706]",
  },
  {
    id: "IN-2026-0444",
    name: "วัวเนื้อ Premium",
    supplier: "สมศรี ฟาร์ม",
    qty: "5 ตัว / 290 กก.",
    date: "7 มี.ค. 2569 09:15",
    isoDate: "2026-03-07",
    status: "ผ่าน QC",
    statusCls: "bg-[#D1FAE5] text-[#059669]",
  },
  {
    id: "IN-2026-0443",
    name: "เนื้อโคขุน",
    supplier: "วิถีเนื้อไทย กาญจนบุรี",
    qty: "9 ตัว / 520 กก.",
    date: "5 มี.ค. 2569 08:00",
    isoDate: "2026-03-05",
    status: "ผ่าน QC",
    statusCls: "bg-[#D1FAE5] text-[#059669]",
  },
  {
    id: "IN-2026-0442",
    name: "วัวเนื้อ Wagyu เกรด A",
    supplier: "พรีเมียมบีฟ ซัพพลาย",
    qty: "6 ตัว / 350 กก.",
    date: "3 มี.ค. 2569 10:30",
    isoDate: "2026-03-03",
    status: "ผ่าน QC",
    statusCls: "bg-[#D1FAE5] text-[#059669]",
  },
];

const mockLines: ProductionLine[] = [
  {
    id: "PL-2026-0003",
    name: "สายการผลิต A — สันใน",
    status: "กำลังผลิต",
    statusCls: STATUS_CLS["กำลังผลิต"],
    createdAt: "2026-03-14T06:00:00.000Z",
    isoDate: "2026-03-14",
    requisitions: [
      {
        intakeId: "IN-2026-0447",
        name: "วัวเนื้อมาตรฐาน",
        supplier: "ไทยบีฟ พรีเมียม",
        availableKg: 480,
        requisitionedKg: 180,
      },
    ],
    outputs: [{ id: "OUT-PL-2026-0003-0", name: "สันในหั่น", outputKg: 138 }],
    totalInputKg: 180,
    totalOutputKg: 138,
    wasteKg: 42,
    wastePct: 23.33,
    efficiencyPct: 76.67,
  },
  {
    id: "PL-2026-0002",
    name: "สายการผลิต B — สันนอก",
    status: "หยุดพัก",
    statusCls: STATUS_CLS["หยุดพัก"],
    createdAt: "2026-03-13T06:00:00.000Z",
    isoDate: "2026-03-13",
    requisitions: [
      {
        intakeId: "IN-2026-0448",
        name: "เนื้อโคขุน กาญจนบุรี",
        supplier: "วิถีเนื้อไทย กาญจนบุรี",
        availableKg: 410,
        requisitionedKg: 120,
      },
    ],
    outputs: [{ id: "OUT-PL-2026-0002-0", name: "สันนอก", outputKg: 54 }],
    totalInputKg: 120,
    totalOutputKg: 54,
    wasteKg: 66,
    wastePct: 55,
    efficiencyPct: 45,
  },
  {
    id: "PL-2026-0001",
    name: "สายการผลิต C — เนื้อสับ",
    status: "เสร็จสิ้น",
    statusCls: STATUS_CLS["เสร็จสิ้น"],
    createdAt: "2026-03-12T06:00:00.000Z",
    isoDate: "2026-03-12",
    requisitions: [
      {
        intakeId: "IN-2026-0444",
        name: "วัวเนื้อ Premium",
        supplier: "สมศรี ฟาร์ม",
        availableKg: 290,
        requisitionedKg: 200,
      },
    ],
    outputs: [{ id: "OUT-PL-2026-0001-0", name: "เนื้อสับ", outputKg: 186 }],
    totalInputKg: 200,
    totalOutputKg: 186,
    wasteKg: 14,
    wastePct: 7,
    efficiencyPct: 93,
  },
];

// ─── Data Functions ───────────────────────────────────────────────────────────

function loadProductionLines(): ProductionLine[] {
  try {
    const raw = localStorage.getItem("production_lines");
    if (!raw) return mockLines;
    const saved: ProductionLine[] = JSON.parse(raw);
    const mockFiltered = mockLines.filter(
      (m) => !saved.some((s) => s.id === m.id),
    );
    return [...saved, ...mockFiltered];
  } catch {
    return mockLines;
  }
}

function saveProductionLines(lines: ProductionLine[]): void {
  try {
    localStorage.setItem("production_lines", JSON.stringify(lines));
  } catch {
    // ignore
  }
}

function loadIntakeRecordsForProduction(): IntakeRecord[] {
  try {
    const raw = localStorage.getItem("intake_records");
    if (!raw) return fallbackIntakeRecords;
    const saved: IntakeRecord[] = JSON.parse(raw);
    const mockFiltered = fallbackIntakeRecords.filter(
      (m) => !saved.some((s) => s.id === m.id),
    );
    return [...saved, ...mockFiltered];
  } catch {
    return fallbackIntakeRecords;
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ProductionClient() {
  const [lines, setLines] = useState<ProductionLine[]>(mockLines);
  const [intakeRecords, setIntakeRecords] = useState<IntakeRecord[]>([]);

  // "ตั้งค่าการผลิต" modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLineName, setNewLineName] = useState("");
  const [selectedReqs, setSelectedReqs] = useState<Record<string, boolean>>({});
  const [reqAmounts, setReqAmounts] = useState<Record<string, string>>({});

  // Inline expand panel
  const [expandedLineId, setExpandedLineId] = useState<string | null>(null);
  const [draftOutputs, setDraftOutputs] = useState<
    Array<{ name: string; kg: string }>
  >([]);
  const [draftStatus, setDraftStatus] =
    useState<ProductionLineStatus>("กำลังผลิต");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLines(loadProductionLines());
    setIntakeRecords(loadIntakeRecordsForProduction());
  }, []);

  // ── Derived KPI values ────────────────────────────────────────────────────
  const todayIso = new Date().toISOString().split("T")[0];
  const activeLinesCount = lines.filter(
    (l) => l.status !== "เสร็จสิ้น",
  ).length;
  const todayOutputKg = lines
    .filter((l) => l.isoDate === todayIso)
    .reduce((s, l) => s + l.totalOutputKg, 0);
  const linesWithInput = lines.filter((l) => l.totalInputKg > 0);
  const avgWastePct =
    linesWithInput.length > 0
      ? linesWithInput.reduce((s, l) => s + l.wastePct, 0) /
        linesWithInput.length
      : 0;
  const avgEfficiencyPct =
    linesWithInput.length > 0
      ? linesWithInput.reduce((s, l) => s + l.efficiencyPct, 0) /
        linesWithInput.length
      : 0;

  // ── Stock sidebar ─────────────────────────────────────────────────────────
  const stockRows = intakeRecords
    .map((rec) => {
      const totalKg = parseKgFromQty(rec.qty);
      const usedKg = lines.reduce((s, l) => {
        const r = l.requisitions.find((req) => req.intakeId === rec.id);
        return r ? s + r.requisitionedKg : s;
      }, 0);
      const remainKg = Math.max(0, totalKg - usedKg);
      const pct = totalKg > 0 ? Math.round((remainKg / totalKg) * 100) : 0;
      return { id: rec.id, name: rec.name, supplier: rec.supplier, totalKg, remainKg, pct };
    })
    .filter((r) => r.totalKg > 0);

  // ── Live preview for expand panel ─────────────────────────────────────────
  const expandedLine = lines.find((l) => l.id === expandedLineId);
  const previewOutputs: OutputProduct[] = draftOutputs
    .filter((o) => o.name.trim() !== "" && (parseFloat(o.kg) || 0) > 0)
    .map((o, i) => ({
      id: `PREVIEW-${i}`,
      name: o.name.trim(),
      outputKg: parseFloat(o.kg) || 0,
    }));
  const previewMetrics = expandedLine
    ? computeMetrics(expandedLine.requisitions, previewOutputs)
    : { totalInputKg: 0, totalOutputKg: 0, wasteKg: 0, wastePct: 0, efficiencyPct: 0 };

  // ── Modal helpers ─────────────────────────────────────────────────────────
  function openAddModal() {
    setNewLineName("");
    setSelectedReqs({});
    setReqAmounts({});
    setShowAddModal(true);
  }

  const isAddValid =
    newLineName.trim() !== "" &&
    Object.entries(selectedReqs).some(([id, checked]) => {
      if (!checked) return false;
      const amt = parseFloat(reqAmounts[id] ?? "");
      return amt > 0;
    });

  function handleAddLine() {
    const now = new Date();
    const isoDate = now.toISOString().split("T")[0];
    const newId = generateLineId(lines);

    const reqs: RequisitionItem[] = intakeRecords
      .filter((rec) => selectedReqs[rec.id] === true)
      .map((rec) => {
        const totalKg = parseKgFromQty(rec.qty);
        const availableKg = computeAvailableKg(rec.id, totalKg, lines);
        const reqKg = parseFloat(reqAmounts[rec.id] ?? "") || 0;
        return {
          intakeId: rec.id,
          name: rec.name,
          supplier: rec.supplier,
          availableKg,
          requisitionedKg: Math.min(reqKg, availableKg),
        };
      })
      .filter((r) => r.requisitionedKg > 0);

    const metrics = computeMetrics(reqs, []);
    const newLine: ProductionLine = {
      id: newId,
      name: newLineName.trim(),
      status: "รอเริ่ม",
      statusCls: STATUS_CLS["รอเริ่ม"],
      createdAt: now.toISOString(),
      isoDate,
      requisitions: reqs,
      outputs: [],
      ...metrics,
    };

    const updated = [newLine, ...lines];
    setLines(updated);
    saveProductionLines(updated);
    setShowAddModal(false);
  }

  // ── Expand panel helpers ──────────────────────────────────────────────────
  function toggleExpand(line: ProductionLine) {
    if (expandedLineId === line.id) {
      setExpandedLineId(null);
      return;
    }
    setExpandedLineId(line.id);
    setDraftOutputs(
      line.outputs.length > 0
        ? line.outputs.map((o) => ({ name: o.name, kg: o.outputKg.toString() }))
        : [{ name: "", kg: "" }],
    );
    setDraftStatus(line.status);
  }

  function handleSaveOutputs(lineId: string) {
    const outputs: OutputProduct[] = draftOutputs
      .filter((o) => o.name.trim() !== "" && (parseFloat(o.kg) || 0) > 0)
      .map((o, i) => ({
        id: `OUT-${lineId}-${i}`,
        name: o.name.trim(),
        outputKg: parseFloat(o.kg) || 0,
      }));

    const updated = lines.map((l) => {
      if (l.id !== lineId) return l;
      const metrics = computeMetrics(l.requisitions, outputs);
      return { ...l, outputs, status: draftStatus, statusCls: STATUS_CLS[draftStatus], ...metrics };
    });

    setLines(updated);
    saveProductionLines(updated);
    setExpandedLineId(null);
  }

  return (
    <div>
      {/* Page Header */}
      <div className="flex justify-between items-start mb-5.5">
        <div>
          <div className="text-[20px] font-extrabold text-n-900 mb-0.75">
            🏭 ควบคุมการผลิต
          </div>
          <div className="text-[12.5px] text-n-500">
            ติดตามสายการผลิตแบบ Real-time พร้อมบันทึกผลผลิตและของเสีย
          </div>
        </div>
        <AnimatedButton>
          <button
            onClick={openAddModal}
            className="bg-linear-to-br from-p-400 to-p-500 text-white rounded-[9px] px-5 py-2.5 text-[13px] font-semibold shadow-[0_4px_20px_rgba(244,114,182,.25)]"
          >
            + เพิ่มสายการผลิต
          </button>
        </AnimatedButton>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-3.75 mb-5">
        {[
          {
            icon: "🏭",
            v: activeLinesCount.toString(),
            l: "สายผลิตที่ใช้งาน",
          },
          {
            icon: "⚖️",
            v: `${todayOutputKg.toFixed(0)} กก.`,
            l: "ผลผลิตวันนี้",
          },
          {
            icon: "♻️",
            v: formatPct(avgWastePct, linesWithInput.length > 0),
            l: "อัตราของเสียเฉลี่ย",
          },
          {
            icon: "✅",
            v: formatPct(avgEfficiencyPct, linesWithInput.length > 0),
            l: "ประสิทธิภาพเฉลี่ย",
          },
        ].map((k) => (
          <div
            key={k.l}
            className="bg-white rounded-rlg border border-p-100 p-4 relative overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,.04)]"
          >
            <div className="absolute -top-2 -right-2 w-16 h-16 bg-p-50 rounded-full" />
            <div className="text-[20px] mb-2.25">{k.icon}</div>
            <div className="text-[23px] font-extrabold text-n-900 mb-0.5">
              {k.v}
            </div>
            <div className="text-[11px] text-n-500">{k.l}</div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-[1fr_280px] gap-4.5">
        {/* Production line cards */}
        <div className="space-y-4">
          {lines.map((line) => {
            const isExpanded = expandedLineId === line.id;
            const effPct =
              line.totalInputKg > 0 ? Math.round(line.efficiencyPct) : 0;

            return (
              <div
                key={line.id}
                className="bg-white rounded-rlg border border-p-100 shadow-[0_1px_3px_rgba(0,0,0,.04)]"
              >
                {/* Card header */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-0.75">
                        <span className="text-[10px] font-mono text-n-400 bg-n-100 px-2 py-0.5 rounded">
                          {line.id}
                        </span>
                      </div>
                      <div className="text-[13.5px] font-bold text-n-900">
                        {line.name}
                      </div>
                    </div>
                    <span
                      className={`px-2.25 py-0.75 rounded-full text-[10.5px] font-semibold ${line.statusCls}`}
                    >
                      {line.status}
                    </span>
                  </div>

                  {/* Efficiency progress bar */}
                  <div className="h-1.5 bg-n-100 rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-p-300 to-p-500"
                      style={{ width: `${effPct}%` }}
                    />
                  </div>

                  {/* Metrics footer + toggle */}
                  <div className="flex items-center justify-between text-[11px] text-n-500">
                    <span>
                      ผลผลิต:{" "}
                      <b className="text-n-800">{line.totalOutputKg} กก.</b> /{" "}
                      {line.totalInputKg} กก.
                    </span>
                    <span>
                      ของเสีย:{" "}
                      <b className="text-fp-red">
                        {formatPct(line.wastePct, line.totalInputKg > 0)}
                      </b>
                    </span>
                    <AnimatedButton>
                      <button
                        onClick={() => toggleExpand(line)}
                        className="text-p-500 font-semibold text-[11px] hover:text-p-600 transition-colors"
                      >
                        บันทึกผลผลิต {isExpanded ? "▲" : "▼"}
                      </button>
                    </AnimatedButton>
                  </div>
                </div>

                {/* Inline expand panel */}
                {isExpanded && (
                  <div className="border-t border-n-100 p-5 bg-n-50/50">
                    {/* Requisitions (read-only) */}
                    <div className="mb-4">
                      <div className="text-[12px] font-bold text-n-700 mb-2">
                        วัตถุดิบที่ใช้
                      </div>
                      <div className="space-y-1.5">
                        {line.requisitions.map((req) => (
                          <div
                            key={req.intakeId}
                            className="flex items-center justify-between text-[12px] bg-white rounded-r px-3 py-2 border border-n-100"
                          >
                            <span className="text-n-800 font-medium">
                              {req.name}
                            </span>
                            <span className="text-n-500">
                              {req.supplier} ·{" "}
                              <b className="text-n-700">
                                {req.requisitionedKg} กก.
                              </b>
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Output rows */}
                    <div className="mb-4">
                      <div className="text-[12px] font-bold text-n-700 mb-2">
                        บันทึกผลผลิต
                      </div>
                      <div className="space-y-2">
                        {draftOutputs.map((row, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <input
                              type="text"
                              placeholder="ชื่อสินค้า"
                              value={row.name}
                              onChange={(e) =>
                                setDraftOutputs((prev) =>
                                  prev.map((item, i) =>
                                    i === idx
                                      ? { ...item, name: e.target.value }
                                      : item,
                                  ),
                                )
                              }
                              className="flex-1 px-3 py-2 bg-white border border-n-200 rounded-r font-sans text-[12.5px] text-n-800 outline-none focus:border-p-400 focus:shadow-[0_0_0_3px_rgba(244,114,182,.08)] placeholder:text-n-300 transition-all"
                            />
                            <input
                              type="number"
                              placeholder="น้ำหนัก"
                              value={row.kg}
                              onChange={(e) =>
                                setDraftOutputs((prev) =>
                                  prev.map((item, i) =>
                                    i === idx
                                      ? { ...item, kg: e.target.value }
                                      : item,
                                  ),
                                )
                              }
                              className="w-24 px-3 py-2 bg-white border border-n-200 rounded-r font-sans text-[12.5px] text-n-800 outline-none focus:border-p-400 focus:shadow-[0_0_0_3px_rgba(244,114,182,.08)] placeholder:text-n-300 transition-all"
                            />
                            <span className="text-[12px] text-n-400">กก.</span>
                            <button
                              onClick={() =>
                                setDraftOutputs((prev) =>
                                  prev.filter((_, i) => i !== idx),
                                )
                              }
                              className="text-n-400 hover:text-fp-red transition-colors text-[16px] leading-none w-5 text-center"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() =>
                          setDraftOutputs((prev) => [
                            ...prev,
                            { name: "", kg: "" },
                          ])
                        }
                        className="mt-2 text-[12px] text-p-500 font-semibold hover:text-p-600 transition-colors"
                      >
                        + เพิ่มรายการ
                      </button>
                    </div>

                    {/* Status dropdown */}
                    <div className="mb-4">
                      <label className="block text-[12px] font-bold text-n-700 mb-1.5">
                        สถานะสายการผลิต
                      </label>
                      <select
                        value={draftStatus}
                        onChange={(e) =>
                          setDraftStatus(
                            e.target.value as ProductionLineStatus,
                          )
                        }
                        className="w-full px-3 py-2 bg-white border border-n-200 rounded-r font-sans text-[12.5px] text-n-800 outline-none focus:border-p-400 transition-all"
                      >
                        {ALL_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Live preview */}
                    <div className="mb-4 bg-white rounded-r border border-n-100 px-4 py-3 grid grid-cols-2 gap-2 text-[12px]">
                      <div>
                        <span className="text-n-500">วัตถุดิบนำเข้า</span>
                        <span className="ml-1.5 font-bold text-n-800">
                          {previewMetrics.totalInputKg} กก.
                        </span>
                      </div>
                      <div>
                        <span className="text-n-500">ผลผลิต</span>
                        <span className="ml-1.5 font-bold text-n-800">
                          {previewMetrics.totalOutputKg} กก.
                        </span>
                      </div>
                      <div>
                        <span className="text-n-500">ของเสีย</span>
                        <span className="ml-1.5 font-bold text-fp-red">
                          {previewMetrics.wasteKg} กก. (
                          {formatPct(
                            previewMetrics.wastePct,
                            previewMetrics.totalInputKg > 0,
                          )}
                          )
                        </span>
                      </div>
                      <div>
                        <span className="text-n-500">ประสิทธิภาพ</span>
                        <span className="ml-1.5 font-bold text-fp-green">
                          {formatPct(
                            previewMetrics.efficiencyPct,
                            previewMetrics.totalInputKg > 0,
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => setExpandedLineId(null)}
                        className="flex-1 py-2.5 border-2 border-n-200 text-n-600 rounded-r text-[12.5px] font-semibold hover:border-n-300 hover:bg-n-50 transition-all"
                      >
                        ยกเลิก
                      </button>
                      <AnimatedButton className="flex-1 rounded-r">
                        <button
                          onClick={() => handleSaveOutputs(line.id)}
                          className="w-full py-2.5 bg-linear-to-br from-p-400 to-p-500 text-white rounded-r text-[12.5px] font-bold shadow-[0_4px_20px_rgba(244,114,182,.2)] transition-all"
                        >
                          ✅ บันทึกผลผลิต
                        </button>
                      </AnimatedButton>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* วัตถุดิบคงเหลือ sidebar */}
        <div className="bg-white rounded-rlg border border-p-100 shadow-[0_1px_3px_rgba(0,0,0,.04)]">
          <div className="px-5 pt-4 pb-3.25 border-b border-n-100">
            <div className="text-[13.5px] font-bold text-n-900">
              📦 วัตถุดิบคงเหลือ
            </div>
            <div className="text-[11px] text-n-500 mt-0.5">
              พร้อมใช้งานวันนี้
            </div>
          </div>
          <div className="p-4 space-y-4">
            {stockRows.length === 0 && (
              <div className="text-[12px] text-n-400 text-center py-4">
                ไม่มีข้อมูลวัตถุดิบ
              </div>
            )}
            {stockRows.map((row) => {
              const barColor =
                row.pct >= 50
                  ? "bg-linear-to-r from-[#34D399] to-fp-green"
                  : row.pct >= 20
                    ? "bg-linear-to-r from-[#FCD34D] to-[#F59E0B]"
                    : "bg-linear-to-r from-[#FCA5A5] to-[#EF4444]";
              return (
                <div key={row.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-[12.5px] font-semibold text-n-800 truncate max-w-[140px]">
                      {row.name}
                    </span>
                    <span className="text-[11px] text-n-400 shrink-0">
                      {row.pct}%
                    </span>
                  </div>
                  <div className="text-[11px] text-n-500 mb-1.5">
                    {row.remainKg} / {row.totalKg} กก.
                  </div>
                  <div className="h-1.5 bg-n-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${barColor}`}
                      style={{ width: `${row.pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* "ตั้งค่าการผลิต" modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAddModal(false);
          }}
        >
          <div className="bg-white rounded-rlg p-6 w-[480px] shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-p-100 rounded-xl flex items-center justify-center text-xl">
                🏭
              </div>
              <div>
                <div className="text-[14px] font-extrabold text-n-900">
                  ตั้งค่าการผลิต
                </div>
                <div className="text-[11px] text-n-400 font-medium">
                  เลือกวัตถุดิบและกำหนดปริมาณ
                </div>
              </div>
            </div>

            {/* Line name input */}
            <div className="mb-4.5">
              <label className="block text-[12.5px] font-semibold text-n-700 mb-1.5">
                ชื่อสายการผลิต <span className="text-p-500">*</span>
              </label>
              <input
                type="text"
                placeholder="เช่น สายการผลิต D — ซี่โครง"
                value={newLineName}
                onChange={(e) => setNewLineName(e.target.value)}
                className="w-full px-3.5 py-2.75 bg-white border-2 border-n-200 rounded-r font-sans text-[13px] text-n-800 outline-none focus:border-p-400 focus:shadow-[0_0_0_4px_rgba(244,114,182,.08)] placeholder:text-n-300 transition-all"
              />
            </div>

            {/* Intake checklist */}
            <div className="mb-5">
              <label className="block text-[12.5px] font-semibold text-n-700 mb-2">
                เลือกวัตถุดิบ <span className="text-p-500">*</span>
              </label>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {intakeRecords.map((rec) => {
                  const totalKg = parseKgFromQty(rec.qty);
                  const availKg = computeAvailableKg(rec.id, totalKg, lines);
                  const isDisabled = availKg <= 0;
                  const isChecked = selectedReqs[rec.id] === true;

                  return (
                    <div
                      key={rec.id}
                      className={`border rounded-r p-3 transition-all ${
                        isDisabled
                          ? "border-n-100 bg-n-50 opacity-50 cursor-not-allowed"
                          : isChecked
                            ? "border-p-300 bg-p-50 cursor-pointer"
                            : "border-n-200 bg-white hover:border-p-200 cursor-pointer"
                      }`}
                      onClick={() => {
                        if (isDisabled) return;
                        setSelectedReqs((prev) => ({
                          ...prev,
                          [rec.id]: !prev[rec.id],
                        }));
                      }}
                    >
                      <div className="flex items-start gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          disabled={isDisabled}
                          onChange={() => {}}
                          className="mt-0.5 accent-p-500"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-[12.5px] font-semibold text-n-800">
                              {rec.name}
                            </span>
                            <span className="text-[11px] text-n-400 shrink-0 ml-2">
                              คงเหลือ{" "}
                              <b className="text-n-700">{availKg} กก.</b>
                            </span>
                          </div>
                          <div className="text-[11px] text-n-500 mt-0.5">
                            {rec.supplier}
                          </div>
                          {/* kg input (when checked) */}
                          {isChecked && !isDisabled && (
                            <div
                              className="mt-2 flex items-center gap-2"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <input
                                type="number"
                                placeholder="ปริมาณ"
                                value={reqAmounts[rec.id] ?? ""}
                                max={availKg}
                                onChange={(e) =>
                                  setReqAmounts((prev) => ({
                                    ...prev,
                                    [rec.id]: e.target.value,
                                  }))
                                }
                                className="w-28 px-2.5 py-1.5 bg-white border border-p-200 rounded font-sans text-[12px] text-n-800 outline-none focus:border-p-400 transition-all"
                              />
                              <span className="text-[12px] text-n-500">
                                กก. (สูงสุด {availKg} กก.)
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-3 border-2 border-n-200 text-n-600 rounded-r text-[13px] font-semibold hover:border-n-300 hover:bg-n-50 transition-all"
              >
                ยกเลิก
              </button>
              <AnimatedButton className="flex-1 rounded-r">
                <button
                  onClick={handleAddLine}
                  disabled={!isAddValid}
                  className="w-full py-3 bg-linear-to-br from-p-400 to-p-500 text-white rounded-r text-[13px] font-bold shadow-[0_4px_20px_rgba(244,114,182,.2)] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  🏭 สร้างสายการผลิต
                </button>
              </AnimatedButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

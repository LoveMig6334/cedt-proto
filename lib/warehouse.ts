// ─── Warehouse Library ──────────────────────────────────────────────────────
// Links QC scan results to warehouse inventory automatically.
// Each QC-passed lot becomes a warehouse inventory item.

import type { QCGrade, QCScanSession } from "@/app/(app)/qc/QCClient";
import { MOCK_SESSIONS_FOR_HISTORY } from "@/app/(app)/qc/QCClient";

// ─── Types ───────────────────────────────────────────────────────────────────

export type WarehouseStatus = "พร้อมขาย" | "จอง" | "ใกล้หมดอายุ";

export type WarehouseItem = {
  id: string;
  name: string;
  lot: string;
  qty: string; // e.g. "48 กก."
  qtyKg: number;
  exp: string; // display string
  expDate: Date; // actual date for comparison
  daysUntilExpiry: number;
  temp: string;
  grade: QCGrade;
  status: WarehouseStatus;
  statusCls: string;
  qcSessionId: string;
  qcScore: number;
  scannedAt: string;
};

export type WarehouseFilter = "ทั้งหมด" | "พร้อมขาย" | "จอง" | "ใกล้หมดอายุ";

// ─── Constants ───────────────────────────────────────────────────────────────

// Shelf life in days based on grade as a simplistic model
const SHELF_LIFE_BY_GRADE: Record<QCGrade, number> = {
  A: 14, // best grade → longer shelf life
  B: 10,
  C: 7,
  D: 5, // worst grade → shortest shelf life
};

// Days threshold to be considered "ใกล้หมดอายุ"
const NEAR_EXPIRY_DAYS = 3;

// Default storage temperature
const DEFAULT_TEMP = "-2°C";

// ─── Status Helpers ──────────────────────────────────────────────────────────

function getStatusCls(status: WarehouseStatus): string {
  switch (status) {
    case "พร้อมขาย":
      return "bg-[#D1FAE5] text-[#059669]";
    case "จอง":
      return "bg-p-100 text-p-500";
    case "ใกล้หมดอายุ":
      return "bg-[#FEE2E2] text-[#DC2626]";
  }
}

function determineStatus(daysUntilExpiry: number, _grade: QCGrade): WarehouseStatus {
  if (daysUntilExpiry <= NEAR_EXPIRY_DAYS) return "ใกล้หมดอายุ";
  return "พร้อมขาย";
}

// ─── Date Helpers ────────────────────────────────────────────────────────────

function formatThaiDate(date: Date): string {
  const thaiMonths = [
    "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
    "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.",
  ];
  const day = date.getDate();
  const month = thaiMonths[date.getMonth()];
  const buddhistYear = date.getFullYear() + 543;
  // Show last 2 digits of Buddhist year
  const shortYear = buddhistYear.toString().slice(-2);
  return `${day} ${month} ${shortYear}`;
}

function daysBetween(a: Date, b: Date): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.floor((b.getTime() - a.getTime()) / msPerDay);
}

// ─── Load QC Records ─────────────────────────────────────────────────────────

function loadQCRecords(): QCScanSession[] {
  try {
    const raw = localStorage.getItem("qc_records");
    if (!raw) return MOCK_SESSIONS_FOR_HISTORY;
    const saved: QCScanSession[] = JSON.parse(raw);
    const mockFiltered = MOCK_SESSIONS_FOR_HISTORY.filter(
      (m) => !saved.some((s) => s.id === m.id),
    );
    return [...saved, ...mockFiltered];
  } catch {
    return [];
  }
}

// ─── Load Reserved Lots ──────────────────────────────────────────────────────

function loadReservedLots(): Set<string> {
  try {
    const raw = localStorage.getItem("warehouse_reserved");
    if (!raw) return new Set();
    return new Set(JSON.parse(raw));
  } catch {
    return new Set();
  }
}

export function saveReservedLots(lotIds: string[]): void {
  localStorage.setItem("warehouse_reserved", JSON.stringify(lotIds));
}

export function toggleReservation(lotId: string): string[] {
  const reserved = loadReservedLots();
  if (reserved.has(lotId)) {
    reserved.delete(lotId);
  } else {
    reserved.add(lotId);
  }
  const arr = Array.from(reserved);
  saveReservedLots(arr);
  return arr;
}

// ─── Build Warehouse Items ───────────────────────────────────────────────────

export function buildWarehouseItems(): WarehouseItem[] {
  const sessions = loadQCRecords();
  const reserved = loadReservedLots();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Only include sessions that passed QC (grade A, B, or C — not D)
  const passedSessions = sessions.filter(
    (s) => s.overallGrade !== "D",
  );

  return passedSessions.map((session, idx) => {
    // Calculate expiry date based on scan date + shelf life
    const scanDate = new Date(session.isoDate);
    const shelfLife = SHELF_LIFE_BY_GRADE[session.overallGrade];
    const expiryDate = new Date(scanDate);
    expiryDate.setDate(expiryDate.getDate() + shelfLife);

    const daysUntilExpiry = daysBetween(today, expiryDate);

    // Determine weight: use totalPieces as approximate kg (or passedPieces * some factor)
    const qtyKg = session.passedPieces * 6; // approximate: each piece ~6 kg

    // Check if reserved
    const isReserved = reserved.has(session.lotId);
    
    // Determine base status
    let status: WarehouseStatus;
    if (isReserved) {
      status = "จอง";
    } else {
      status = determineStatus(daysUntilExpiry, session.overallGrade);
    }

    const invId = `INV-${String(idx + 1).padStart(3, "0")}`;

    return {
      id: invId,
      name: `${session.productName} เกรด ${session.overallGrade}`,
      lot: session.lotId,
      qty: `${qtyKg} กก.`,
      qtyKg,
      exp: formatThaiDate(expiryDate),
      expDate: expiryDate,
      daysUntilExpiry,
      temp: DEFAULT_TEMP,
      grade: session.overallGrade,
      status,
      statusCls: getStatusCls(status),
      qcSessionId: session.id,
      qcScore: session.avgScore,
      scannedAt: session.scannedAt,
    };
  });
}

// ─── Filter Items ────────────────────────────────────────────────────────────

export function filterWarehouseItems(
  items: WarehouseItem[],
  filter: WarehouseFilter,
): WarehouseItem[] {
  if (filter === "ทั้งหมด") return items;
  return items.filter((item) => item.status === filter);
}

// ─── Stats ───────────────────────────────────────────────────────────────────

export function computeWarehouseStats(items: WarehouseItem[]) {
  const totalKg = items.reduce((sum, item) => sum + item.qtyKg, 0);
  const nearExpiryCount = items.filter((i) => i.status === "ใกล้หมดอายุ").length;
  const reservedKg = items
    .filter((i) => i.status === "จอง")
    .reduce((sum, i) => sum + i.qtyKg, 0);
  const totalItems = items.length;

  return {
    totalKg,
    totalItems,
    nearExpiryCount,
    reservedKg,
    avgTemp: DEFAULT_TEMP,
  };
}

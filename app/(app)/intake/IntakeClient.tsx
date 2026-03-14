"use client";

import { AnimatedButton } from "@/components/motion/AnimatedButton";
import { useEffect, useState } from "react";

type PendingRow = {
  sourcingId: string;
  supplierName: string;
  meatTypes: string;
  expectedDeliveryDate: string;
  notes: string;
};

type IntakeRecord = {
  id: string;
  name: string;
  supplier: string;
  qty: string;
  date: string;
  isoDate?: string; // "YYYY-MM-DD" for period filtering
  status: "ผ่าน QC" | "รอตรวจ";
  statusCls: string;
};

type Period = "รายวัน" | "รายสัปดาห์" | "รายเดือน" | "รายปี";

const PERIODS: Period[] = ["รายวัน", "รายสัปดาห์", "รายเดือน", "รายปี"];

// Mock data spread across today, this week, this month, and this year (ref: 2026-03-14)
const mockRecords: IntakeRecord[] = [
  // Today (2026-03-14)
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
  // This week (2026-03-09 to 2026-03-13)
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
  // This month, early March (2026-03-01 to 2026-03-08)
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
  // This year — February 2026
  {
    id: "IN-2026-0441",
    name: "วัวเนื้อมาตรฐาน",
    supplier: "ไทยบีฟ พรีเมียม",
    qty: "8 ตัว / 460 กก.",
    date: "20 ก.พ. 2569 09:00",
    isoDate: "2026-02-20",
    status: "ผ่าน QC",
    statusCls: "bg-[#D1FAE5] text-[#059669]",
  },
  {
    id: "IN-2026-0440",
    name: "Wagyu A4 สเต๊ก",
    supplier: "สยาม วากิว",
    qty: "4 ตัว / 240 กก.",
    date: "10 ก.พ. 2569 08:15",
    isoDate: "2026-02-10",
    status: "รอตรวจ",
    statusCls: "bg-[#FEF3C7] text-[#D97706]",
  },
  // This year — January 2026
  {
    id: "IN-2026-0439",
    name: "วัวเนื้ออีสาน",
    supplier: "อีสาน แคตเทิล",
    qty: "12 ตัว / 680 กก.",
    date: "28 ม.ค. 2569 07:45",
    isoDate: "2026-01-28",
    status: "ผ่าน QC",
    statusCls: "bg-[#D1FAE5] text-[#059669]",
  },
  {
    id: "IN-2026-0438",
    name: "วัวเนื้อ Premium",
    supplier: "สมศรี ฟาร์ม",
    qty: "5 ตัว / 290 กก.",
    date: "15 ม.ค. 2569 10:00",
    isoDate: "2026-01-15",
    status: "ผ่าน QC",
    statusCls: "bg-[#D1FAE5] text-[#059669]",
  },
];

function filterByPeriod(records: IntakeRecord[], period: Period): IntakeRecord[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return records.filter((r) => {
    if (!r.isoDate) return true;
    const d = new Date(r.isoDate);
    d.setHours(0, 0, 0, 0);

    switch (period) {
      case "รายวัน":
        return r.isoDate === today.toISOString().split("T")[0];
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

function loadIntakeRecords(): IntakeRecord[] {
  try {
    const raw = localStorage.getItem("intake_records");
    if (!raw) return mockRecords;
    const saved: IntakeRecord[] = JSON.parse(raw);
    const mockFiltered = mockRecords.filter(
      (m) => !saved.some((s) => s.id === m.id),
    );
    return [...saved, ...mockFiltered];
  } catch {
    return mockRecords;
  }
}

function loadPendingRows(): PendingRow[] {
  try {
    const raw = localStorage.getItem("sourcing_orders");
    if (!raw) return [];
    const orders: Array<{
      id: string;
      supplier: { name: string; meatTypes: string[] };
      deliveryDate: string;
      notes: string;
      status: string;
    }> = JSON.parse(raw);
    return orders
      .filter((o) => o.status === "In Intake")
      .map((o) => ({
        sourcingId: o.id,
        supplierName: o.supplier.name,
        meatTypes: o.supplier.meatTypes.join(", "),
        expectedDeliveryDate: o.deliveryDate,
        notes: o.notes,
      }));
  } catch {
    return [];
  }
}

export function IntakeClient() {
  const [pendingRows, setPendingRows] = useState<PendingRow[]>([]);
  const [intakeRecords, setIntakeRecords] =
    useState<IntakeRecord[]>(mockRecords);
  const [toastDismissed, setToastDismissed] = useState(false);
  const [activePeriod, setActivePeriod] = useState<Period>("รายสัปดาห์");
  const [confirmModal, setConfirmModal] = useState<PendingRow | null>(null);
  const [modalWeight, setModalWeight] = useState("");
  const [modalCount, setModalCount] = useState("");
  const [modalNote, setModalNote] = useState("");
  const [photoUploaded, setPhotoUploaded] = useState(false);

  useEffect(() => {
    const dismissed =
      sessionStorage.getItem("intake_toast_dismissed") === "1";
    setToastDismissed(dismissed);
    setPendingRows(loadPendingRows());
    setIntakeRecords(loadIntakeRecords());
  }, []);

  function dismissToast() {
    setToastDismissed(true);
    sessionStorage.setItem("intake_toast_dismissed", "1");
  }

  function openConfirmModal(row: PendingRow) {
    setConfirmModal(row);
    setModalWeight("");
    setModalCount("");
    setModalNote("");
    setPhotoUploaded(false);
  }

  function handleConfirmReceipt() {
    if (!confirmModal) return;
    const nextNum = (intakeRecords.length + 1).toString().padStart(4, "0");
    const now = new Date();
    const newRecord: IntakeRecord = {
      id: `IN-2026-${nextNum}`,
      name: confirmModal.meatTypes,
      supplier: confirmModal.supplierName,
      qty: `${modalCount} ตัว / ${modalWeight} กก.`,
      date: now.toLocaleString("th-TH", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      isoDate: now.toISOString().split("T")[0],
      status: "รอตรวจ",
      statusCls: "bg-[#FEF3C7] text-[#D97706]",
    };

    const updated = [newRecord, ...intakeRecords];
    setIntakeRecords(updated);
    localStorage.setItem("intake_records", JSON.stringify(updated));

    try {
      const raw = localStorage.getItem("sourcing_orders");
      if (raw) {
        const orders = JSON.parse(raw);
        localStorage.setItem(
          "sourcing_orders",
          JSON.stringify(
            orders.map((o: { id: string; status: string }) =>
              o.id === confirmModal.sourcingId
                ? { ...o, status: "Received" }
                : o,
            ),
          ),
        );
      }
    } catch {
      // ignore
    }

    setPendingRows((prev) =>
      prev.filter((r) => r.sourcingId !== confirmModal.sourcingId),
    );
    setConfirmModal(null);
  }

  const isModalValid =
    modalWeight.trim() !== "" && modalCount.trim() !== "" && photoUploaded;
  const filteredRecords = filterByPeriod(intakeRecords, activePeriod);

  return (
    <div>
      {/* Toast banner */}
      {!toastDismissed && pendingRows.length > 0 && (
        <div className="mb-4.5 bg-amber-50 border border-amber-200 rounded-rlg px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">🚚</span>
            <div>
              <div className="text-[13px] font-bold text-amber-800">
                มี {pendingRows.length} รายการรอรับสินค้า
              </div>
              <div className="text-[11.5px] text-amber-600">
                {pendingRows
                  .map(
                    (r) =>
                      `${r.supplierName} (คาดว่า ${r.expectedDeliveryDate || "—"})`,
                  )
                  .join(" · ")}
              </div>
            </div>
          </div>
          <button
            onClick={dismissToast}
            className="text-amber-400 hover:text-amber-600 text-xl font-bold leading-none ml-4"
          >
            ×
          </button>
        </div>
      )}

      {/* Page header */}
      <div className="flex justify-between items-start mb-5.5">
        <div>
          <div className="text-[20px] font-extrabold text-n-900 mb-0.75">
            📦 รับเข้าวัตถุดิบ
          </div>
          <div className="text-[12.5px] text-n-500">
            บันทึกการรับวัตถุดิบพร้อมรูปภาพและ timestamp อัตโนมัติ
          </div>
        </div>
        <AnimatedButton>
          <button className="bg-linear-to-br from-p-400 to-p-500 text-white rounded-[9px] px-5 py-2.5 text-[13px] font-semibold shadow-[0_4px_20px_rgba(244,114,182,.25)]">
            + บันทึกรับเข้าใหม่
          </button>
        </AnimatedButton>
      </div>

      {/* Intake history table — full width */}
      <div className="bg-white rounded-rlg border border-p-100 shadow-[0_1px_3px_rgba(0,0,0,.04)]">
        <div className="px-5 pt-4 pb-3.25 border-b border-n-100 flex items-center justify-between">
          <div className="text-[13.5px] font-bold text-n-900 flex items-center gap-2">
            ประวัติรับเข้า
            {pendingRows.length > 0 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">
                {pendingRows.length} รอรับ
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 bg-n-100 p-0.75 rounded-[10px]">
            {PERIODS.map((p) => (
              <button
                key={p}
                onClick={() => setActivePeriod(p)}
                className={`px-4 py-2 rounded-lg font-sans text-[12.5px] font-medium transition-all ${
                  activePeriod === p
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
                {["รหัส", "รายการ", "ผู้จัดส่ง", "ปริมาณ", "วันที่รับ", "สถานะ"].map(
                  (h) => (
                    <th
                      key={h}
                      className="bg-cream text-n-500 text-[10px] font-bold uppercase tracking-[.5px] px-3.25 py-2.5 text-left border-b border-n-100 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {/* Pending rows — always visible regardless of period filter */}
              {pendingRows.map((row) => (
                <tr key={row.sourcingId} className="bg-amber-50/60">
                  <td className="px-3.25 py-2.75 text-[12.5px] text-amber-700 border-b border-amber-100 font-mono">
                    {row.sourcingId}
                  </td>
                  <td className="px-3.25 py-2.75 text-[12.5px] text-amber-800 border-b border-amber-100 font-semibold">
                    {row.meatTypes}
                  </td>
                  <td className="px-3.25 py-2.75 text-[12.5px] text-amber-700 border-b border-amber-100">
                    {row.supplierName}
                  </td>
                  <td className="px-3.25 py-2.75 text-[12.5px] text-n-400 border-b border-amber-100 italic">
                    —
                  </td>
                  <td className="px-3.25 py-2.75 border-b border-amber-100 whitespace-nowrap">
                    <span className="text-[12px] font-semibold text-amber-600">
                      คาดว่า {row.expectedDeliveryDate || "—"}
                    </span>
                  </td>
                  <td className="px-3.25 py-2.75 border-b border-amber-100">
                    <AnimatedButton>
                      <button
                        onClick={() => openConfirmModal(row)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold bg-amber-500 hover:bg-amber-600 text-white transition-all shadow-sm"
                      >
                        📸 บันทึกรับเข้า
                      </button>
                    </AnimatedButton>
                  </td>
                </tr>
              ))}

              {/* Period-filtered completed records */}
              {filteredRecords.length === 0 && pendingRows.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-3.25 py-10 text-center text-[12.5px] text-n-400"
                  >
                    ไม่มีข้อมูลในช่วงเวลานี้
                  </td>
                </tr>
              )}
              {filteredRecords.map((row) => (
                <tr key={row.id} className="hover:[&>td]:bg-p-50">
                  <td className="px-3.25 py-2.75 text-[12.5px] text-n-700 border-b border-n-100 font-mono">
                    {row.id}
                  </td>
                  <td className="px-3.25 py-2.75 text-[12.5px] text-n-700 border-b border-n-100 font-semibold">
                    {row.name}
                  </td>
                  <td className="px-3.25 py-2.75 text-[12.5px] text-n-700 border-b border-n-100">
                    {row.supplier}
                  </td>
                  <td className="px-3.25 py-2.75 text-[12.5px] text-n-700 border-b border-n-100">
                    {row.qty}
                  </td>
                  <td className="px-3.25 py-2.75 text-[12.5px] text-n-700 border-b border-n-100 whitespace-nowrap">
                    {row.date}
                  </td>
                  <td className="px-3.25 py-2.75 border-b border-n-100">
                    <span
                      className={`inline-flex items-center px-2.25 py-0.75 rounded-full text-[10.5px] font-semibold ${row.statusCls}`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Intake modal */}
      {confirmModal && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setConfirmModal(null);
          }}
        >
          <div className="bg-white rounded-rlg p-6 w-110 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-xl">
                📦
              </div>
              <div>
                <div className="text-[14px] font-extrabold text-n-900">
                  บันทึกรับเข้า — {confirmModal.supplierName}
                </div>
                <div className="text-[11px] text-n-400 font-medium">
                  {confirmModal.sourcingId}
                </div>
              </div>
            </div>

            {/* Pre-filled order info */}
            <div className="bg-n-50 rounded-r p-3.5 mb-4.5 space-y-1.5">
              <div className="flex justify-between text-[12px]">
                <span className="text-n-500">ประเภทสินค้า</span>
                <span className="text-n-800 font-semibold">
                  {confirmModal.meatTypes}
                </span>
              </div>
              <div className="flex justify-between text-[12px]">
                <span className="text-n-500">คาดว่าจะส่ง</span>
                <span className="text-amber-600 font-semibold">
                  {confirmModal.expectedDeliveryDate || "—"}
                </span>
              </div>
              {confirmModal.notes && (
                <div className="flex justify-between text-[12px]">
                  <span className="text-n-500">หมายเหตุ PO</span>
                  <span className="text-n-700">{confirmModal.notes}</span>
                </div>
              )}
            </div>

            {/* Form fields */}
            <div className="space-y-3.5 mb-4.5">
              <div>
                <label className="block text-[12.5px] font-semibold text-n-700 mb-1.5">
                  น้ำหนักจริง (กก.) <span className="text-p-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={modalWeight}
                  onChange={(e) => setModalWeight(e.target.value)}
                  className="w-full px-3.5 py-2.75 bg-white border-2 border-n-200 rounded-r font-sans text-[13px] text-n-800 outline-none focus:border-p-400 focus:shadow-[0_0_0_4px_rgba(244,114,182,.08)] placeholder:text-n-300 transition-all"
                />
              </div>
              <div>
                <label className="block text-[12.5px] font-semibold text-n-700 mb-1.5">
                  จำนวนจริง (ตัว) <span className="text-p-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={modalCount}
                  onChange={(e) => setModalCount(e.target.value)}
                  className="w-full px-3.5 py-2.75 bg-white border-2 border-n-200 rounded-r font-sans text-[13px] text-n-800 outline-none focus:border-p-400 focus:shadow-[0_0_0_4px_rgba(244,114,182,.08)] placeholder:text-n-300 transition-all"
                />
              </div>
              <div>
                <label className="block text-[12.5px] font-semibold text-n-700 mb-1.5">
                  หมายเหตุ (ไม่บังคับ)
                </label>
                <input
                  type="text"
                  placeholder="เช่น สภาพสินค้าปกติ"
                  value={modalNote}
                  onChange={(e) => setModalNote(e.target.value)}
                  className="w-full px-3.5 py-2.75 bg-white border-2 border-n-200 rounded-r font-sans text-[13px] text-n-800 outline-none focus:border-p-400 focus:shadow-[0_0_0_4px_rgba(244,114,182,.08)] placeholder:text-n-300 transition-all"
                />
              </div>
            </div>

            {/* Photo upload */}
            <div className="mb-5">
              <label className="block text-[12.5px] font-semibold text-n-700 mb-1.5">
                รูปถ่ายยืนยัน <span className="text-p-500">*</span>
              </label>
              <div
                onClick={() => setPhotoUploaded((v) => !v)}
                className={`border-2 border-dashed rounded-r p-6 text-center cursor-pointer transition-all ${
                  photoUploaded
                    ? "border-green-300 bg-green-50"
                    : "border-p-300 bg-p-50 hover:bg-p-100 hover:border-p-400"
                }`}
              >
                {photoUploaded ? (
                  <>
                    <div className="text-[28px] mb-2">✅</div>
                    <div className="text-[13px] font-semibold text-green-700">
                      อัปโหลดรูปภาพแล้ว
                    </div>
                    <div className="text-[11px] text-green-500 mt-0.5">
                      คลิกเพื่อเปลี่ยนรูป
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-[28px] mb-2">📸</div>
                    <div className="text-[13px] text-n-600 mb-0.75">
                      ลากและวางรูปภาพ หรือคลิกเพื่อเลือก
                    </div>
                    <div className="text-[11px] text-n-400">
                      PNG, JPG สูงสุด 10MB
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmModal(null)}
                className="flex-1 py-3 border-2 border-n-200 text-n-600 rounded-r text-[13px] font-semibold hover:border-n-300 hover:bg-n-50 transition-all"
              >
                ยกเลิก
              </button>
              <AnimatedButton className="flex-1 rounded-r">
                <button
                  onClick={handleConfirmReceipt}
                  disabled={!isModalValid}
                  className="w-full py-3 bg-linear-to-br from-p-400 to-p-500 text-white rounded-r text-[13px] font-bold shadow-[0_4px_20px_rgba(244,114,182,.2)] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  ✅ ยืนยันรับสินค้า
                </button>
              </AnimatedButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

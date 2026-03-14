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
  status: "ผ่าน QC" | "รอตรวจ";
  statusCls: string;
};

const mockRecords: IntakeRecord[] = [
  {
    id: "IN-2025-0441",
    name: "วัวเนื้อ Wagyu เกรด A",
    supplier: "สมศรี ฟาร์ม",
    qty: "6 ตัว / 320 กก.",
    date: "10 มี.ค. 2568 08:15",
    status: "ผ่าน QC",
    statusCls: "bg-[#D1FAE5] text-[#059669]",
  },
  {
    id: "IN-2025-0440",
    name: "วัวเนื้อมาตรฐาน",
    supplier: "ไทยบีฟ พรีเมียม",
    qty: "8 ตัว / 480 กก.",
    date: "9 มี.ค. 2568 07:45",
    status: "ผ่าน QC",
    statusCls: "bg-[#D1FAE5] text-[#059669]",
  },
  {
    id: "IN-2025-0439",
    name: "วัวเนื้ออีสาน",
    supplier: "อีสาน แคตเทิล",
    qty: "10 ตัว / 580 กก.",
    date: "8 มี.ค. 2568 09:00",
    status: "รอตรวจ",
    statusCls: "bg-[#FEF3C7] text-[#D97706]",
  },
  {
    id: "IN-2025-0438",
    name: "วัวเนื้อ Premium",
    supplier: "สมศรี ฟาร์ม",
    qty: "5 ตัว / 290 กก.",
    date: "7 มี.ค. 2568 10:30",
    status: "ผ่าน QC",
    statusCls: "bg-[#D1FAE5] text-[#059669]",
  },
];

function loadIntakeRecords(): IntakeRecord[] {
  try {
    const raw = localStorage.getItem("intake_records");
    if (!raw) return mockRecords;
    const saved: IntakeRecord[] = JSON.parse(raw);
    // Prepend saved records before mock records, deduplicating by id
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
  const [intakeRecords, setIntakeRecords] = useState<IntakeRecord[]>(mockRecords);
  const [toastDismissed, setToastDismissed] = useState(false);
  const [confirmModal, setConfirmModal] = useState<PendingRow | null>(null);
  const [modalWeight, setModalWeight] = useState("");
  const [modalCount, setModalCount] = useState("");
  const [modalNote, setModalNote] = useState("");

  useEffect(() => {
    const dismissed = sessionStorage.getItem("intake_toast_dismissed") === "1";
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
  }

  function handleConfirmReceipt() {
    if (!confirmModal) return;

    const allRecords = intakeRecords;
    const nextNum = (allRecords.length + 1).toString().padStart(4, "0");
    const newRecord: IntakeRecord = {
      id: `IN-2025-${nextNum}`,
      name: confirmModal.meatTypes,
      supplier: confirmModal.supplierName,
      qty: `${modalCount} ตัว / ${modalWeight} กก.`,
      date: new Date().toLocaleString("th-TH", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "รอตรวจ",
      statusCls: "bg-[#FEF3C7] text-[#D97706]",
    };

    const updatedRecords = [newRecord, ...allRecords];
    setIntakeRecords(updatedRecords);
    localStorage.setItem("intake_records", JSON.stringify(updatedRecords));

    // Update sourcing order status to "Received"
    try {
      const raw = localStorage.getItem("sourcing_orders");
      if (raw) {
        const orders = JSON.parse(raw);
        const updated = orders.map((o: { id: string; status: string }) =>
          o.id === confirmModal.sourcingId ? { ...o, status: "Received" } : o,
        );
        localStorage.setItem("sourcing_orders", JSON.stringify(updated));
      }
    } catch {
      // ignore
    }

    setPendingRows((prev) =>
      prev.filter((r) => r.sourcingId !== confirmModal.sourcingId),
    );
    setConfirmModal(null);
  }

  const isModalValid = modalWeight.trim() !== "" && modalCount.trim() !== "";

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

      <div className="grid grid-cols-[1fr_300px] gap-4.5">
        {/* Intake table */}
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
              {["ทั้งหมด", "สัปดาห์นี้", "เดือนนี้"].map((t, i) => (
                <button
                  key={t}
                  className={`px-4 py-2 rounded-lg font-sans text-[12.5px] font-medium transition-all ${i === 0 ? "bg-white text-n-900 font-bold shadow-[0_1px_3px_rgba(0,0,0,.07)]" : "text-n-500"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {[
                    "รหัส",
                    "รายการ",
                    "ผู้จัดส่ง",
                    "ปริมาณ",
                    "วันที่รับ",
                    "สถานะ",
                  ].map((h) => (
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
                {/* Pending rows from sourcing */}
                {pendingRows.map((row) => (
                  <tr
                    key={row.sourcingId}
                    className="bg-amber-50/60 hover:[&>td]:bg-amber-50 cursor-pointer transition-colors"
                    onClick={() => openConfirmModal(row)}
                  >
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
                      <span className="inline-flex items-center gap-1 px-2.25 py-0.75 rounded-full text-[10.5px] font-semibold bg-amber-100 text-amber-700 animate-pulse">
                        🚚 รอรับสินค้า
                      </span>
                    </td>
                  </tr>
                ))}

                {/* Completed intake records */}
                {intakeRecords.map((row) => (
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

        {/* Quick record form */}
        <div className="bg-white rounded-rlg border border-p-100 shadow-[0_1px_3px_rgba(0,0,0,.04)]">
          <div className="px-5 pt-4 pb-3.25 border-b border-n-100">
            <div className="text-[13.5px] font-bold text-n-900">
              บันทึกรับเข้าด่วน
            </div>
          </div>
          <div className="p-4 space-y-4.25">
            {[
              {
                label: "ผู้จัดส่ง",
                type: "select",
                opts: ["สมศรี ฟาร์ม", "ไทยบีฟ พรีเมียม", "อีสาน แคตเทิล"],
              },
              {
                label: "ประเภทวัตถุดิบ",
                type: "text",
                ph: "เช่น วัวเนื้อ Wagyu",
              },
              { label: "น้ำหนัก (กก.)", type: "number", ph: "0.00" },
              { label: "จำนวน (ตัว)", type: "number", ph: "0" },
            ].map((f) => (
              <div key={f.label}>
                <label className="block text-[12.5px] font-semibold text-n-700 mb-1.75">
                  {f.label}
                </label>
                {f.type === "select" ? (
                  <select className="w-full px-3.25 py-2.5 bg-white border-2 border-n-200 rounded-r font-sans text-[13px] text-n-800 outline-none cursor-pointer focus:border-p-400 transition-all">
                    {f.opts!.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={f.type}
                    placeholder={f.ph}
                    className="w-full px-3.5 py-2.75 bg-white border-2 border-n-200 rounded-r font-sans text-[13px] text-n-800 outline-none focus:border-p-400 focus:shadow-[0_0_0_4px_rgba(244,114,182,.08)] placeholder:text-n-300 transition-all"
                  />
                )}
              </div>
            ))}
            <div>
              <label className="block text-[12.5px] font-semibold text-n-700 mb-1.75">
                อัปโหลดรูปภาพ
              </label>
              <div className="border-2 border-dashed border-p-300 rounded-r p-6.5 text-center cursor-pointer bg-p-50 hover:bg-p-100 hover:border-p-400 transition-all">
                <div className="text-[26px] mb-2.25">📸</div>
                <div className="text-[13px] text-n-600 mb-0.75">
                  ลากและวางรูปภาพ หรือคลิกเพื่อเลือก
                </div>
                <div className="text-[11px] text-n-400">
                  PNG, JPG สูงสุด 10MB
                </div>
              </div>
            </div>
            <AnimatedButton className="w-full rounded-r">
              <button className="w-full py-3.25 bg-linear-to-br from-p-400 to-p-500 text-white rounded-r text-[15px] font-bold shadow-[0_4px_20px_rgba(244,114,182,.25)]">
                บันทึกรับเข้า
              </button>
            </AnimatedButton>
          </div>
        </div>
      </div>

      {/* Confirm receipt modal */}
      {confirmModal && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setConfirmModal(null);
          }}
        >
          <div className="bg-white rounded-rlg p-6 w-[400px] shadow-2xl">
            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-xl">
                🚚
              </div>
              <div>
                <div className="text-[14px] font-extrabold text-n-900">
                  รับสินค้า — {confirmModal.supplierName}
                </div>
                <div className="text-[11px] text-n-400 font-medium">
                  {confirmModal.sourcingId}
                </div>
              </div>
            </div>

            {/* Pre-filled info */}
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
                  <span className="text-n-500">หมายเหตุ</span>
                  <span className="text-n-700">{confirmModal.notes}</span>
                </div>
              )}
            </div>

            {/* Form fields */}
            <div className="space-y-3.5 mb-5">
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

            {/* Buttons */}
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

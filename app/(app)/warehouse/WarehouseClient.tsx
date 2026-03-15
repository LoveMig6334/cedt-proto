"use client";

import { useEffect, useMemo, useState } from "react";
import {
  buildWarehouseItems,
  computeWarehouseStats,
  filterWarehouseItems,
  toggleReservation,
  type WarehouseFilter,
  type WarehouseItem,
} from "@/lib/warehouse";

const FILTERS: WarehouseFilter[] = ["ทั้งหมด", "พร้อมขาย", "จอง", "ใกล้หมดอายุ"];

export function WarehouseClient() {
  const [items, setItems] = useState<WarehouseItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<WarehouseFilter>("ทั้งหมด");

  // Load on mount
  useEffect(() => {
    setItems(buildWarehouseItems());
  }, []);

  const filteredItems = useMemo(
    () => filterWarehouseItems(items, activeFilter),
    [items, activeFilter],
  );

  const stats = useMemo(() => computeWarehouseStats(items), [items]);

  // Count per filter for badges
  const countByFilter = useMemo(() => {
    return {
      ทั้งหมด: items.length,
      พร้อมขาย: items.filter((i) => i.status === "พร้อมขาย").length,
      จอง: items.filter((i) => i.status === "จอง").length,
      ใกล้หมดอายุ: items.filter((i) => i.status === "ใกล้หมดอายุ").length,
    };
  }, [items]);

  function handleToggleReserve(lotId: string) {
    toggleReservation(lotId);
    // Reload items to reflect changes
    setItems(buildWarehouseItems());
  }

  function gradeBadgeCls(grade: string): string {
    switch (grade) {
      case "A":
        return "bg-linear-to-br from-[#34D399] to-[#059669] text-white";
      case "B":
        return "bg-linear-to-br from-p-300 to-p-500 text-white";
      case "C":
        return "bg-linear-to-br from-[#FCD34D] to-[#F59E0B] text-white";
      default:
        return "bg-n-200 text-n-600";
    }
  }

  function expiryBadgeCls(days: number): string {
    if (days <= 0) return "text-[#DC2626] font-bold";
    if (days <= 3) return "text-[#D97706] font-semibold";
    return "text-n-700";
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-start mb-5.5">
        <div>
          <div className="text-[20px] font-extrabold text-n-900 mb-0.75">
            🏪 คลังสินค้า
          </div>
          <div className="text-[12.5px] text-n-500">
            เชื่อมกับระบบตรวจ QC อัตโนมัติ — ล็อตที่ผ่าน QC จะเข้าคลังทันที
          </div>
        </div>
      </div>

      {/* Storage stats */}
      <div className="grid grid-cols-4 gap-3.75 mb-5">
        {[
          {
            icon: "📦",
            v: `${stats.totalKg} กก.`,
            l: "สต็อกรวม",
            sub: `${stats.totalItems} รายการ`,
          },
          {
            icon: "❄️",
            v: stats.avgTemp,
            l: "อุณหภูมิเฉลี่ย",
            sub: "ปลอดภัย",
          },
          {
            icon: "⚠️",
            v: `${stats.nearExpiryCount} ล็อต`,
            l: "ใกล้หมดอายุ",
            sub: stats.nearExpiryCount > 0 ? "ต้องขายด่วน" : "ไม่มี",
          },
          {
            icon: "🔒",
            v: `${stats.reservedKg} กก.`,
            l: "สินค้าจอง",
            sub: "รอจัดส่ง",
          },
        ].map((k) => (
          <div
            key={k.l}
            className="bg-white rounded-rlg border border-p-100 p-4 relative overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,.04)]"
          >
            <div className="absolute -top-2 -right-2 w-16 h-16 bg-p-50 rounded-full" />
            <div className="text-[20px] mb-2.25">{k.icon}</div>
            <div className="text-[20px] font-extrabold text-n-900 mb-0.5">
              {k.v}
            </div>
            <div className="text-[11px] text-n-500">{k.l}</div>
            <div className="text-[10.5px] text-n-400 mt-1">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Inventory table */}
      <div className="bg-white rounded-rlg border border-p-100 shadow-[0_1px_3px_rgba(0,0,0,.04)]">
        <div className="px-5 pt-4 pb-3.25 border-b border-n-100 flex items-center justify-between">
          <div className="text-[13.5px] font-bold text-n-900">
            รายการสินค้าในคลัง
          </div>
          <div className="flex items-center gap-2 bg-n-100 p-0.75 rounded-[10px]">
            {FILTERS.map((t) => (
              <button
                key={t}
                onClick={() => setActiveFilter(t)}
                className={`px-3 py-1.75 rounded-lg font-sans text-[12px] font-medium transition-all ${
                  activeFilter === t
                    ? "bg-white text-n-900 font-bold shadow-[0_1px_3px_rgba(0,0,0,.07)]"
                    : "text-n-500 hover:text-n-700"
                }`}
              >
                {t}
                {countByFilter[t] > 0 && (
                  <span className="ml-1 text-[10px] text-n-400">
                    ({countByFilter[t]})
                  </span>
                )}
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
                  "สินค้า",
                  "ล็อต QC",
                  "น้ำหนัก",
                  "หมดอายุ",
                  "เหลือ",
                  "อุณหภูมิ",
                  "เกรด",
                  "สถานะ",
                  "",
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
              {filteredItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="px-3.25 py-10 text-center text-[12.5px] text-n-400"
                  >
                    {activeFilter === "ทั้งหมด"
                      ? "ยังไม่มีสินค้าในคลัง — ล็อตจะเข้าอัตโนมัติเมื่อผ่านการตรวจ QC"
                      : `ไม่มีสินค้าในสถานะ "${activeFilter}"`}
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:[&>td]:bg-p-50">
                    <td className="px-3.25 py-2.75 text-[11px] text-n-400 border-b border-n-100 font-mono">
                      {item.id}
                    </td>
                    <td className="px-3.25 py-2.75 text-[12.5px] text-n-900 border-b border-n-100 font-semibold">
                      {item.name}
                    </td>
                    <td className="px-3.25 py-2.75 text-[11px] text-n-500 border-b border-n-100 font-mono">
                      {item.lot}
                    </td>
                    <td className="px-3.25 py-2.75 text-[12.5px] text-n-700 border-b border-n-100">
                      {item.qty}
                    </td>
                    <td className="px-3.25 py-2.75 text-[12.5px] text-n-700 border-b border-n-100 whitespace-nowrap">
                      {item.exp}
                    </td>
                    <td className="px-3.25 py-2.75 border-b border-n-100 whitespace-nowrap">
                      <span className={`text-[12px] ${expiryBadgeCls(item.daysUntilExpiry)}`}>
                        {item.daysUntilExpiry <= 0
                          ? "หมดอายุแล้ว"
                          : `${item.daysUntilExpiry} วัน`}
                      </span>
                    </td>
                    <td className="px-3.25 py-2.75 text-[12.5px] text-n-700 border-b border-n-100">
                      {item.temp}
                    </td>
                    <td className="px-3.25 py-2.75 border-b border-n-100">
                      <div
                        className={`w-8 h-8 rounded-full ${gradeBadgeCls(item.grade)} flex items-center justify-center font-extrabold text-[14px]`}
                      >
                        {item.grade}
                      </div>
                    </td>
                    <td className="px-3.25 py-2.75 border-b border-n-100">
                      <span
                        className={`inline-flex items-center px-2.25 py-0.75 rounded-full text-[10.5px] font-semibold ${item.statusCls}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-3.25 py-2.75 border-b border-n-100">
                      <button
                        onClick={() => handleToggleReserve(item.lot)}
                        className="text-p-500 text-[12px] font-semibold hover:text-p-400 transition-colors whitespace-nowrap"
                      >
                        {item.status === "จอง" ? "ยกเลิกจอง" : "จอง"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* QC link info */}
      {items.length > 0 && (
        <div className="mt-4 px-4 py-3 bg-p-50 border border-p-100 rounded-[10px] flex items-center gap-3">
          <span className="text-[16px]">🔗</span>
          <div>
            <p className="text-[12px] font-bold text-p-600">
              เชื่อมกับระบบตรวจ QC อัตโนมัติ
            </p>
            <p className="text-[11.5px] text-n-500 mt-0.5">
              ล็อตที่ผ่าน QC (เกรด A, B, C) จะเข้าคลังอัตโนมัติ พร้อมคำนวณวันหมดอายุตามเกรด
              (A=14 วัน, B=10 วัน, C=7 วัน)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

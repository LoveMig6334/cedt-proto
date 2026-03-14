"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Order, OrderStatus } from "../SalesClient";

// ─── Types ───────────────────────────────────────────────────────────────────

type HistoryFilter = "ทั้งหมด" | "รอจัดส่ง" | "กำลังจัดส่ง" | "ส่งแล้ว";

const FILTERS: HistoryFilter[] = ["ทั้งหมด", "รอจัดส่ง", "กำลังจัดส่ง", "ส่งแล้ว"];

// ─── Seed Data (same as SalesClient) ─────────────────────────────────────────

function statusCls(status: OrderStatus): string {
  switch (status) {
    case "รอดำเนินการ":
      return "bg-[#EDE9FE] text-[#7C3AED]";
    case "รอจัดส่ง":
      return "bg-[#FEF3C7] text-[#D97706]";
    case "กำลังจัดส่ง":
      return "bg-[#D1FAE5] text-[#059669]";
    case "ส่งแล้ว":
      return "bg-n-100 text-n-500";
  }
}

const seedOrders: Order[] = [
  {
    id: "ORD-882",
    customer: "Makro ลาดพร้าว",
    items: "สันใน Wagyu 20 กก.",
    total: "฿42,000",
    totalNum: 42000,
    delivery: "10 มี.ค. 14:00",
    isoDate: "2026-03-10",
    status: "กำลังจัดส่ง",
    statusCls: statusCls("กำลังจัดส่ง"),
    createdAt: "2026-03-10T08:00:00",
  },
  {
    id: "ORD-881",
    customer: "Villa Market",
    items: "สันนอก + ซี่โครง 35 กก.",
    total: "฿28,500",
    totalNum: 28500,
    delivery: "10 มี.ค. 16:30",
    isoDate: "2026-03-10",
    status: "รอดำเนินการ",
    statusCls: statusCls("รอดำเนินการ"),
    createdAt: "2026-03-10T07:00:00",
  },
  {
    id: "ORD-880",
    customer: "Tops Supermarket",
    items: "เนื้อสับ 30 กก.",
    total: "฿19,800",
    totalNum: 19800,
    delivery: "11 มี.ค. 09:00",
    isoDate: "2026-03-11",
    status: "รอดำเนินการ",
    statusCls: statusCls("รอดำเนินการ"),
    createdAt: "2026-03-11T06:00:00",
  },
  {
    id: "ORD-879",
    customer: "The Mall Group",
    items: "สันใน + สันนอก 60 กก.",
    total: "฿86,400",
    totalNum: 86400,
    delivery: "9 มี.ค. 10:00",
    isoDate: "2026-03-09",
    status: "ส่งแล้ว",
    statusCls: statusCls("ส่งแล้ว"),
    createdAt: "2026-03-09T06:00:00",
  },
  {
    id: "ORD-878",
    customer: "Foodland",
    items: "Wagyu เกรด A 15 กก.",
    total: "฿32,000",
    totalNum: 32000,
    delivery: "8 มี.ค. 13:00",
    isoDate: "2026-03-08",
    status: "ส่งแล้ว",
    statusCls: statusCls("ส่งแล้ว"),
    createdAt: "2026-03-08T06:00:00",
  },
];

// ─── Storage ─────────────────────────────────────────────────────────────────

function loadOrders(): Order[] {
  try {
    const raw = localStorage.getItem("sales_orders");
    if (!raw) return seedOrders;
    const saved: Order[] = JSON.parse(raw);
    const seedFiltered = seedOrders.filter(
      (m) => !saved.some((s) => s.id === m.id),
    );
    return [...saved, ...seedFiltered];
  } catch {
    return seedOrders;
  }
}

// ─── Component ───────────────────────────────────────────────────────────────

export function SalesHistoryClient() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeFilter, setActiveFilter] = useState<HistoryFilter>("ทั้งหมด");

  useEffect(() => {
    setOrders(loadOrders());
  }, []);

  // Only show orders that are NOT "รอดำเนินการ" (those are in main page)
  const historyOrders = useMemo(() => {
    return orders.filter((o) => o.status !== "รอดำเนินการ");
  }, [orders]);

  const filteredOrders = useMemo(() => {
    if (activeFilter === "ทั้งหมด") return historyOrders;
    return historyOrders.filter((o) => o.status === activeFilter);
  }, [historyOrders, activeFilter]);

  const countByFilter = useMemo(() => {
    return {
      ทั้งหมด: historyOrders.length,
      รอจัดส่ง: historyOrders.filter((o) => o.status === "รอจัดส่ง").length,
      กำลังจัดส่ง: historyOrders.filter((o) => o.status === "กำลังจัดส่ง").length,
      ส่งแล้ว: historyOrders.filter((o) => o.status === "ส่งแล้ว").length,
    };
  }, [historyOrders]);

  // KPIs
  const totalRevenue = historyOrders.reduce((s, o) => s + o.totalNum, 0);
  const pendingDelivery = historyOrders.filter((o) => o.status === "รอจัดส่ง").length;
  const delivering = historyOrders.filter((o) => o.status === "กำลังจัดส่ง").length;
  const delivered = historyOrders.filter((o) => o.status === "ส่งแล้ว").length;

  function formatRevenue(n: number): string {
    if (n >= 1000000) return `฿${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `฿${(n / 1000).toFixed(0)}K`;
    return `฿${n}`;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-5.5">
        <Link
          href="/sales"
          className="flex items-center gap-1.5 text-[13px] text-n-500 hover:text-p-500 font-semibold transition-colors"
        >
          ← กลับ
        </Link>
        <div>
          <div className="text-[20px] font-extrabold text-n-900 mb-0.75">
            📋 ประวัติออร์เดอร์
          </div>
          <div className="text-[12.5px] text-n-500">
            ออร์เดอร์ทั้งหมดที่ผ่านการทำรายการแล้ว
          </div>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-4 gap-3.5 mb-5.5">
        {[
          { label: "ยอดรวมทั้งหมด", value: formatRevenue(totalRevenue), icon: "💰", color: "text-p-500" },
          { label: "รอจัดส่ง", value: pendingDelivery, icon: "📦", color: "text-[#D97706]" },
          { label: "กำลังจัดส่ง", value: delivering, icon: "🚚", color: "text-[#059669]" },
          { label: "ส่งแล้ว", value: delivered, icon: "✅", color: "text-n-600" },
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

      {/* Orders table */}
      <div className="bg-white rounded-rlg border border-p-100 shadow-[0_1px_3px_rgba(0,0,0,.04)]">
        <div className="px-5 pt-4 pb-3.25 border-b border-n-100 flex items-center justify-between">
          <div className="text-[13.5px] font-bold text-n-900">รายการทั้งหมด</div>
          <div className="flex items-center gap-2 bg-n-100 p-0.75 rounded-[10px]">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.75 rounded-lg font-sans text-[12px] font-medium transition-all ${
                  activeFilter === f
                    ? "bg-white text-n-900 font-bold shadow-[0_1px_3px_rgba(0,0,0,.07)]"
                    : "text-n-500 hover:text-n-700"
                }`}
              >
                {f}
                {countByFilter[f] > 0 && (
                  <span className="ml-1 text-[10px] text-n-400">
                    ({countByFilter[f]})
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
                  "ออร์เดอร์",
                  "ลูกค้า",
                  "รายการ",
                  "ยอดรวม",
                  "กำหนดส่ง",
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
              {filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-3.25 py-10 text-center text-[12.5px] text-n-400"
                  >
                    ไม่มีออร์เดอร์ในตัวกรอง &quot;{activeFilter}&quot;
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:[&>td]:bg-p-50">
                    <td className="px-3.25 py-2.75 text-[11px] text-n-400 border-b border-n-100 font-mono">
                      {o.id}
                    </td>
                    <td className="px-3.25 py-2.75 text-[12.5px] text-n-900 border-b border-n-100 font-semibold">
                      {o.customer}
                    </td>
                    <td className="px-3.25 py-2.75 text-[12.5px] text-n-700 border-b border-n-100">
                      {o.items}
                    </td>
                    <td className="px-3.25 py-2.75 text-[12.5px] text-n-900 border-b border-n-100 font-bold">
                      {o.total}
                    </td>
                    <td className="px-3.25 py-2.75 text-[12.5px] text-n-700 border-b border-n-100 whitespace-nowrap">
                      {o.delivery}
                    </td>
                    <td className="px-3.25 py-2.75 border-b border-n-100">
                      <span
                        className={`inline-flex items-center px-2.25 py-0.75 rounded-full text-[10.5px] font-semibold ${o.statusCls}`}
                      >
                        {o.status}
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
  );
}

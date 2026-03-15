"use client";

import { AnimatedButton } from "@/components/motion/AnimatedButton";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

export type OrderStatus =
  | "รอดำเนินการ"
  | "รอจัดส่ง"
  | "กำลังจัดส่ง"
  | "ส่งแล้ว";

export type Order = {
  id: string;
  customer: string;
  items: string;
  total: string;
  totalNum: number;
  delivery: string;
  isoDate: string;
  status: OrderStatus;
  statusCls: string;
  createdAt: string;
};

type SalesFilter = "ทั้งหมด" | "วันนี้" | "รอส่ง";

// ─── Helpers ─────────────────────────────────────────────────────────────────

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

function generateOrderId(orders: Order[]): string {
  const maxNum = orders.reduce((max, o) => {
    const m = o.id.match(/ORD-(\d+)/);
    return m ? Math.max(max, parseInt(m[1], 10)) : max;
  }, 0);
  return `ORD-${maxNum + 1}`;
}

function formatThaiDate(date: Date): string {
  const thaiMonths = [
    "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
    "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.",
  ];
  const d = date.getDate();
  const m = thaiMonths[date.getMonth()];
  return `${d} ${m}`;
}

function formatThaiDateTime(date: Date): string {
  const d = formatThaiDate(date);
  const h = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${d} ${h}:${min}`;
}

// ─── Seed Data ───────────────────────────────────────────────────────────────

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

function saveOrders(orders: Order[]): void {
  localStorage.setItem("sales_orders", JSON.stringify(orders));
}

// ─── Chart Data ──────────────────────────────────────────────────────────────

const salesChart = [62, 78, 55, 90, 72, 84, 68, 95, 80, 74, 88, 100];
const months = [
  "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
  "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.",
];

// ─── Component ───────────────────────────────────────────────────────────────

export function SalesClient() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeFilter, setActiveFilter] = useState<SalesFilter>("ทั้งหมด");
  const [showModal, setShowModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Modal form state
  const [formCustomer, setFormCustomer] = useState("");
  const [formItems, setFormItems] = useState("");
  const [formTotal, setFormTotal] = useState("");
  const [formDelivery, setFormDelivery] = useState("");
  const [formNote, setFormNote] = useState("");

  useEffect(() => {
    setOrders(loadOrders());
  }, []);

  const todayIso = new Date().toISOString().split("T")[0];

  // Filtered orders — only show non "รอจัดส่ง" orders in main view
  // "รอจัดส่ง" orders go to history page
  const mainOrders = useMemo(() => {
    return orders.filter((o) => o.status !== "รอจัดส่ง");
  }, [orders]);

  const filteredOrders = useMemo(() => {
    let result = mainOrders;
    switch (activeFilter) {
      case "วันนี้":
        result = result.filter((o) => o.isoDate === todayIso);
        break;
      case "รอส่ง":
        result = result.filter(
          (o) => o.status === "รอดำเนินการ" || o.status === "กำลังจัดส่ง",
        );
        break;
    }
    return result;
  }, [mainOrders, activeFilter, todayIso]);

  // Count per filter
  const countByFilter = useMemo(() => {
    return {
      ทั้งหมด: mainOrders.length,
      วันนี้: mainOrders.filter((o) => o.isoDate === todayIso).length,
      รอส่ง: mainOrders.filter(
        (o) => o.status === "รอดำเนินการ" || o.status === "กำลังจัดส่ง",
      ).length,
    };
  }, [mainOrders, todayIso]);

  // KPIs
  const totalRevenue = orders.reduce((s, o) => s + o.totalNum, 0);
  const totalOrders = orders.length;
  const pendingCount = orders.filter((o) => o.status === "รอดำเนินการ").length;
  const deliveryTodayCount = mainOrders.filter(
    (o) => o.isoDate === todayIso && o.status !== "ส่งแล้ว",
  ).length;

  function formatRevenue(n: number): string {
    if (n >= 1000000) return `฿${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `฿${(n / 1000).toFixed(0)}K`;
    return `฿${n}`;
  }

  // Open modal for a specific "รอดำเนินการ" order
  function openProcessModal(orderId: string) {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;
    setSelectedOrderId(orderId);
    setFormCustomer(order.customer);
    setFormItems(order.items);
    setFormTotal(order.total.replace("฿", "").replace(/,/g, ""));
    setFormDelivery("");
    setFormNote("");
    setShowModal(true);
  }

  // Confirm processing → change to "รอจัดส่ง"
  function handleConfirmProcess() {
    if (!selectedOrderId) return;

    const now = new Date();
    const deliveryStr = formDelivery
      ? formDelivery
      : formatThaiDateTime(new Date(now.getTime() + 24 * 60 * 60 * 1000));

    const updated = orders.map((o) => {
      if (o.id !== selectedOrderId) return o;
      return {
        ...o,
        customer: formCustomer || o.customer,
        items: formItems || o.items,
        total: formTotal ? `฿${Number(formTotal).toLocaleString()}` : o.total,
        totalNum: formTotal ? Number(formTotal) : o.totalNum,
        delivery: deliveryStr,
        status: "รอจัดส่ง" as OrderStatus,
        statusCls: statusCls("รอจัดส่ง"),
      };
    });

    setOrders(updated);
    saveOrders(updated);
    setShowModal(false);
    setSelectedOrderId(null);
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-start mb-5.5">
        <div>
          <div className="text-[20px] font-extrabold text-n-900 mb-0.75">
            🚚 ขาย & จัดส่ง
          </div>
          <div className="text-[12.5px] text-n-500">
            จัดการออร์เดอร์และติดตามสถานะการจัดส่งแบบ Real-time
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href="/sales/history"
            className="bg-white text-n-800 border-[1.5px] border-n-200 rounded-[9px] px-5 py-2.25 text-[13px] font-semibold hover:border-p-300 hover:text-p-500 transition-all"
          >
            📋 ประวัติออร์เดอร์
          </Link>
          <button className="bg-white text-n-800 border-[1.5px] border-n-200 rounded-[9px] px-5 py-2.25 text-[13px] font-semibold hover:border-p-300 hover:text-p-500 transition-all">
            📥 Export
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-3.75 mb-5">
        {[
          {
            icon: "💰",
            v: formatRevenue(totalRevenue),
            l: "ยอดรวมทั้งหมด",
            sub: `${totalOrders} ออร์เดอร์`,
          },
          {
            icon: "📋",
            v: String(totalOrders),
            l: "ออร์เดอร์ทั้งหมด",
            sub: `${pendingCount} รอดำเนินการ`,
          },
          {
            icon: "🚚",
            v: String(deliveryTodayCount),
            l: "จัดส่งวันนี้",
            sub: deliveryTodayCount > 0 ? "กำลังดำเนินการ" : "ไม่มี",
          },
          {
            icon: "⏳",
            v: String(pendingCount),
            l: "รอดำเนินการ",
            sub: pendingCount > 0 ? "ต้องทำรายการ" : "ไม่มี",
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
            <div className="text-[10.5px] text-n-400 mt-1">{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-[1fr_280px] gap-4.5">
        {/* Orders table */}
        <div className="bg-white rounded-rlg border border-p-100 shadow-[0_1px_3px_rgba(0,0,0,.04)]">
          <div className="px-5 pt-4 pb-3.25 border-b border-n-100 flex items-center justify-between">
            <div className="text-[13.5px] font-bold text-n-900">
              รายการออร์เดอร์
            </div>
            <div className="flex items-center gap-2 bg-n-100 p-0.75 rounded-[10px]">
              {(["ทั้งหมด", "วันนี้", "รอส่ง"] as SalesFilter[]).map((t) => (
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
                    "ออร์เดอร์",
                    "ลูกค้า",
                    "รายการ",
                    "ยอดรวม",
                    "กำหนดส่ง",
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
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-3.25 py-10 text-center text-[12.5px] text-n-400"
                    >
                      {activeFilter === "ทั้งหมด"
                        ? "ยังไม่มีออร์เดอร์"
                        : `ไม่มีออร์เดอร์ในตัวกรอง "${activeFilter}"`}
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
                      <td className="px-3.25 py-2.75 border-b border-n-100">
                        {o.status === "รอดำเนินการ" && (
                          <AnimatedButton>
                            <button
                              onClick={() => openProcessModal(o.id)}
                              className="px-3 py-1.5 bg-linear-to-br from-p-400 to-p-500 text-white rounded-lg text-[11px] font-bold shadow-[0_2px_8px_rgba(244,114,182,.25)] hover:shadow-[0_4px_16px_rgba(244,114,182,.35)] transition-all"
                            >
                              ทำรายการ
                            </button>
                          </AnimatedButton>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Monthly chart */}
        <div className="bg-white rounded-rlg border border-p-100 shadow-[0_1px_3px_rgba(0,0,0,.04)]">
          <div className="px-5 pt-4 pb-3.25 border-b border-n-100">
            <div className="text-[13.5px] font-bold text-n-900">
              📈 ยอดขายรายเดือน
            </div>
            <div className="text-[11px] text-n-500 mt-0.5">ปี 2568</div>
          </div>
          <div className="p-4">
            <div className="flex items-end gap-1 h-30 mb-3">
              {salesChart.map((h, i) => (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-0.75 h-full justify-end"
                >
                  <div
                    className={`w-full rounded-[3px_3px_0_0] ${i === 2 ? "bg-p-500" : "bg-linear-to-t from-p-400 to-p-200"} min-h-0.75`}
                    style={{ height: `${h}%` }}
                  />
                  <div className="text-[7px] text-n-400 whitespace-nowrap">
                    {months[i]}
                  </div>
                </div>
              ))}
            </div>
            <div className="h-px bg-n-100 my-3" />
            <div className="space-y-2">
              {[
                { label: "สูงสุด (ธ.ค.)", val: "฿3.4M", cls: "text-fp-green" },
                { label: "เดือนนี้ (มี.ค.)", val: "฿2.8M", cls: "text-p-500" },
                { label: "เฉลี่ย/เดือน", val: "฿2.6M", cls: "text-n-700" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="flex justify-between items-center"
                >
                  <span className="text-[11px] text-n-500">{s.label}</span>
                  <span className={`text-[13px] font-bold ${s.cls}`}>
                    {s.val}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Process Modal ──────────────────────────────────────────────── */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowModal(false);
          }}
        >
          <div className="bg-white rounded-rlg shadow-2xl w-[460px] max-h-[80vh] flex flex-col">
            {/* Modal header */}
            <div className="px-6 py-4 border-b border-n-100 flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 bg-p-50 rounded-xl flex items-center justify-center text-xl">
                📝
              </div>
              <div>
                <div className="text-[14px] font-extrabold text-n-900">
                  ทำรายการ — {selectedOrderId}
                </div>
                <div className="text-[11px] text-n-400">
                  กรอกรายละเอียดก่อนส่งเข้าคิวจัดส่ง
                </div>
              </div>
            </div>

            {/* Modal body */}
            <div className="px-6 py-5 flex-1 overflow-y-auto space-y-4">
              <div>
                <label className="block text-[12px] font-bold text-n-700 mb-1.5">
                  ชื่อลูกค้า
                </label>
                <input
                  type="text"
                  value={formCustomer}
                  onChange={(e) => setFormCustomer(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border-2 border-n-200 rounded-[9px] text-[13px] font-medium text-n-800 outline-none focus:border-p-400 transition-colors"
                  placeholder="เช่น Makro ลาดพร้าว"
                />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-n-700 mb-1.5">
                  รายการสินค้า
                </label>
                <input
                  type="text"
                  value={formItems}
                  onChange={(e) => setFormItems(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border-2 border-n-200 rounded-[9px] text-[13px] font-medium text-n-800 outline-none focus:border-p-400 transition-colors"
                  placeholder="เช่น สันใน Wagyu 20 กก."
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-bold text-n-700 mb-1.5">
                    ยอดรวม (฿)
                  </label>
                  <input
                    type="number"
                    value={formTotal}
                    onChange={(e) => setFormTotal(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border-2 border-n-200 rounded-[9px] text-[13px] font-medium text-n-800 outline-none focus:border-p-400 transition-colors"
                    placeholder="42000"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-n-700 mb-1.5">
                    กำหนดส่ง
                  </label>
                  <input
                    type="text"
                    value={formDelivery}
                    onChange={(e) => setFormDelivery(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border-2 border-n-200 rounded-[9px] text-[13px] font-medium text-n-800 outline-none focus:border-p-400 transition-colors"
                    placeholder="เช่น 15 มี.ค. 10:00"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-bold text-n-700 mb-1.5">
                  หมายเหตุ (ถ้ามี)
                </label>
                <textarea
                  value={formNote}
                  onChange={(e) => setFormNote(e.target.value)}
                  rows={2}
                  className="w-full px-3.5 py-2.5 bg-white border-2 border-n-200 rounded-[9px] text-[13px] font-medium text-n-800 outline-none focus:border-p-400 transition-colors resize-none"
                  placeholder="เพิ่มเติม..."
                />
              </div>
            </div>

            {/* Modal footer */}
            <div className="px-6 py-4 border-t border-n-100 flex gap-3 shrink-0">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.75 border-2 border-n-200 text-n-600 rounded-r text-[13px] font-semibold hover:border-n-300 hover:bg-n-50 transition-all"
              >
                ยกเลิก
              </button>
              <AnimatedButton className="flex-1 rounded-r">
                <button
                  onClick={handleConfirmProcess}
                  disabled={!formCustomer.trim() || !formItems.trim()}
                  className="w-full py-2.75 bg-linear-to-br from-p-400 to-p-500 text-white rounded-r text-[13px] font-bold shadow-[0_4px_20px_rgba(244,114,182,.2)] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  ✅ ยืนยันและส่งเข้าคิว
                </button>
              </AnimatedButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

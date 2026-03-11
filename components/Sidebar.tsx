"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BullLogo from "./BullLogo";

type NavItem = {
  href: string;
  icon: string;
  label: string;
  badge?: string;
};

type NavGroup = {
  section: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    section: "ภาพรวม",
    items: [{ href: "/dashboard", icon: "📊", label: "Dashboard" }],
  },
  {
    section: "กระบวนการผลิต",
    items: [
      { href: "/sourcing", icon: "🔍", label: "จัดหา", badge: "AI" },
      { href: "/intake", icon: "📦", label: "รับเข้า" },
      { href: "/production", icon: "🏭", label: "ผลิต" },
      { href: "/qc", icon: "🔬", label: "ตรวจ QC", badge: "AI" },
      { href: "/warehouse", icon: "🏪", label: "คลัง" },
      { href: "/sales", icon: "🚚", label: "ขาย & ส่ง" },
    ],
  },
  {
    section: "ระบบ",
    items: [
      { href: "/reports", icon: "📑", label: "รายงาน" },
      { href: "/settings", icon: "⚙️", label: "ตั้งค่าโรงงาน" },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-62 h-full bg-n-900 flex flex-col shrink-0 overflow-y-auto overflow-x-hidden">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-white/6">
        <BullLogo size={34} />
        <span className="text-[18.5px] font-extrabold text-white">
          Fresh<b className="text-p-400">Pro</b>
        </span>
      </div>

      {/* Navigation groups */}
      {navGroups.map((group, gi) => (
        <div key={gi}>
          {gi > 0 && <div className="h-px bg-white/6 mx-2.5 my-2.25" />}
          <div className="px-2.5 pt-3.5 pb-1.5">
            <div className="text-white/22 text-[9px] font-bold tracking-[1.3px] uppercase px-2 mb-1">
              {group.section}
            </div>
            {group.items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={[
                    "flex items-center gap-2.5 px-2.5 py-2.25 rounded-[10px]",
                    "text-[13px] font-medium mb-0.5 relative select-none",
                    isActive
                      ? "bg-[rgba(244,114,182,.14)] text-p-300"
                      : "text-white/42 hover:bg-white/5 hover:text-white/78",
                  ].join(" ")}
                >
                  {isActive && (
                    <span className="absolute left-0 top-[22%] bottom-[22%] w-0.75 bg-p-400 rounded-[0_3px_3px_0]" />
                  )}
                  <span className="text-[15px] w-5 flex items-center justify-center shrink-0">
                    {item.icon}
                  </span>
                  {item.label}
                  {item.badge && (
                    <span className="ml-auto bg-p-500 text-white text-[9.5px] font-bold px-1.75 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      ))}

      {/* User card */}
      <div className="mt-auto px-2.5 py-3.25 border-t border-white/6">
        <motion.div
          className="flex items-center gap-2.5 p-2.25 rounded-[10px] bg-white/4 cursor-pointer"
          whileHover={{ backgroundColor: "rgba(255,255,255,0.08)" }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <div className="w-8.5 h-8.5 rounded-[9px] bg-linear-to-br from-p-400 to-p-500 flex items-center justify-center text-white text-[13px] font-bold shrink-0">
            สม
          </div>
          <div>
            <div className="text-white text-[12.5px] font-semibold">
              สมชาย มีดี
            </div>
            <div className="text-white/30 text-[10.5px]">ผู้จัดการโรงงาน</div>
          </div>
        </motion.div>
      </div>
    </aside>
  );
}

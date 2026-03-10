'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import BullLogo from './BullLogo';

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
    section: 'ภาพรวม',
    items: [{ href: '/dashboard', icon: '📊', label: 'Dashboard' }],
  },
  {
    section: 'กระบวนการผลิต',
    items: [
      { href: '/sourcing', icon: '🔍', label: 'จัดหา', badge: 'AI' },
      { href: '/intake', icon: '📦', label: 'รับเข้า' },
      { href: '/production', icon: '🏭', label: 'ผลิต' },
      { href: '/qc', icon: '🔬', label: 'ตรวจ QC', badge: 'AI' },
      { href: '/warehouse', icon: '🏪', label: 'คลัง' },
      { href: '/sales', icon: '🚚', label: 'ขาย & ส่ง' },
    ],
  },
  {
    section: 'ระบบ',
    items: [
      { href: '#', icon: '📑', label: 'รายงาน' },
      { href: '#', icon: '⚙️', label: 'ตั้งค่าโรงงาน' },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[248px] h-full bg-n-900 flex flex-col flex-shrink-0 overflow-y-auto overflow-x-hidden">
      {/* Logo */}
      <div className="flex items-center gap-[10px] px-4 py-5 border-b border-white/[.06]">
        <BullLogo size={34} />
        <span className="text-[18.5px] font-extrabold text-white">
          Fresh<b className="text-p-400">Pro</b>
        </span>
      </div>

      {/* Navigation groups */}
      {navGroups.map((group, gi) => (
        <div key={gi}>
          {gi > 0 && (
            <div className="h-px bg-white/[.06] mx-[10px] my-[9px]" />
          )}
          <div className="px-[10px] pt-[14px] pb-[6px]">
            <div className="text-white/[.22] text-[9px] font-bold tracking-[1.3px] uppercase px-2 mb-1">
              {group.section}
            </div>
            {group.items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={[
                    'flex items-center gap-[10px] px-[10px] py-[9px] rounded-[10px]',
                    'text-[13px] font-medium transition-all duration-200 mb-0.5 relative select-none',
                    isActive
                      ? 'bg-[rgba(244,114,182,.14)] text-p-300'
                      : 'text-white/[.42] hover:bg-white/[.05] hover:text-white/[.78]',
                  ].join(' ')}
                >
                  {isActive && (
                    <span className="absolute left-0 top-[22%] bottom-[22%] w-[3px] bg-p-400 rounded-[0_3px_3px_0]" />
                  )}
                  <span className="text-[15px] w-5 flex items-center justify-center flex-shrink-0">
                    {item.icon}
                  </span>
                  {item.label}
                  {item.badge && (
                    <span className="ml-auto bg-p-500 text-white text-[9.5px] font-bold px-[7px] py-[2px] rounded-full">
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
      <div className="mt-auto px-[10px] py-[13px] border-t border-white/[.06]">
        <div className="flex items-center gap-[10px] p-[9px] rounded-[10px] bg-white/[.04] cursor-pointer hover:bg-white/[.08] transition-colors">
          <div className="w-[34px] h-[34px] rounded-[9px] bg-gradient-to-br from-p-400 to-p-500 flex items-center justify-center text-white text-[13px] font-bold flex-shrink-0">
            สม
          </div>
          <div>
            <div className="text-white text-[12.5px] font-semibold">สมชาย มีดี</div>
            <div className="text-white/30 text-[10.5px]">ผู้จัดการโรงงาน</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

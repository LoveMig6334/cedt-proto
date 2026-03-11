import type { Metadata } from 'next';
import Link from 'next/link';
import BullLogo from '@/components/BullLogo';
import { AnimatedButton } from '@/components/motion/AnimatedButton';

export const metadata: Metadata = {
  title: 'เข้าสู่ระบบ | FreshPro',
};

const checks = [
  'จัดหาผู้จัดส่งด้วย AI อัตโนมัติ',
  'ตรวจสอบคุณภาพด้วย Computer Vision',
  'ติดตามกระบวนการผลิตแบบ Real-time',
  'Dashboard วิเคราะห์ยอดขายอัตโนมัติ',
];

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* ── Left panel ── */}
      <div className="flex-1 bg-n-900 flex items-center justify-center p-14 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-[420px] h-[420px] bg-[radial-gradient(circle,rgba(244,114,182,.12)_0%,transparent_65%)]" />
        <div className="absolute -bottom-[60px] -left-[60px] w-[360px] h-[360px] bg-[radial-gradient(circle,rgba(244,114,182,.07)_0%,transparent_65%)]" />

        <div className="relative z-10 text-center max-w-[340px]">
          <div className="flex flex-col items-center gap-3 mb-7">
            <BullLogo size={72} />
            <div className="text-[32px] font-extrabold text-white">
              Fresh<b className="text-p-400">Pro</b>
            </div>
          </div>
          <p className="text-white/45 text-sm leading-[1.7] mb-8">
            ระบบบริหารจัดการโรงงานแปรรูปเนื้อวัวครบวงจร<br />
            พร้อม AI อัจฉริยะ
          </p>
          <div className="flex flex-col gap-[13px] text-left">
            {checks.map((check) => (
              <div key={check} className="flex items-center gap-[11px] text-white/60 text-[13px]">
                <span className="w-[23px] h-[23px] rounded-full bg-[rgba(244,114,182,.18)] flex items-center justify-center text-p-400 text-[11px] flex-shrink-0">
                  ✓
                </span>
                {check}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right form ── */}
      <div className="flex-1 flex items-center justify-center p-14 bg-cream">
        <div className="w-full max-w-[400px]">
          <div className="text-[26px] font-extrabold text-n-900 mb-[5px]">ยินดีต้อนรับกลับ 👋</div>
          <div className="text-[13.5px] text-n-500 mb-[30px]">
            เข้าสู่ระบบ FreshPro เพื่อจัดการโรงงานของคุณ
          </div>

          <div className="mb-[17px]">
            <label className="block text-[12.5px] font-semibold text-n-700 mb-[7px]">อีเมล</label>
            <input
              type="email"
              placeholder="admin@freshpro.th"
              className="w-full px-[14px] py-[11px] bg-white border-2 border-n-200 rounded-r font-sans text-[13px] text-n-800 outline-none transition-all focus:border-p-400 focus:shadow-[0_0_0_4px_rgba(244,114,182,.08)] placeholder:text-n-300"
            />
          </div>

          <div className="mb-[17px]">
            <label className="block text-[12.5px] font-semibold text-n-700 mb-[7px]">รหัสผ่าน</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-[14px] py-[11px] bg-white border-2 border-n-200 rounded-r font-sans text-[13px] text-n-800 outline-none transition-all focus:border-p-400 focus:shadow-[0_0_0_4px_rgba(244,114,182,.08)] placeholder:text-n-300"
            />
          </div>

          <div className="flex justify-between items-center mb-[22px]">
            <label className="flex items-center gap-[7px] text-[12.5px] text-n-600 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-[15px] h-[15px] accent-p-500" />
              จดจำการเข้าสู่ระบบ
            </label>
            <a href="#" className="text-p-500 text-[12.5px] font-medium">ลืมรหัสผ่าน?</a>
          </div>

          <AnimatedButton
            className="w-full rounded-r mb-4"
            hoverShadow="0 8px 28px rgba(244,114,182,.4)"
          >
            <Link
              href="/dashboard"
              className="block w-full py-[13px] bg-gradient-to-br from-p-400 to-p-500 text-white text-center rounded-r text-[15px] font-bold shadow-[0_4px_20px_rgba(244,114,182,.25)]"
            >
              เข้าสู่ระบบ
            </Link>
          </AnimatedButton>

          <div className="text-center text-[13px] text-n-500">
            ยังไม่มีบัญชี?{' '}
            <a href="#" className="text-p-500 font-semibold">สมัครใช้งานฟรี</a>
            {' · หรือ '}
            <a href="#" className="text-p-500 font-semibold">ตั้งค่าโรงงานใหม่</a>
          </div>
        </div>
      </div>
    </div>
  );
}

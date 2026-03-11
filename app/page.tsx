import Link from 'next/link';
import BullLogo from '@/components/BullLogo';
import { AnimatedBullLogo } from '@/components/motion/AnimatedBullLogo';
import { AnimatedButton } from '@/components/motion/AnimatedButton';
import { AnimatedCard } from '@/components/motion/AnimatedCard';
import { HeroMockup } from '@/components/motion/HeroMockup';

const heroStats = [
  { value: '200+', label: 'โรงงานที่ใช้งาน' },
  { value: '98.5%', label: 'ความแม่นยำ AI QC' },
  { value: '24/7', label: 'ระบบซัพพอร์ต' },
];

const processSteps = [
  { icon: '🔍', label: 'จัดหา', sub: 'AI Sourcing' },
  { icon: '📦', label: 'รับเข้า', sub: 'Intake Record' },
  { icon: '🏭', label: 'ผลิต', sub: 'Production' },
  { icon: '🔬', label: 'ตรวจ QC', sub: 'AI Quality' },
  { icon: '🏪', label: 'คลัง', sub: 'Warehouse' },
  { icon: '🚚', label: 'ขาย & ส่ง', sub: 'Sales & Delivery' },
];

const features = [
  {
    icon: '🤖',
    title: 'AI จัดหาผู้จัดส่ง',
    desc: 'ใช้ AI วิเคราะห์และแนะนำผู้จัดส่งที่เหมาะสม เปรียบเทียบราคา คุณภาพ และความเชื่อถือได้แบบอัตโนมัติ',
  },
  {
    icon: '📸',
    title: 'บันทึกพร้อมรูปภาพ',
    desc: 'บันทึกการรับเข้าพร้อม timestamp และรูปภาพ สามารถวิเคราะห์ยอดรายเดือนได้ทันที',
  },
  {
    icon: '⚙️',
    title: 'ควบคุมการผลิต',
    desc: 'เบิกวัตถุดิบจาก Stock บันทึกผลผลิตและของเสียแบบ Real-time พร้อมรายงานประสิทธิภาพ',
  },
  {
    icon: '🔬',
    title: 'AI ตรวจสอบคุณภาพ',
    desc: 'Computer Vision วิเคราะห์ความสมบูรณ์ชิ้นเนื้อทุกชิ้น ความแม่นยำ 98.5% ลดปัญหา Human Error',
  },
  {
    icon: '🤝',
    title: 'Match ผู้ซื้อ-สินค้า',
    desc: 'ระบบ Match สินค้าในคลังกับผู้ซื้ออัตโนมัติ บริหารสต็อกและติดตามสถานะแบบ Live',
  },
  {
    icon: '📊',
    title: 'วิเคราะห์ยอดขาย',
    desc: 'Dashboard วิเคราะห์ยอดขาย ดู trend รายวัน รายสัปดาห์ รายเดือน Export รายงานได้ทันที',
  },
];


export default function LandingPage() {
  return (
    <div>
      {/* ── Navbar ── */}
      <nav className="flex items-center justify-between px-16 py-5 relative z-10">
        <div className="flex items-center gap-[11px]">
          <AnimatedBullLogo size={42} />
          <span className="text-[22px] font-extrabold text-n-900">
            Fresh<b className="text-p-500">Pro</b>
          </span>
        </div>
        <div className="flex items-center gap-7">
          <a href="#features" className="text-n-700 text-sm font-medium hover:text-p-500 transition-colors">
            ฟีเจอร์
          </a>
          <a href="#process" className="text-n-700 text-sm font-medium hover:text-p-500 transition-colors">
            กระบวนการ
          </a>
          <AnimatedButton>
            <Link
              href="/login"
              className="bg-white text-n-800 border-[1.5px] border-n-200 rounded-[9px] px-5 py-[9px] text-[13px] font-semibold flex items-center gap-1.5 hover:border-p-300 hover:text-p-500"
            >
              เข้าสู่ระบบ
            </Link>
          </AnimatedButton>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="min-h-[calc(100vh-74px)] flex items-center px-16 py-10 gap-[72px] relative overflow-hidden">
        <div className="absolute -top-20 -right-[120px] w-[680px] h-[680px] bg-[radial-gradient(circle,#FCE7F3_0%,transparent_60%)] pointer-events-none" />
        <div className="absolute -bottom-[120px] -left-[60px] w-[480px] h-[480px] bg-[radial-gradient(circle,rgba(244,114,182,.07)_0%,transparent_65%)] pointer-events-none" />

        {/* Left */}
        <div className="flex-1 max-w-[580px] relative z-10">
          
          <h1 className="text-[52px] font-extrabold leading-[1.12] text-n-900 mb-5 tracking-[-1.5px]">
            บริหารจัดการ<br />
            โรงงานเนื้อวัว<br />
            <span className="text-p-500">อัจฉริยะ</span>
          </h1>

          <p className="text-[15.5px] text-n-500 leading-[1.8] mb-[34px]">
            ระบบจัดการครบวงจร ตั้งแต่จัดหาวัตถุดิบ ควบคุมกระบวนการผลิต<br />
            ตรวจสอบคุณภาพด้วย AI จนถึงส่งมอบสินค้าให้ลูกค้า
          </p>

          <div className="flex gap-[13px] items-center mb-11">
            <AnimatedButton
              className="rounded-r"
              hoverY={-3}
              hoverShadow="0 14px 35px rgba(244,114,182,.45)"
            >
              <Link
                href="/login"
                className="bg-gradient-to-br from-p-400 to-p-500 text-white rounded-r px-[34px] py-[15px] text-[15px] font-bold shadow-[0_4px_20px_rgba(244,114,182,.25)]"
              >
                เริ่มต้นใช้งานฟรี
              </Link>
            </AnimatedButton>
            <AnimatedButton>
              <button className="bg-white text-n-800 border-2 border-n-200 rounded-r px-[34px] py-[15px] text-[15px] font-bold hover:border-p-300 hover:text-p-500">
                ชมตัวอย่างระบบ ▶
              </button>
            </AnimatedButton>
          </div>

          <div className="flex items-center gap-9">
            {heroStats.map((stat, i) => (
              <div key={stat.label} className="flex items-center gap-9">
                {i > 0 && <div className="w-px h-8 bg-n-200" />}
                <div>
                  <div className="text-[28px] font-extrabold text-n-900">{stat.value}</div>
                  <div className="text-[11.5px] text-n-500 mt-0.5">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — browser mockup */}
        <div className="flex-1 flex justify-center items-center relative z-10">
          <HeroMockup />
        </div>
      </section>

      {/* ── Process Flow ── */}
      <div id="process" className="px-16 py-[72px] bg-cream">
        <h2 className="text-center text-[34px] font-extrabold text-n-900 mb-[10px]">
          ครอบคลุมทุกขั้นตอนการผลิต
        </h2>
        <p className="text-center text-n-500 text-[14.5px] mb-[52px]">
          ระบบเดียวที่จัดการกระบวนการทั้งหมดของโรงงานแปรรูปเนื้อวัว ตั้งแต่ต้นน้ำถึงปลายน้ำ
        </p>
        <div className="flex justify-between items-start max-w-[900px] mx-auto relative">
          <div className="absolute top-[26px] left-[52px] right-[52px] h-[2px] bg-gradient-to-r from-p-200 via-p-400 to-p-200 z-0" />
          {processSteps.map((step) => (
            <div key={step.label} className="flex flex-col items-center gap-[10px] flex-1 relative z-10">
              <div className="w-[52px] h-[52px] rounded-full bg-p-500 border-[2.5px] border-p-500 flex items-center justify-center text-xl shadow-[0_0_0_6px_#FFF0F7,0_4px_20px_rgba(244,114,182,.25)]">
                {step.icon}
              </div>
              <div className="text-xs font-semibold text-p-500 text-center">{step.label}</div>
              <div className="text-[10.5px] text-n-400 text-center">{step.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Features Grid ── */}
      <div id="features" className="bg-white px-16 py-[72px]">
        <h2 className="text-center text-[34px] font-extrabold text-n-900 mb-[10px]">
          ฟีเจอร์เด่นของ FreshPro
        </h2>
        <p className="text-center text-n-500 text-[14.5px] mb-[52px]">
          ออกแบบมาเพื่อโรงงานแปรรูปเนื้อวัวโดยเฉพาะ ครบทุกฟังก์ชันในระบบเดียว
        </p>
        <div className="grid grid-cols-3 gap-[22px] max-w-[1080px] mx-auto">
          {features.map((feat) => (
            <AnimatedCard
              key={feat.title}
              className="bg-cream border border-p-100 rounded-rlg p-[28px_22px] hover:border-p-300"
              hoverY={-6}
              hoverShadow="0 12px 28px rgba(0,0,0,0.08),0 4px 10px rgba(0,0,0,0.04)"
            >
              <div className="w-[50px] h-[50px] bg-p-100 rounded-[13px] flex items-center justify-center text-[22px] mb-4">
                {feat.icon}
              </div>
              <div className="text-[16.5px] font-bold text-n-900 mb-[7px]">{feat.title}</div>
              <div className="text-[13px] text-n-500 leading-[1.65]">{feat.desc}</div>
            </AnimatedCard>
          ))}
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="bg-n-900 px-16 py-9 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <BullLogo size={32} />
          <span className="text-[22px] font-extrabold text-white">
            Fresh<b className="text-p-400">Pro</b>
          </span>
        </div>
        <span className="text-[12.5px] text-white/35">© 2025 FreshPro. สงวนลิขสิทธิ์ทุกกรณี</span>
        <div className="flex gap-4">
          <a href="#" className="text-white/40 text-[12.5px] hover:text-p-400 transition-colors">Privacy</a>
          <a href="#" className="text-white/40 text-[12.5px] hover:text-p-400 transition-colors">Terms</a>
          <a href="#" className="text-white/40 text-[12.5px] hover:text-p-400 transition-colors">Contact</a>
        </div>
      </footer>
    </div>
  );
}

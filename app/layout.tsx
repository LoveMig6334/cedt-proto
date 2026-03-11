import type { Metadata } from 'next';
import { Kodchasan } from 'next/font/google';
import './globals.css';

const kodchasan = Kodchasan({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin', 'thai'],
  variable: '--font-kodchasan',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'FreshPro — ระบบจัดการโรงงานแปรรูปเนื้อสัตว์',
  description:
    'ระบบจัดการครบวงจร ตั้งแต่จัดหาวัตถุดิบ ควบคุมกระบวนการผลิต ตรวจสอบคุณภาพด้วย AI จนถึงส่งมอบสินค้าให้ลูกค้า',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className={`${kodchasan.variable} font-sans bg-cream text-n-800 overflow-x-hidden antialiased`}>
        {children}
      </body>
    </html>
  );
}

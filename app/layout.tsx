import type { Metadata } from 'next';
import { Prompt } from 'next/font/google';
import './globals.css';

const prompt = Prompt({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin', 'thai'],
  variable: '--font-prompt',
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
      <body className={`${prompt.variable} font-sans bg-cream text-n-800 overflow-x-hidden antialiased`}>
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { QCClient } from "./QCClient";

export const metadata: Metadata = { title: "ตรวจสอบคุณภาพ | FreshPro" };

export default function QCPage() {
  return <QCClient />;
}

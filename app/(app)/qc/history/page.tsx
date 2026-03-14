import type { Metadata } from "next";
import { QCHistoryClient } from "./QCHistoryClient";

export const metadata: Metadata = { title: "ประวัติตรวจ QC | FreshPro" };

export default function QCHistoryPage() {
  return <QCHistoryClient />;
}

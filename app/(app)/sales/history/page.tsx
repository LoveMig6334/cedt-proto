import type { Metadata } from "next";
import { SalesHistoryClient } from "./SalesHistoryClient";

export const metadata: Metadata = { title: "ประวัติออร์เดอร์ | FreshPro" };

export default function SalesHistoryPage() {
  return <SalesHistoryClient />;
}

import type { Metadata } from "next";
import { SalesClient } from "./SalesClient";

export const metadata: Metadata = { title: "ขาย & จัดส่ง | FreshPro" };

export default function SalesPage() {
  return <SalesClient />;
}

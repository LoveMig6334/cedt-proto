import type { Metadata } from "next";
import { IntakeClient } from "./IntakeClient";

export const metadata: Metadata = { title: "รับเข้าวัตถุดิบ | FreshPro" };

export default function IntakePage() {
  return <IntakeClient />;
}

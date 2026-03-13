import type { Metadata } from "next";
import { SourcingClient } from "./SourcingClient";

export const metadata: Metadata = { title: "จัดหาวัตถุดิบ | FreshPro" };

export default function SourcingPage() {
  return <SourcingClient />;
}

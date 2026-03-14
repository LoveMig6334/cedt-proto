import type { Metadata } from "next";
import { ProductionClient } from "./ProductionClient";

export const metadata: Metadata = { title: "ควบคุมการผลิต | FreshPro" };

export default function ProductionPage() {
  return <ProductionClient />;
}

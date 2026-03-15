import type { Metadata } from "next";
import { WarehouseClient } from "./WarehouseClient";

export const metadata: Metadata = { title: "คลังสินค้า | FreshPro" };

export default function WarehousePage() {
  return <WarehouseClient />;
}

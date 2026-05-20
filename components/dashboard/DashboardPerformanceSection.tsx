"use client";

import type {
  ProductPerformanceData,
  StorePerformanceData,
} from "@/types/dashboard";
import { ProductPerformanceRow } from "./ProductPerformanceRow";
import { StorePerformanceRow } from "./StorePerformanceRow";

export function DashboardPerformanceSection({
  storePerformance,
  productPerformance,
}: {
  storePerformance: StorePerformanceData;
  productPerformance: ProductPerformanceData;
}) {
  return (
    <div className="dashboard-performance-section">
      <StorePerformanceRow data={storePerformance} />
      <ProductPerformanceRow data={productPerformance} />
    </div>
  );
}

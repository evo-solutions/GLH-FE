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
  storePerformance: StorePerformanceData | null;
  productPerformance: ProductPerformanceData;
}) {
  return (
    <div className="dashboard-performance-section">
      {storePerformance ? <StorePerformanceRow data={storePerformance} /> : null}
      <ProductPerformanceRow data={productPerformance} />
    </div>
  );
}

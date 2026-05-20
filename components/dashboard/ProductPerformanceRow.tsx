"use client";

import { useTranslations } from "next-intl";
import type { ProductPerformanceData, ProductPerformanceRow } from "@/types/dashboard";
import { DashboardMiniTable } from "./DashboardMiniTable";

function productColumns(t: (key: string) => string) {
  return [
    {
      key: "product",
      title: t("colProduct"),
      cellClass: "dashboard-mini-table-cell--primary",
      render: (row: ProductPerformanceRow) => (
        <span className="dashboard-mini-table-code">{row.productName}</span>
      ),
    },
    {
      key: "revenue",
      title: t("colRevenue"),
      align: "center" as const,
      render: (row: ProductPerformanceRow) => row.revenue,
    },
    {
      key: "customers",
      title: t("colCustomers"),
      align: "center" as const,
      render: (row: ProductPerformanceRow) => row.customerCount,
    },
  ];
}

export function ProductPerformanceRow({ data }: { data: ProductPerformanceData }) {
  const t = useTranslations("dashboard.productPerformance");
  const columns = productColumns(t);

  return (
    <section className="dashboard-performance-block">
      <div className="dashboard-tables-row">
        <DashboardMiniTable
          title={t("topSku")}
          columns={columns}
          rows={data.topProducts}
          getRowKey={(row) => row.id}
        />
        <DashboardMiniTable
          title={t("deadSku")}
          columns={columns}
          rows={data.deadProducts}
          getRowKey={(row) => row.id}
        />
      </div>
    </section>
  );
}

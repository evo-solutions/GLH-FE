"use client";

import { useTranslations } from "next-intl";
import type { StorePerformanceData, StorePerformanceRow } from "@/types/dashboard";
import { DashboardMiniTable } from "./DashboardMiniTable";

function growthClass(pct: number) {
  if (pct > 0) return "dashboard-growth dashboard-growth--up";
  if (pct < 0) return "dashboard-growth dashboard-growth--down";
  return "dashboard-growth";
}

function storeColumns(t: (key: string) => string) {
  return [
    {
      key: "store",
      title: t("colStore"),
      cellClass: "dashboard-mini-table-cell--primary",
      render: (row: StorePerformanceRow) => (
        <span className="dashboard-mini-table-code">{row.storeCode}</span>
      ),
    },
    {
      key: "revenue",
      title: t("colRevenue"),
      align: "center" as const,
      render: (row: StorePerformanceRow) => row.revenue,
    },
    {
      key: "cost",
      title: t("colCost"),
      align: "center" as const,
      render: (row: StorePerformanceRow) => row.cost,
    },
    {
      key: "growth",
      title: t("colGrowth"),
      align: "center" as const,
      render: (row: StorePerformanceRow) => (
        <span className={growthClass(row.growthPct)}>{row.growth}</span>
      ),
    },
  ];
}

function importCompanyColumns(t: (key: string) => string) {
  return [
    {
      key: "company",
      title: t("colCompany"),
      cellClass: "dashboard-mini-table-cell--primary",
      render: (row: StorePerformanceRow) => (
        <span className="dashboard-mini-table-code">{row.storeCode}</span>
      ),
    },
    {
      key: "importValue",
      title: t("colImportValue"),
      align: "center" as const,
      render: (row: StorePerformanceRow) => row.revenue,
    },
    {
      key: "importOrders",
      title: t("colImportOrders"),
      align: "center" as const,
      render: (row: StorePerformanceRow) => row.cost,
    },
    {
      key: "change",
      title: t("colChange"),
      align: "center" as const,
      render: (row: StorePerformanceRow) => (
        <span className={growthClass(row.growthPct)}>{row.growth}</span>
      ),
    },
  ];
}

export function StorePerformanceRow({ data }: { data: StorePerformanceData }) {
  const t = useTranslations("dashboard.storePerformance");

  if (data.variant === "stores") {
    return (
      <section className="dashboard-performance-block">
        <div className="dashboard-tables-row">
          <DashboardMiniTable
            title={t("topStores")}
            columns={storeColumns(t)}
            rows={data.topStores}
            getRowKey={(row) => row.id}
          />
          <DashboardMiniTable
            title={t("worstStores")}
            columns={storeColumns(t)}
            rows={data.worstStores}
            getRowKey={(row) => row.id}
          />
        </div>
      </section>
    );
  }

  return (
    <section className="dashboard-performance-block">
      <div className="dashboard-tables-row">
        <DashboardMiniTable
          title={t("topImportCompanies")}
          columns={importCompanyColumns(t)}
          rows={data.topImportCompanies}
          getRowKey={(row) => row.id}
        />
        <DashboardMiniTable
          title={t("lowImportCompanies")}
          columns={importCompanyColumns(t)}
          rows={data.lowImportCompanies}
          getRowKey={(row) => row.id}
        />
      </div>
    </section>
  );
}

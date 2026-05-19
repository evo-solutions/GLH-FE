"use client";

import { useEffect, useRef } from "react";
import type { Chart as ChartType } from "chart.js";
import {
  CalendarOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { Spin, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useTranslations } from "next-intl";
import { useLocationStaffCosts } from "@/hooks/useLocation";
import { defaultTablePagination, tableScroll } from "@/lib/tablePagination";
import type { LocationCostLine, LocationTeamMember } from "@/types/location";
import { useThemeContext } from "@/libs/theme/ThemeProvider";
import {
  chartDoughnutLabelsPlugin,
  chartValueLabelsPlugin,
  compactChartOptions,
  readThemeColor,
} from "@/components/dashboard/chartOptions";

function managerInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(-2)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase();
}

export function StaffCostsTab({
  locationId,
  enabled,
}: {
  locationId: string;
  enabled: boolean;
}) {
  const t = useTranslations("location.staffCosts");
  const tRoot = useTranslations("location");
  const { data, isLoading, isError } = useLocationStaffCosts(locationId, enabled);
  const chartRef = useRef<ChartType | null>(null);
  const { theme } = useThemeContext();

  useEffect(() => {
    if (!enabled || !data) return;
    let cancelled = false;

    (async () => {
      const { default: Chart } = await import("chart.js/auto");
      if (cancelled) return;
      Chart.register(chartValueLabelsPlugin, chartDoughnutLabelsPlugin);
      chartRef.current?.destroy();

      const el = document.getElementById("loc-staff-cost-chart") as HTMLCanvasElement | null;
      if (!el) return;

      const pharma = readThemeColor("--pharma", "#0d6e8d");
      const gold = readThemeColor("--gold", "#c9a94f");
      const leaf = readThemeColor("--leaf", "#1b5e3c");

      chartRef.current = new Chart(el, {
        type: "doughnut",
        data: {
          labels: data.costs.chart.labels,
          datasets: [
            {
              data: data.costs.chart.values,
              backgroundColor: [pharma, gold, leaf],
              borderWidth: 0,
            },
          ],
        },
        options: compactChartOptions("doughnut"),
        plugins: [chartDoughnutLabelsPlugin],
      } as ConstructorParameters<typeof Chart>[1]) as ChartType;
    })();

    return () => {
      cancelled = true;
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [data, theme, enabled]);

  const staffColumns: ColumnsType<LocationTeamMember> = [
    { title: t("name"), dataIndex: "name" },
    { title: t("role"), dataIndex: "role" },
    { title: t("phone"), dataIndex: "phone" },
    { title: t("shift"), dataIndex: "shift" },
    { title: t("salary"), dataIndex: "salary", width: 100 },
    {
      title: t("status"),
      dataIndex: "status",
      width: 90,
      render: (s: LocationTeamMember["status"]) => (
        <Tag color={s === "active" ? "success" : "default"}>
          {s === "active" ? t("active") : t("leave")}
        </Tag>
      ),
    },
  ];

  const costColumns: ColumnsType<LocationCostLine> = [
    { title: t("costName"), dataIndex: "name", ellipsis: true },
    { title: t("amount"), dataIndex: "amount", width: 110 },
    { title: t("note"), dataIndex: "note", ellipsis: true, render: (n) => n ?? "—" },
  ];

  if (!enabled) return null;

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spin />
      </div>
    );
  }

  if (isError || !data) {
    return <p className="text-muted text-center py-12">{tRoot("error")}</p>;
  }

  return (
    <>
      <div className="location-kpi-grid">
        <div className="location-kpi-card">
          <div className="location-kpi-label">{t("fixedTotal")}</div>
          <div className="location-kpi-value text-base">{data.costs.summary.fixedTotal}</div>
        </div>
        <div className="location-kpi-card">
          <div className="location-kpi-label">{t("variableTotal")}</div>
          <div className="location-kpi-value text-base">{data.costs.summary.variableTotal}</div>
        </div>
        <div className="location-kpi-card">
          <div className="location-kpi-label">{t("payrollTotal")}</div>
          <div className="location-kpi-value text-base">{data.costs.summary.payrollTotal}</div>
        </div>
        <div className="location-kpi-card">
          <div className="location-kpi-label">{t("monthlyTotal")}</div>
          <div className="location-kpi-value">{data.costs.summary.monthlyTotal}</div>
        </div>
      </div>

      <div className="location-split-row location-split-row--insights">
        <div className="location-chart-panel location-insights-chart">
          <h4 className="location-insights-heading">{t("costBreakdown")}</h4>
          <div className="location-chart-wrap location-chart-wrap--insights">
            <canvas id="loc-staff-cost-chart" />
          </div>
        </div>
        <div className="location-insights-side">
          <section className="location-insight-card location-manager-insight">
            <h4 className="location-insights-heading">{t("manager")}</h4>
            <div className="location-manager-profile">
              <div className="location-manager-avatar" aria-hidden>
                {managerInitials(data.manager.name)}
              </div>
              <div className="location-manager-body">
                <p className="location-manager-name">{data.manager.name}</p>
                <span className="location-manager-role">{data.manager.title}</span>
                <ul className="location-manager-meta">
                  <li>
                    <PhoneOutlined />
                    <span>{data.manager.phone}</span>
                  </li>
                  <li>
                    <MailOutlined />
                    <span>{data.manager.email}</span>
                  </li>
                  <li>
                    <CalendarOutlined />
                    <span>
                      {t("since")} {data.manager.since}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </section>
          <section className="location-insight-card location-staff-insight">
            <h4 className="location-insights-heading">{t("summary")}</h4>
            <div className="location-staff-stat-grid">
              <div className="location-staff-stat">
                <span className="location-staff-stat-value">{data.summary.total}</span>
                <span className="location-staff-stat-label">{t("totalStaff")}</span>
              </div>
              <div className="location-staff-stat location-staff-stat--active">
                <span className="location-staff-stat-value">{data.summary.onShift}</span>
                <span className="location-staff-stat-label">{t("onShift")}</span>
              </div>
              <div className="location-staff-stat location-staff-stat--leave">
                <span className="location-staff-stat-value">{data.summary.onLeave}</span>
                <span className="location-staff-stat-label">{t("onLeave")}</span>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="location-split-row location-split-row--tables">
        <div className="location-panel">
          <h4 className="m-0 mb-3 text-sm font-semibold">{t("fixedCosts")}</h4>
          <Table size="small" className="gl-table-scroll" rowKey="id" columns={costColumns} dataSource={data.costs.fixed} pagination={defaultTablePagination} scroll={tableScroll()} />
        </div>
        <div className="location-panel">
          <h4 className="m-0 mb-3 text-sm font-semibold">{t("variableCosts")}</h4>
          <Table size="small" className="gl-table-scroll" rowKey="id" columns={costColumns} dataSource={data.costs.variable} pagination={defaultTablePagination} scroll={tableScroll()} />
        </div>
      </div>

      <div className="location-panel mt-3">
        <h4 className="m-0 mb-3 text-sm font-semibold">{t("staffList")}</h4>
        <Table
          size="small"
          rowKey="id"
          columns={staffColumns}
          dataSource={data.staff}
          pagination={defaultTablePagination}
          className="gl-table-scroll"
          scroll={tableScroll(700)}
        />
      </div>
    </>
  );
}

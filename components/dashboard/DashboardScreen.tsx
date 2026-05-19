"use client";

import type { ReactNode } from "react";
import {
  AlertOutlined,
  BellOutlined,
  DollarOutlined,
  TeamOutlined,
  TruckOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Card, Col, Row, Spin, Statistic, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useTranslations } from "next-intl";
import { useDashboardOverview } from "@/hooks/useDashboard";
import { defaultTablePagination, tableScroll } from "@/lib/tablePagination";
import type { DashboardAlert, DashboardKpi } from "@/types/dashboard";
import { useDashboardCharts } from "./useDashboardCharts";
import { CustomerCountChartPanel } from "./CustomerCountChartPanel";
import { DemandInsightsRow } from "./DemandInsightsRow";
import { RevenueChartPanel } from "./RevenueChartPanel";
import "./dashboard.css";

const kpiIcons: Record<string, ReactNode> = {
  vendors: <TruckOutlined />,
  customers: <TeamOutlined />,
  signals: <AlertOutlined />,
  alerts: <BellOutlined />,
  revenue: <DollarOutlined />,
  stockout: <WarningOutlined />,
};

function alertTagColor(status: DashboardAlert["status"]) {
  if (status === "danger") return "error";
  if (status === "warning") return "warning";
  if (status === "success") return "success";
  return "processing";
}

export function DashboardScreen() {
  const t = useTranslations("dashboard");
  const { data, isLoading, isError, refetch } = useDashboardOverview();

  useDashboardCharts(data?.charts, data?.purchaseTime, {
    campaign: t("charts.campaign"),
    purchaseTime: t("purchaseTime.title"),
  });

  const alertColumns: ColumnsType<DashboardAlert> = [
    {
      title: t("alerts.priority"),
      dataIndex: "priority",
      render: (p, row) => (
        <Tag color={alertTagColor(row.status)}>{p}</Tag>
      ),
    },
    { title: t("alerts.signal"), dataIndex: "signal", ellipsis: true },
    { title: t("alerts.source"), dataIndex: "source" },
    { title: t("alerts.decision"), dataIndex: "decision", ellipsis: true },
    { title: t("alerts.owner"), dataIndex: "owner" },
    { title: t("alerts.sla"), dataIndex: "sla" },
    {
      title: t("alerts.status"),
      dataIndex: "statusLabel",
      render: (label, row) => (
        <Tag color={alertTagColor(row.status)}>{label}</Tag>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="dashboard-page flex justify-center py-20">
        <Spin size="large" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="dashboard-page text-center py-20 text-muted">
        <p>{t("error")}</p>
        <button
          type="button"
          className="mt-3 text-pharma underline"
          onClick={() => refetch()}
        >
          {t("retry")}
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <h2 className="dashboard-section-title">{t("sectionOps")}</h2>

      <Row gutter={[16, 16]} className="dashboard-highlight-row">
        <Col xs={24} md={8}>
          <Card size="small" variant="borderless">
            <Statistic
              title={data.highlight.c1t}
              value={data.highlight.c1v}
              suffix={data.highlight.c1s}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card size="small" variant="borderless">
            <Statistic title={data.highlight.c2t} value={data.highlight.c2v} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card size="small" variant="borderless">
            <Statistic title={data.highlight.c3t} value={data.highlight.c3v} />
          </Card>
        </Col>
      </Row>

      <div className="dashboard-kpi-grid">
        {data.kpis.map((kpi: DashboardKpi) => (
          <article key={kpi.id} className="dashboard-kpi-card">
            <div className="dashboard-kpi-top">
              <span className="dashboard-kpi-label">{kpi.label}</span>
              <span className="dashboard-kpi-icon">
                {kpiIcons[kpi.id] ?? <AlertOutlined />}
              </span>
            </div>
            <div className="dashboard-kpi-value">{kpi.display}</div>
            <div className="dashboard-kpi-meta">
              <span
                className={
                  kpi.growthUp ? "dashboard-growth-up" : "dashboard-growth-down"
                }
              >
                {kpi.growth}
              </span>
            </div>
          </article>
        ))}
      </div>

      <CustomerCountChartPanel
        variant="dashboard"
        data={data.customerCount}
        canvasId="chart-customer-count"
        title={t("charts.customerCount")}
        labels={{
          month: t("charts.customerCountMonth"),
          week: t("charts.customerCountWeek"),
          day: t("charts.customerCountDay"),
          vsPeriodStart: t("charts.customerCountVsStart"),
        }}
      />

      <RevenueChartPanel
        data={data.charts.revenue}
        canvasId="chart-revenue"
        title={t("charts.revenue")}
        datasetLabel={t("charts.revenue")}
        labels={{
          week: t("charts.revenueWeek"),
          month: t("charts.revenueMonth"),
          year: t("charts.revenueYear"),
        }}
      />

      <div className="dashboard-chart-grid">
        <div className="dashboard-chart-panel dashboard-chart-panel--wide">
          <h4>{t("charts.campaign")}</h4>
          <div className="dashboard-chart-wrap dashboard-chart-wrap--hbar">
            <canvas id="chart-campaign" />
          </div>
        </div>
      </div>

      <DemandInsightsRow demandMap={data.demandMap} />

      <div className="dashboard-panel">
        <h4>{t("alerts.section")}</h4>
        <Table<DashboardAlert>
          className="gl-table-scroll"
          size="small"
          rowKey="id"
          columns={alertColumns}
          dataSource={data.alerts}
          pagination={defaultTablePagination}
          scroll={tableScroll(900)}
        />
      </div>
    </div>
  );
}

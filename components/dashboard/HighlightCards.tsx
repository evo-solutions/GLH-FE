"use client";

import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Card, Col, Row, Tag } from "antd";
import type {
  DashboardHighlight,
  DashboardInventoryHighlight,
  DashboardStoreHealthHighlight,
} from "@/types/dashboard";
import { RealtimeRevenueHighlightCard } from "./RealtimeRevenueHighlightCard";

function InventoryCard({ data }: { data: DashboardInventoryHighlight }) {
  const hasWarning = data.lowStockCount > 0 || data.deadStockPct >= 3;

  return (
    <Card size="small" variant="borderless" className="dashboard-highlight-card">
      <div className="dashboard-highlight-head">
        <span className="dashboard-highlight-title">{data.title}</span>
        {hasWarning ? (
          <Tag icon={<WarningOutlined />} color="warning" className="!m-0">
            Alert
          </Tag>
        ) : null}
      </div>
      <div className="dashboard-highlight-value">{data.totalDisplay}</div>
      <div className="dashboard-highlight-metrics">
        <div className="dashboard-highlight-metric">
          <span className="dashboard-highlight-metric-label">{data.deadStockLabel}</span>
          <span
            className={
              data.deadStockPct >= 5
                ? "dashboard-highlight-metric-value dashboard-highlight-metric-value--danger"
                : "dashboard-highlight-metric-value"
            }
          >
            {data.deadStockPct.toFixed(1)}%
          </span>
        </div>
        <div className="dashboard-highlight-metric dashboard-highlight-metric--bordered">
          <span className="dashboard-highlight-metric-label">{data.lowStockLabel}</span>
          <span className="dashboard-highlight-metric-value dashboard-highlight-metric-value--warning">
            <WarningOutlined className="mr-1" />
            {data.lowStockCount.toLocaleString()}
          </span>
        </div>
      </div>
    </Card>
  );
}

function StoreHealthCard({ data }: { data: DashboardStoreHealthHighlight }) {
  const pct = Math.round((data.healthyCount / data.totalStores) * 100);
  const allHealthy = data.issueCount === 0;

  return (
    <Card size="small" variant="borderless" className="dashboard-highlight-card">
      <div className="dashboard-highlight-head">
        <span className="dashboard-highlight-title">{data.title}</span>
        {allHealthy ? (
          <Tag icon={<CheckCircleOutlined />} color="success" className="!m-0">
            OK
          </Tag>
        ) : (
          <Tag icon={<ExclamationCircleOutlined />} color="error" className="!m-0">
            {data.issueCount}
          </Tag>
        )}
      </div>
      <div className="dashboard-highlight-value dashboard-highlight-value--ratio">
        <span className="dashboard-highlight-ratio-main">
          {data.healthyCount}/{data.totalStores}
        </span>
        <span className="dashboard-highlight-ratio-sub">{data.healthyLabel}</span>
      </div>
      <div className="dashboard-highlight-progress" aria-hidden>
        <div
          className="dashboard-highlight-progress-fill"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="dashboard-highlight-status">{data.statusSummary}</p>
      {data.issueCount > 0 ? (
        <p className="dashboard-highlight-issue">
          <ExclamationCircleOutlined />
          {data.issueCount} {data.issueLabel}
        </p>
      ) : null}
    </Card>
  );
}

export function HighlightCards({ highlight }: { highlight: DashboardHighlight }) {
  return (
    <Row gutter={[16, 16]} className="dashboard-highlight-row">
      <Col xs={24} md={8}>
        <RealtimeRevenueHighlightCard data={highlight.dailyRevenue} />
      </Col>
      <Col xs={24} md={8}>
        <InventoryCard data={highlight.inventory} />
      </Col>
      <Col xs={24} md={8}>
        <StoreHealthCard data={highlight.storeHealth} />
      </Col>
    </Row>
  );
}

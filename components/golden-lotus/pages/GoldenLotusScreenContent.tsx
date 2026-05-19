"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useMessages, useTranslations } from "next-intl";
import type { Chart as ChartType } from "chart.js";
import {
  Card,
  Col,
  Input,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useGoldenLotusToast } from "@/lib/golden-lotus/context/GoldenLotusToastContext";
import { DomainFlowPlaceholder } from "@/components/ui/golden-lotus/DomainFlowPlaceholder";
import { TabDataNote } from "@/components/ui/golden-lotus/TabDataNote";
import type {
  DashboardHighlightMsgs,
  MockAiRec,
  MockAlert,
  MockCampaign,
  MockCampaignRoi,
  MockCampaignVoucher,
  MockCase,
  MockLowStockRow,
  MockCustomerActivity,
  MockCustomerProfile,
  MockCustomerRetentionRow,
  MockCustomerSegmentRow,
  MockHrmApproval,
  MockHrmStaff,
  MockSkuCard,
  MockVendor,
  ScreenId,
} from "@/lib/golden-lotus/types";
import type { GlChartMsgs } from "@/lib/golden-lotus/types/chart-messages";
import { animateValue } from "@/lib/golden-lotus/utils/format";
import { drawSpark } from "@/lib/golden-lotus/utils/sparkline";

export function GoldenLotusScreenContent({ screen }: { screen: ScreenId }) {
  const t = useTranslations("GoldenLotus");
  const messages = useMessages();
  const locale = useLocale();
  const numberLocale =
    locale === "zh" ? "zh-CN" : locale === "en" ? "en-US" : "vi-VN";

  const gChart = messages.GoldenLotus as unknown as GlChartMsgs;

  const gl = messages.GoldenLotus as {
    mockData: {
      alerts: MockAlert[];
      vendors: MockVendor[];
      skuCards: MockSkuCard[];
      campaigns: MockCampaign[];
      campaignRoi: MockCampaignRoi[];
      campaignVouchers: MockCampaignVoucher[];
      customerProfile: MockCustomerProfile;
      customerActivities: MockCustomerActivity[];
      customerSegmentMix: MockCustomerSegmentRow[];
      customerRetentionSeries: MockCustomerRetentionRow[];
      cases: MockCase[];
      aiRecs: MockAiRec[];
      lowStock: MockLowStockRow[];
      hrmApprovals: MockHrmApproval[];
      hrmStaff: MockHrmStaff[];
    };
  };

  const dashHighlight = (messages.GoldenLotus as { dashboard: { highlight: DashboardHighlightMsgs } })
    .dashboard.highlight;

  const { pushToast } = useGoldenLotusToast();

  const [vendorSearch, setVendorSearch] = useState("");
  const [vendorRegion, setVendorRegion] = useState("");
  const [vendorRisk, setVendorRisk] = useState("");

  const chartsRef = useRef<Record<string, ChartType | null>>({});

  const destroyChart = (key: string) => {
    const c = chartsRef.current[key];
    if (c) {
      c.destroy();
      chartsRef.current[key] = null;
    }
  };

  const filteredVendors = useMemo(() => {
    const q = vendorSearch.trim().toLowerCase();
    return gl.mockData.vendors.filter((v) => {
      const hay = [
        v.name,
        v.code,
        v.city,
        v.contact,
        v.channel,
      ]
        .join(" ")
        .toLowerCase();
      const matchQ = !q || hay.includes(q);
      const matchR = !vendorRegion || v.regionKey === vendorRegion;
      const matchRisk = !vendorRisk || v.riskKey === vendorRisk;
      return matchQ && matchR && matchRisk;
    });
  }, [gl.mockData.vendors, vendorSearch, vendorRegion, vendorRisk]);

  /* Dashboard charts */
  useEffect(() => {
    if (screen !== "dashboard") {
      Object.keys(chartsRef.current).forEach(destroyChart);
      return;
    }

    let cancelled = false;
    (async () => {
      const { default: Chart } = await import("chart.js/auto");

      if (cancelled) return;
      const pharma = "#0d6e8d";
      const leaf = "#1b5e3c";
      const gold = "#c9a94f";

      destroyChart("revenue");
      const elRev = document.getElementById(
        "gl-chart-revenue"
      ) as HTMLCanvasElement | null;
      if (elRev) {
        chartsRef.current.revenue = new Chart(elRev, {
          type: "line",
          data: {
            labels: gChart.dashboard.charts.months,
            datasets: [
              {
                label: t("dashboard.charts.revenueY"),
                data: [31.2, 33.1, 34.4, 36.0, 39.2, 42.8],
                borderColor: pharma,
                backgroundColor: "rgba(13,110,141,0.12)",
                fill: true,
                tension: 0.35,
              },
            ],
          },
          options: {
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: false } },
          },
        });
      }

      destroyChart("vendorBar");
      const elVb = document.getElementById(
        "gl-chart-vendor-bar"
      ) as HTMLCanvasElement | null;
      if (elVb) {
        chartsRef.current.vendorBar = new Chart(elVb, {
          type: "bar",
          data: {
            labels: gChart.dashboard.charts.vendorLabels,
            datasets: [
              {
                label: t("dashboard.charts.vendorY"),
                data: [72, 81, 88, 84, 76],
                backgroundColor: [leaf, pharma, leaf, pharma, gold],
              },
            ],
          },
          options: {
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, max: 100 } },
          },
        });
      }

      destroyChart("demandArea");
      const elDa = document.getElementById(
        "gl-chart-demand-area"
      ) as HTMLCanvasElement | null;
      if (elDa) {
        chartsRef.current.demandArea = new Chart(elDa, {
          type: "line",
          data: {
            labels: gChart.dashboard.charts.weeks,
            datasets: [
              {
                label: t("dashboard.charts.demandY"),
                data: [62, 64, 68, 71, 76, 80, 83, 87],
                borderColor: leaf,
                backgroundColor: "rgba(27,94,60,0.15)",
                fill: true,
                tension: 0.4,
              },
            ],
          },
          options: {
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } },
          },
        });
      }

      destroyChart("segments");
      const elSeg = document.getElementById(
        "gl-chart-segments-donut"
      ) as HTMLCanvasElement | null;
      if (elSeg) {
        chartsRef.current.segments = new Chart(elSeg, {
          type: "doughnut",
          data: {
            labels: gChart.dashboard.charts.segLabels,
            datasets: [
              {
                data: [22, 35, 18, 20, 5],
                backgroundColor: [pharma, leaf, gold, "#1f6fad", "#aaa"],
              },
            ],
          },
          options: { cutout: "62%", plugins: { legend: { position: "bottom" } } },
        });
      }

      destroyChart("campaignH");
      const elCh = document.getElementById(
        "gl-chart-campaign-hbar"
      ) as HTMLCanvasElement | null;
      if (elCh) {
        chartsRef.current.campaignH = new Chart(elCh, {
          type: "bar",
          data: {
            labels: gChart.dashboard.charts.campaignLabels,
            datasets: [
              {
                label: t("dashboard.charts.campaignY"),
                data: [4.1, 2.6, 3.3, 2.2, 3.8],
                backgroundColor: pharma,
              },
            ],
          },
          options: {
            indexAxis: "y",
            plugins: { legend: { display: false } },
            scales: { x: { beginAtZero: true } },
          },
        });
      }

      /* sparks */
      document.querySelectorAll(".gl-mini-spark").forEach((cv) => {
        const canvas = cv as HTMLCanvasElement;
        const key = canvas.dataset.spark || "";
        let data = [3, 5, 4, 7, 6, 9, 8, 10];
        if (key === "mixed") data = [8, 7, 8, 6, 7, 5, 6, 5];
        if (key === "risk") data = [10, 9, 8, 8, 7, 6, 5, 5];
        drawSpark(
          canvas,
          data,
          key === "risk" ? "#c0392b" : "#1e8449"
        );
      });

      /* KPI animation */
      document.querySelectorAll(".gl-kpi-value[data-target]").forEach((el) => {
        const h = el as HTMLElement;
        const target = parseFloat(h.dataset.target || "0");
        animateValue(
          h,
          target,
          1100,
          {
            format: h.dataset.format || "",
            prefix: h.dataset.prefix || "",
            suffix: h.dataset.suffix || "",
          },
          numberLocale
        );
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [screen, t, numberLocale, gChart]);

  /* SKU chart */
  useEffect(() => {
    if (screen !== "sku") {
      destroyChart("skuInv");
      return;
    }
    let cancelled = false;
    (async () => {
      const { default: Chart } = await import("chart.js/auto");
      if (cancelled) return;
      destroyChart("skuInv");
      const el = document.getElementById(
        "gl-chart-sku-inv"
      ) as HTMLCanvasElement | null;
      if (!el) return;
      chartsRef.current.skuInv = new Chart(el, {
        type: "bar",
        data: {
          labels: gChart.sku.charts.skuLabels,
          datasets: [
            {
              label: t("sku.charts.onHand"),
              data: [124, 61, 44, 52],
              backgroundColor: "#0d6e8d88",
            },
            {
              label: t("sku.charts.forecast"),
              data: [138, 58, 52, 49],
              backgroundColor: "#1b5e3c88",
            },
          ],
        },
        options: {
          scales: { x: { stacked: false } },
          plugins: { legend: { position: "bottom" } },
        },
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [screen, t, gChart]);

  /* Customer 360 — segment pie & retention line */
  useEffect(() => {
    if (screen !== "customer") {
      destroyChart("custPie");
      destroyChart("custRet");
      return;
    }
    let cancelled = false;
    (async () => {
      const { default: Chart } = await import("chart.js/auto");
      if (cancelled) return;
      destroyChart("custPie");
      const pie = document.getElementById(
        "gl-chart-cust-pie"
      ) as HTMLCanvasElement | null;
      if (pie) {
        chartsRef.current.custPie = new Chart(pie, {
          type: "pie",
          data: {
            labels: gChart.dashboard.charts.custPieLabels,
            datasets: [
              {
                data: [44, 28, 18, 10],
                backgroundColor: ["#0d6e8d", "#1b5e3c", "#c9a94f", "#1f6fad"],
              },
            ],
          },
          options: { plugins: { legend: { position: "bottom" } } },
        });
      }
      destroyChart("custRet");
      const ret = document.getElementById(
        "gl-chart-cust-retention"
      ) as HTMLCanvasElement | null;
      if (ret) {
        chartsRef.current.custRet = new Chart(ret, {
          type: "line",
          data: {
            labels: gChart.dashboard.charts.retentionX,
            datasets: [
              {
                label: t("dashboard.charts.retentionY"),
                data: [100, 82, 71, 64, 58, 54],
                borderColor: "#1b5e3c",
                tension: 0.35,
                fill: true,
                backgroundColor: "rgba(27,94,60,0.12)",
              },
            ],
          },
          options: {
            plugins: { legend: { display: false } },
            scales: { y: { min: 40, max: 100 } },
          },
        });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [screen, t, gChart]);

  /* Heatmap cells */
  useEffect(() => {
    if (screen !== "sku") return;
    const g = document.getElementById("gl-sku-heatmap");
    if (!g) return;
    let html = "";
    for (let i = 0; i < 35; i++) {
      const c = "gl-c" + (1 + (i % 4));
      html += `<div class="gl-heatmap-cell ${c}" title="${t("sku.heatmap.cellTitle")}"></div>`;
    }
    g.innerHTML = html;
  }, [screen, t]);

  /* Realtime toast simulation */
  useEffect(() => {
    const msgs = gChart.shell.toastRealtime;
    const id = window.setInterval(() => {
      if (screen !== "dashboard" || Math.random() <= 0.65) return;
      pushToast(msgs[Math.floor(Math.random() * msgs.length)], "info");
    }, 14000);
    return () => clearInterval(id);
  }, [screen, pushToast, gChart.shell.toastRealtime]);

  useEffect(() => {
    const id = window.setInterval(() => {
      const el = document.getElementById("gl-kpi-signals");
      if (!el || screen !== "dashboard") return;
      const jitter = Math.floor(Math.random() * 5) - 2;
      const base = 324 + jitter;
      el.textContent = base.toLocaleString(numberLocale);
    }, 14000);
    return () => clearInterval(id);
  }, [screen, numberLocale]);

  const skuBadgeLabel = (badgeKey: string) => {
    if (badgeKey === "danger") return t("sku.cards.badgeReorder");
    if (badgeKey === "warning") return t("sku.cards.badgeMonitor");
    return t("sku.cards.badgeHealthy");
  };

  const lowStockLabel = (tone: string) => {
    if (tone === "danger") return t("sku.lowStock.critical");
    if (tone === "warning") return t("sku.lowStock.watch");
    return t("sku.lowStock.ok");
  };

  const translateRisk = (rk: string) => {
    if (rk === "high") return t("vendors.filters.riskHigh");
    if (rk === "medium") return t("vendors.filters.riskMed");
    return t("vendors.filters.riskLow");
  };

  const riskTagColor = (k: string) => {
    if (k === "high") return "error";
    if (k === "medium") return "warning";
    return "success";
  };

  const alertToneColor = (status: string) => {
    if (status === "danger") return "error";
    if (status === "warning") return "warning";
    if (status === "success") return "success";
    return "processing";
  };

  const alertColumns: ColumnsType<MockAlert> = useMemo(
    () => [
      {
        title: t("dashboard.alertsTable.priority"),
        dataIndex: "priority",
        render: (p, row) => (
          <Tag className="gl-status-tag" color={alertToneColor(row.status)}>
            {p}
          </Tag>
        ),
      },
      { title: t("dashboard.alertsTable.signal"), dataIndex: "signal" },
      { title: t("dashboard.alertsTable.source"), dataIndex: "source" },
      { title: t("dashboard.alertsTable.decision"), dataIndex: "decision" },
      { title: t("dashboard.alertsTable.owner"), dataIndex: "owner" },
      { title: t("dashboard.alertsTable.sla"), dataIndex: "sla" },
      {
        title: t("dashboard.alertsTable.status"),
        dataIndex: "labelKey",
        render: (_, row) => (
          <Tag className="gl-status-tag" color={alertToneColor(row.status)}>
            {t(`labels.alertStatus.${row.labelKey}`)}
          </Tag>
        ),
      },
    ],
    [t]
  );

  const vendorColumns: ColumnsType<MockVendor> = useMemo(
    () => [
      {
        title: t("vendors.table.vendor"),
        key: "vendor",
        ellipsis: false,
        render: (_, v) => (
          <span className="gl-vendor-cell-line">
            <Typography.Text strong className="gl-vendor-cell-name">
              {v.name}
            </Typography.Text>
            <span className="gl-vendor-cell-sep">·</span>
            <Typography.Text type="secondary" className="gl-vendor-cell-code">
              {v.code}
            </Typography.Text>
          </span>
        ),
      },
      { title: t("vendors.table.score"), dataIndex: "score" },
      {
        title: t("vendors.table.region"),
        key: "region",
        render: (_, v) =>
          v.regionKey === "north"
            ? t("vendors.filters.regionN")
            : v.regionKey === "central"
              ? t("vendors.filters.regionC")
              : t("vendors.filters.regionS"),
      },
      { title: t("vendors.table.city"), dataIndex: "city", ellipsis: false },
      { title: t("vendors.table.contact"), dataIndex: "contact", ellipsis: false },
      { title: t("vendors.table.channel"), dataIndex: "channel", ellipsis: false },
      { title: t("vendors.table.rev"), dataIndex: "rev" },
      {
        title: t("vendors.table.risk"),
        key: "risk",
        render: (_, v) => (
          <Tag className="gl-status-tag" color={riskTagColor(v.riskKey)}>
            {translateRisk(v.riskKey)}
          </Tag>
        ),
      },
      { title: t("vendors.table.cov"), dataIndex: "cov" },
      {
        title: t("vendors.table.trend"),
        dataIndex: "trend",
        render: (tr: string) => (
          <Typography.Text
            type={
              tr.includes("−") || tr.includes("-") ? "danger" : "success"
            }
          >
            {tr}
          </Typography.Text>
        ),
      },
      { title: t("vendors.table.outlets"), dataIndex: "outlets", ellipsis: false },
      { title: t("vendors.table.asm"), dataIndex: "asm", ellipsis: false },
      { title: t("vendors.table.syncedAt"), dataIndex: "syncedAt", ellipsis: false },
    ],
    [t]
  );

  const hrmApprovalColumns: ColumnsType<MockHrmApproval> = useMemo(
    () => [
      {
        title: t("hrm.approval.approvalTable.requester"),
        dataIndex: "requester",
      },
      { title: t("hrm.approval.approvalTable.title"), dataIndex: "title" },
      {
        title: t("hrm.approval.approvalTable.type"),
        dataIndex: "type",
      },
      {
        title: t("hrm.approval.approvalTable.submitted"),
        dataIndex: "submitted",
      },
      {
        title: t("hrm.approval.approvalTable.status"),
        dataIndex: "status",
        render: (text: string, row) => (
          <Tag className="gl-status-tag" color={alertToneColor(row.statusKey)}>
            {text}
          </Tag>
        ),
      },
    ],
    [t]
  );

  const hrmStaffColumns: ColumnsType<MockHrmStaff> = useMemo(
    () => [
      {
        title: t("hrm.staff.name"),
        dataIndex: "name",
      },
      {
        title: t("hrm.staff.employeeId"),
        dataIndex: "employeeId",
      },
      {
        title: t("hrm.staff.role"),
        dataIndex: "role",
      },
      { title: t("hrm.staff.dept"), dataIndex: "dept" },
      { title: t("hrm.staff.contact"), dataIndex: "contact" },
      {
        title: t("hrm.staff.joinDate"),
        dataIndex: "joinDate",
      },
      {
        title: t("hrm.staff.status"),
        dataIndex: "status",
        render: (text: string, row) => (
          <Tag className="gl-status-tag" color={alertToneColor(row.statusKey)}>
            {text}
          </Tag>
        ),
      },
    ],
    [t]
  );

  return (
    <>
      {screen === "dashboard" && (
      <section
        className="gl-screen gl-screen-active"
        data-screen="dashboard"

      >
        <TabDataNote
          perm={t("dashboard.tabPerm")}
          flow={t("dashboard.tabFlow")}
          source={t("dashboard.tabSource")}
          process_={t("dashboard.tabProcess")}
        />
        <div className="gl-section-head">
          <h2>{t("dashboard.sectionOps.h")}</h2>
        </div>

        <Row gutter={[16, 16]} className="gl-dashboard-highlight-row">
          <Col xs={24} md={8}>
            <Card size="small" className="gl-highlight-stat" variant="borderless">
              <Statistic
                title={dashHighlight.c1t}
                value={dashHighlight.c1v}
                suffix={dashHighlight.c1s || undefined}
                styles={{
                  content: {
                    color: "var(--pharma-deep)",
                    fontWeight: 700,
                  },
                }}
              />
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card size="small" className="gl-highlight-stat" variant="borderless">
              <Statistic
                title={dashHighlight.c2t}
                value={dashHighlight.c2v}
                styles={{
                  content: {
                    color: "var(--pharma-deep)",
                    fontWeight: 700,
                  },
                }}
              />
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card size="small" className="gl-highlight-stat" variant="borderless">
              <Statistic
                title={dashHighlight.c3t}
                value={dashHighlight.c3v}
                styles={{
                  content: {
                    color: "var(--pharma-deep)",
                    fontWeight: 700,
                  },
                }}
              />
            </Card>
          </Col>
        </Row>

        <div className="gl-kpi-grid">
          <article className="gl-kpi-card">
            <div className="gl-kpi-top">
              <span className="gl-kpi-label">{t("dashboard.kpi.vendors")}</span>
              <span className="gl-kpi-icon">
                <i className="fas fa-truck-field" />
              </span>
            </div>
            <div
              className="gl-kpi-value"
              data-target="1248"
              data-suffix=""
            >
              0
            </div>
            <div className="gl-kpi-meta">
              <span className="gl-growth gl-up">
                <i className="fas fa-arrow-trend-up" />{" "}
                {t("dashboard.kpiGrowth.g1")}
              </span>
              <canvas
                className="gl-mini-spark"
                data-spark="up"
                width={72}
                height={28}
              />
            </div>
          </article>
          <article className="gl-kpi-card">
            <div className="gl-kpi-top">
              <span className="gl-kpi-label">{t("dashboard.kpi.customers")}</span>
              <span className="gl-kpi-icon">
                <i className="fas fa-address-book" />
              </span>
            </div>
            <div
              className="gl-kpi-value"
              data-target="248420"
              data-format="compact"
            >
              0
            </div>
            <div className="gl-kpi-meta">
              <span className="gl-growth gl-up">
                <i className="fas fa-arrow-trend-up" />{" "}
                {t("dashboard.kpiGrowth.g2")}
              </span>
              <canvas
                className="gl-mini-spark"
                data-spark="up2"
                width={72}
                height={28}
              />
            </div>
          </article>
          <article className="gl-kpi-card">
            <div className="gl-kpi-top">
              <span className="gl-kpi-label">{t("dashboard.kpi.signals")}</span>
              <span className="gl-kpi-icon">
                <i className="fas fa-wave-square" />
              </span>
            </div>
            <div
              className="gl-kpi-value"
              data-target="324"
              data-suffix=""
              id="gl-kpi-signals"
            >
              0
            </div>
            <div className="gl-kpi-meta">
              <span className="gl-growth gl-down">
                <i className="fas fa-arrow-trend-down" />{" "}
                {t("dashboard.kpiGrowth.g3")}
              </span>
              <canvas
                className="gl-mini-spark"
                data-spark="mixed"
                width={72}
                height={28}
              />
            </div>
          </article>
          <article className="gl-kpi-card">
            <div className="gl-kpi-top">
              <span className="gl-kpi-label">{t("dashboard.kpi.alerts")}</span>
              <span className="gl-kpi-icon">
                <i className="fas fa-bell" />
              </span>
            </div>
            <div className="gl-kpi-value" data-target="18" data-suffix="">
              0
            </div>
            <div className="gl-kpi-meta">
              <span className="gl-growth gl-up">
                <i className="fas fa-arrow-trend-up" />{" "}
                {t("dashboard.kpiGrowth.g4")}
              </span>
              <canvas
                className="gl-mini-spark"
                data-spark="alert"
                width={72}
                height={28}
              />
            </div>
          </article>
          <article className="gl-kpi-card">
            <div className="gl-kpi-top">
              <span className="gl-kpi-label">{t("dashboard.kpi.revenue")}</span>
              <span className="gl-kpi-icon">
                <i className="fas fa-sack-dollar" />
              </span>
            </div>
            <div
              className="gl-kpi-value"
              data-target="42.8"
              data-prefix="₫"
              data-format="billions"
            >
              0
            </div>
            <div className="gl-kpi-meta">
              <span className="gl-growth gl-up">
                <i className="fas fa-arrow-trend-up" />{" "}
                {t("dashboard.kpiGrowth.g5")}
              </span>
              <canvas
                className="gl-mini-spark"
                data-spark="rev"
                width={72}
                height={28}
              />
            </div>
          </article>
          <article className="gl-kpi-card">
            <div className="gl-kpi-top">
              <span className="gl-kpi-label">{t("dashboard.kpi.stockout")}</span>
              <span className="gl-kpi-icon">
                <i className="fas fa-triangle-exclamation" />
              </span>
            </div>
            <div className="gl-kpi-value" data-target="37" data-suffix="">
              0
            </div>
            <div className="gl-kpi-meta">
              <span className="gl-growth gl-down">
                <i className="fas fa-arrow-trend-down" />{" "}
                {t("dashboard.kpiGrowth.g6")}
              </span>
              <canvas
                className="gl-mini-spark"
                data-spark="risk"
                width={72}
                height={28}
              />
            </div>
          </article>
        </div>

        <div className="gl-chart-grid">
          <div className="gl-chart-panel">
            <h4>{t("dashboard.charts.revenue")}</h4>
            <canvas id="gl-chart-revenue" height={200} />
          </div>
          <div className="gl-chart-panel">
            <h4>{t("dashboard.charts.vendor")}</h4>
            <canvas id="gl-chart-vendor-bar" height={200} />
          </div>
          <div className="gl-chart-panel">
            <h4>{t("dashboard.charts.demand")}</h4>
            <canvas id="gl-chart-demand-area" height={200} />
          </div>
          <div className="gl-chart-panel">
            <h4>{t("dashboard.charts.segments")}</h4>
            <canvas id="gl-chart-segments-donut" height={200} />
          </div>
          <div className="gl-chart-panel" style={{ gridColumn: "span 12" }}>
            <h4>{t("dashboard.charts.campaignRoi")}</h4>
            <canvas id="gl-chart-campaign-hbar" height={220} />
          </div>
        </div>

        <div className="gl-map-wrap">
          <h4>
            <i
              className="fas fa-map-location-dot"
              style={{ marginRight: "0.35rem", color: "var(--pharma)" }}
            />{" "}
            {t("dashboard.map.title")}
          </h4>
          <div
            className="gl-vn-map"
            role="img"
            aria-label={t("dashboard.map.aria")}
          >
            <div className="gl-vn-silhouette" />
            <div className="gl-hotspot gl-danger gl-hs-hn" tabIndex={0}>
              <span className="gl-hotspot-tooltip">
                <strong>{t("dashboard.map.hn")}</strong>
                {t("dashboard.map.stockOut")} <b>72%</b>
                <br />
                {t("dashboard.map.vendorScore")} <b>61</b>
                <br />
                {t("dashboard.map.demandTrend")}{" "}
                <b>{t("dashboard.map.trendSampleHn")}</b>
              </span>
            </div>
            <div className="gl-hotspot gl-warning gl-hs-dn" tabIndex={0}>
              <span className="gl-hotspot-tooltip">
                <strong>{t("dashboard.map.dn")}</strong>
                {t("dashboard.map.stockOut")} <b>41%</b>
                <br />
                {t("dashboard.map.vendorScore")} <b>74</b>
                <br />
                {t("dashboard.map.demandTrend")} <b>+6%</b>
              </span>
            </div>
            <div className="gl-hotspot gl-stable gl-hs-hcm" tabIndex={0}>
              <span className="gl-hotspot-tooltip">
                <strong>{t("dashboard.map.hcm")}</strong>
                {t("dashboard.map.stockOut")} <b>22%</b>
                <br />
                {t("dashboard.map.vendorScore")} <b>82</b>
                <br />
                {t("dashboard.map.demandTrend")} <b>+3%</b>
              </span>
            </div>
            <div className="gl-hotspot gl-stable gl-hs-ct" tabIndex={0}>
              <span className="gl-hotspot-tooltip">
                <strong>{t("dashboard.map.ct")}</strong>
                {t("dashboard.map.stockOut")} <b>19%</b>
                <br />
                {t("dashboard.map.vendorScore")} <b>79</b>
                <br />
                {t("dashboard.map.demandTrend")} <b>+2%</b>
              </span>
            </div>
          </div>
          <div className="gl-map-legend">
            <span>
              <span className="gl-lg-dot" style={{ background: "var(--danger)" }} />{" "}
              {t("dashboard.map.lgDanger")}
            </span>
            <span>
              <span className="gl-lg-dot" style={{ background: "var(--warning)" }} />{" "}
              {t("dashboard.map.lgWarn")}
            </span>
            <span>
              <span className="gl-lg-dot" style={{ background: "var(--success)" }} />{" "}
              {t("dashboard.map.lgStable")}
            </span>
          </div>
        </div>

        <div className="gl-panel" style={{ marginTop: "1.25rem" }}>
          <h4>{t("dashboard.alertsSection.h")}</h4>
          <div
            className="gl-table-wrap gl-table-nowrap gl-table-scroll-x"
            style={{ border: "none", boxShadow: "none" }}
          >
            <Table<MockAlert>
              className="gl-table-ant"
              size="small"
              rowKey={(r) =>
                `${r.priority}-${r.labelKey}-${r.signal}-${r.owner}`
              }
              columns={alertColumns}
              dataSource={gl.mockData.alerts}
              pagination={false}
            />
          </div>
        </div>
      </section>
      )}
      {screen === "vendors" && (
      <section
        className="gl-screen gl-screen-active"

      >
        <TabDataNote
          perm={t("vendors.tabPerm")}
          flow={t("vendors.tabFlow")}
          source={t("vendors.tabSource")}
          process_={t("vendors.tabProcess")}
        />
        <div className="gl-panel">
          <h4>{t("vendors.section.h")}</h4>
          <Space wrap size="middle" style={{ marginBottom: 16 }} className="gl-filters-bar">
            <Input.Search
              allowClear
              placeholder={t("vendors.filters.search")}
              value={vendorSearch}
              onChange={(e) => setVendorSearch(e.target.value)}
              style={{ width: 280 }}
            />
            <Select
              value={vendorRegion}
              onChange={(v) => setVendorRegion(v)}
              style={{ minWidth: 170 }}
              options={[
                { value: "", label: t("vendors.filters.regionAll") },
                { value: "north", label: t("vendors.filters.regionN") },
                { value: "central", label: t("vendors.filters.regionC") },
                { value: "south", label: t("vendors.filters.regionS") },
              ]}
            />
            <Select
              value={vendorRisk}
              onChange={(v) => setVendorRisk(v)}
              style={{ minWidth: 170 }}
              options={[
                { value: "", label: t("vendors.filters.riskAll") },
                { value: "low", label: t("vendors.filters.riskLow") },
                { value: "medium", label: t("vendors.filters.riskMed") },
                { value: "high", label: t("vendors.filters.riskHigh") },
              ]}
            />
          </Space>
          <div
            className="gl-table-wrap gl-table-nowrap gl-table-scroll-x"
            style={{ border: "none", boxShadow: "none" }}
          >
            <Table<MockVendor>
              className="gl-table-ant"
              size="small"
              rowKey="code"
              columns={vendorColumns}
              dataSource={filteredVendors}
              pagination={false}
            />
          </div>
        </div>
      </section>
      )}
      {screen === "sku" && (
      <section
        className="gl-screen gl-screen-active"

      >
        <TabDataNote
          perm={t("sku.tabPerm")}
          flow={t("sku.tabFlow")}
          source={t("sku.tabSource")}
          process_={t("sku.tabProcess")}
        />
        <div className="gl-section-head">
          <h2>{t("sku.section.h")}</h2>
        </div>
        <div className="gl-card-row gl-sku-cards-row">
          {gl.mockData.skuCards.map((s, i) => (
            <article key={i} className="gl-product-card">
              <div className="gl-name">{s.name}</div>
              <div className="gl-sku">{s.sku}</div>
              <div className="gl-stat-row">
                <span>{t("sku.cards.stock")}</span>
                <strong>{s.stock}</strong>
              </div>
              <div className="gl-stat-row">
                <span>{t("sku.cards.cov")}</span>
                <strong>{s.cov}</strong>
              </div>
              <div className="gl-stat-row">
                <span>{t("sku.cards.trendLbl")}</span>
                <span className="gl-growth gl-up">{s.trend}</span>
              </div>
              <div className="gl-stat-row">
                <span>{t("sku.cards.ordersWeek")}</span>
                <strong>{s.weekOrders}</strong>
              </div>
              <div style={{ marginTop: "0.65rem" }}>
                <span className={`gl-badge gl-${s.badgeKey}`}>{skuBadgeLabel(s.badgeKey)}</span>
              </div>
            </article>
          ))}
        </div>
        <div className="gl-sku-stack">
          <div className="gl-panel">
            <h4>{t("sku.charts.invTitle")}</h4>
            <canvas id="gl-chart-sku-inv" height={220} />
          </div>
          <div className="gl-panel">
            <h4>{t("sku.lowStock.title")}</h4>
            <div className="gl-table-wrap gl-table-nowrap gl-table-scroll-x" style={{ border: "none", boxShadow: "none" }}>
              <table className="gl-data-table gl-data-table-layout">
                <thead>
                  <tr>
                    <th>{t("sku.lowStock.sku")}</th>
                    <th>{t("sku.lowStock.dc")}</th>
                    <th>{t("sku.lowStock.onHand")}</th>
                    <th>{t("sku.lowStock.safetyStock")}</th>
                    <th>{t("sku.lowStock.avgDailyOut")}</th>
                    <th>{t("sku.lowStock.days")}</th>
                    <th>{t("sku.lowStock.reorderProposal")}</th>
                    <th>{t("sku.lowStock.nextInbound")}</th>
                    <th>{t("sku.lowStock.planner")}</th>
                    <th>{t("sku.lowStock.status")}</th>
                  </tr>
                </thead>
                <tbody>
                  {gl.mockData.lowStock.map((row) => (
                    <tr key={row.id}>
                      <td>{row.sku}</td>
                      <td>{row.dc}</td>
                      <td>{row.onHand}</td>
                      <td>{row.safetyStock}</td>
                      <td>{row.avgDailyOut}</td>
                      <td>
                        {row.daysCover} {t("sku.lowStock.daysUnit")}
                      </td>
                      <td className="gl-cell-muted">{row.reorderProposal}</td>
                      <td>{row.nextInbound}</td>
                      <td>{row.planner}</td>
                      <td>
                        <span className={`gl-badge gl-${row.statusKey}`}>
                          {lowStockLabel(row.statusKey)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="gl-panel">
          <h4>{t("sku.heatmap.title")}</h4>
          <div className="gl-heatmap-grid" id="gl-sku-heatmap" />
          <p style={{ fontSize: "0.72rem", color: "var(--muted)", margin: "0.5rem 0 0" }}>
            {t("sku.heatmap.hint")}
          </p>
        </div>
      </section>
      )}
      {screen === "customer" && (
      <section
        className="gl-screen gl-screen-active"

      >
        <TabDataNote
          perm={t("customer.tabPerm")}
          flow={t("customer.tabFlow")}
          source={t("customer.tabSource")}
          process_={t("customer.tabProcess")}
        />
        <div className="gl-section-head">
          <h2>{t("customer.section.h")}</h2>
        </div>
        <div className="gl-customer-stack">
          <div className="gl-panel gl-customer-profile-panel">
            <article className="gl-customer-profile-card">
              <header className="gl-customer-profile-head">
                <h4>{t("customer.panel360.h")}</h4>
                <p className="gl-customer-profile-sub">{t("customer.panel360.sub")}</p>
              </header>
              <div className="gl-customer-profile-grid">
                <div className="gl-customer-profile-field">
                  <span className="gl-customer-profile-label">
                    {t("customer.tables.profile.fullName")}
                  </span>
                  <span className="gl-customer-profile-value">
                    {gl.mockData.customerProfile.fullName}
                  </span>
                </div>
                <div className="gl-customer-profile-field">
                  <span className="gl-customer-profile-label">
                    {t("customer.tables.profile.customerId")}
                  </span>
                  <span className="gl-customer-profile-value gl-customer-profile-mono">
                    {gl.mockData.customerProfile.customerId}
                  </span>
                </div>
                <div className="gl-customer-profile-field">
                  <span className="gl-customer-profile-label">
                    {t("customer.tables.profile.tier")}
                  </span>
                  <span className="gl-customer-profile-value">
                    <Tag color="gold">{gl.mockData.customerProfile.tier}</Tag>
                  </span>
                </div>
                <div className="gl-customer-profile-field">
                  <span className="gl-customer-profile-label">
                    {t("customer.tables.profile.tierSince")}
                  </span>
                  <span className="gl-customer-profile-value">
                    {gl.mockData.customerProfile.tierSince}
                  </span>
                </div>
                <div className="gl-customer-profile-field">
                  <span className="gl-customer-profile-label">
                    {t("customer.tables.profile.primaryChannel")}
                  </span>
                  <span className="gl-customer-profile-value">
                    {gl.mockData.customerProfile.primaryChannel}
                  </span>
                </div>
                <div className="gl-customer-profile-field">
                  <span className="gl-customer-profile-label">
                    {t("customer.tables.profile.phone")}
                  </span>
                  <span className="gl-customer-profile-value">
                    {gl.mockData.customerProfile.phone}
                  </span>
                </div>
                <div className="gl-customer-profile-field">
                  <span className="gl-customer-profile-label">
                    {t("customer.tables.profile.email")}
                  </span>
                  <span className="gl-customer-profile-value gl-customer-profile-break">
                    {gl.mockData.customerProfile.email}
                  </span>
                </div>
                <div className="gl-customer-profile-field">
                  <span className="gl-customer-profile-label">
                    {t("customer.tables.profile.city")}
                  </span>
                  <span className="gl-customer-profile-value">
                    {gl.mockData.customerProfile.city}
                  </span>
                </div>
                <div className="gl-customer-profile-field">
                  <span className="gl-customer-profile-label">
                    {t("customer.tables.profile.memberSince")}
                  </span>
                  <span className="gl-customer-profile-value">
                    {gl.mockData.customerProfile.memberSince}
                  </span>
                </div>
                <div className="gl-customer-profile-field">
                  <span className="gl-customer-profile-label">
                    {t("customer.tables.profile.lastSeen")}
                  </span>
                  <span className="gl-customer-profile-value">
                    {gl.mockData.customerProfile.lastSeen}
                  </span>
                </div>
                <div className="gl-customer-profile-field">
                  <span className="gl-customer-profile-label">
                    {t("customer.tables.profile.clvIndex")}
                  </span>
                  <span className="gl-customer-profile-value">
                    {gl.mockData.customerProfile.clvIndex}
                  </span>
                </div>
                <div className="gl-customer-profile-field">
                  <span className="gl-customer-profile-label">
                    {t("customer.tables.profile.consentMarketing")}
                  </span>
                  <span className="gl-customer-profile-value">
                    {gl.mockData.customerProfile.consentMarketing}
                  </span>
                </div>
              </div>
            </article>
          </div>
          <div className="gl-panel">
            <h4>{t("customer.tables.activity.h")}</h4>
            <div className="gl-table-wrap gl-table-nowrap gl-table-scroll-x" style={{ border: "none" }}>
              <table className="gl-data-table">
                <thead>
                  <tr>
                    <th>{t("customer.tables.activity.occurredAt")}</th>
                    <th>{t("customer.tables.activity.channel")}</th>
                    <th>{t("customer.tables.activity.touchpoint")}</th>
                    <th>{t("customer.tables.activity.detail")}</th>
                    <th>{t("customer.tables.activity.outcome")}</th>
                  </tr>
                </thead>
                <tbody>
                  {gl.mockData.customerActivities.map((a) => (
                    <tr key={a.id}>
                      <td>{a.occurredAt}</td>
                      <td>{a.channel}</td>
                      <td>{a.touchpoint}</td>
                      <td>{a.detail}</td>
                      <td>{a.outcome}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="gl-panel">
            <h4>{t("customer.tables.segmentMix.h")}</h4>
            <div className="gl-customer-chart-split">
              <div className="gl-customer-chart-side">
                <canvas id="gl-chart-cust-pie" height={220} />
              </div>
              <div className="gl-customer-table-side">
                <div className="gl-table-wrap gl-table-nowrap gl-table-scroll-x" style={{ border: "none" }}>
                  <table className="gl-data-table">
                    <thead>
                      <tr>
                        <th>{t("customer.tables.segmentMix.segment")}</th>
                        <th>{t("customer.tables.segmentMix.sharePct")}</th>
                        <th>{t("customer.tables.segmentMix.labeledRev")}</th>
                        <th>{t("customer.tables.segmentMix.orders90d")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gl.mockData.customerSegmentMix.map((s) => (
                        <tr key={s.id}>
                          <td>{s.segment}</td>
                          <td>{s.sharePct}</td>
                          <td>{s.labeledRev}</td>
                          <td>{s.orders90d}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="gl-panel">
            <h4>{t("customer.tables.retention.h")}</h4>
            <div className="gl-customer-chart-split">
              <div className="gl-customer-chart-side">
                <canvas id="gl-chart-cust-retention" height={220} />
              </div>
              <div className="gl-customer-table-side">
                <div className="gl-table-wrap gl-table-nowrap gl-table-scroll-x" style={{ border: "none" }}>
                  <table className="gl-data-table">
                    <thead>
                      <tr>
                        <th>{t("customer.tables.retention.period")}</th>
                        <th>{t("customer.tables.retention.retentionPct")}</th>
                        <th>{t("customer.tables.retention.note")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gl.mockData.customerRetentionSeries.map((r, i) => (
                        <tr key={`${r.period}-${i}`}>
                          <td>{r.period}</td>
                          <td>
                            <strong>{r.retentionPct}</strong>
                          </td>
                          <td className="gl-cell-muted">{r.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="gl-panel">
            <h4>{t("customer.loyalty.h")}</h4>
            <div className="gl-table-wrap gl-table-nowrap gl-table-scroll-x">
            <table className="gl-data-table">
              <thead>
                <tr>
                  <th>{t("customer.loyalty.colSeg")}</th>
                  <th>{t("customer.loyalty.colMem")}</th>
                  <th>{t("customer.loyalty.colFreq")}</th>
                  <th>{t("customer.loyalty.colClv")}</th>
                  <th>{t("customer.loyalty.colStat")}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  {(messages.GoldenLotus as { customer: { loyalty: { row1: string[] } } }).customer.loyalty.row1.map(
                    (cell: string, i: number) => (
                      <td key={i}>
                        {i === 4 ? (
                          <span className="gl-badge gl-success">{cell}</span>
                        ) : (
                          cell
                        )}
                      </td>
                    )
                  )}
                </tr>
                <tr>
                  {(messages.GoldenLotus as { customer: { loyalty: { row2: string[] } } }).customer.loyalty.row2.map(
                    (cell: string, i: number) => (
                      <td key={i}>
                        {i === 4 ? (
                          <span className="gl-badge gl-warning">{cell}</span>
                        ) : (
                          cell
                        )}
                      </td>
                    )
                  )}
                </tr>
                <tr>
                  {(messages.GoldenLotus as { customer: { loyalty: { row3: string[] } } }).customer.loyalty.row3.map(
                    (cell: string, i: number) => (
                      <td key={i}>
                        {i === 4 ? (
                          <span className="gl-badge gl-info">{cell}</span>
                        ) : (
                          cell
                        )}
                      </td>
                    )
                  )}
                </tr>
              </tbody>
            </table>
            </div>
          </div>
        </div>
      </section>
      )}
      {screen === "campaign" && (
      <section
        className="gl-screen gl-screen-active"

      >
        <TabDataNote
          perm={t("campaign.tabPerm")}
          flow={t("campaign.tabFlow")}
          source={t("campaign.tabSource")}
          process_={t("campaign.tabProcess")}
        />
        <div className="gl-section-head">
          <h2>{t("campaign.section.h")}</h2>
        </div>
        <div className="gl-card-row">
          {gl.mockData.campaigns.map((c, i) => (
            <article key={i} className="gl-product-card">
              <div className="gl-name">{c.title}</div>
              <div className="gl-sku">{c.period}</div>
              <p style={{ fontSize: "0.78rem", color: "var(--muted)", margin: "0.5rem 0" }}>
                {c.desc}
              </p>
              <div className="gl-stat-row">
                <span>{t("campaign.cards.roi")}</span>
                <strong>{c.roi}</strong>
              </div>
              <div className="gl-stat-row">
                <span>{t("campaign.cards.conv")}</span>
                <strong>{c.conv}</strong>
              </div>
              <div style={{ marginTop: "0.65rem" }}>
                <span className={`gl-badge gl-${c.statusKey}`}>{t("campaign.cards.live")}</span>
              </div>
            </article>
          ))}
        </div>
        <div className="gl-campaign-stack">
          <div className="gl-panel">
            <h4>{t("campaign.roiTable.h")}</h4>
            <div className="gl-table-wrap gl-table-nowrap gl-table-scroll-x" style={{ border: "none" }}>
              <table className="gl-data-table">
                <thead>
                  <tr>
                    <th>{t("campaign.roiTable.campaign")}</th>
                    <th>{t("campaign.roiTable.period")}</th>
                    <th>{t("campaign.roiTable.audience")}</th>
                    <th>{t("campaign.roiTable.channel")}</th>
                    <th>{t("campaign.roiTable.spend")}</th>
                    <th>{t("campaign.roiTable.rev")}</th>
                    <th>{t("campaign.roiTable.roi")}</th>
                    <th>{t("campaign.roiTable.conv")}</th>
                    <th>{t("campaign.roiTable.status")}</th>
                  </tr>
                </thead>
                <tbody>
                  {gl.mockData.campaignRoi.map((r, i) => (
                    <tr key={i}>
                      <td>{r.name}</td>
                      <td className="gl-cell-muted">{r.period}</td>
                      <td className="gl-cell-muted">{r.audience}</td>
                      <td className="gl-cell-muted">{r.channel}</td>
                      <td>{r.spend}</td>
                      <td>{r.rev}</td>
                      <td>
                        <strong>{r.roi}</strong>
                      </td>
                      <td>{r.conv}</td>
                      <td>
                        <span className={`gl-badge gl-${r.statusKey}`}>
                          {t(`labels.campaignRoi.${r.labelKey}`)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="gl-panel">
            <h4>{t("campaign.voucher.h")}</h4>
            <div className="gl-table-wrap gl-table-nowrap gl-table-scroll-x" style={{ border: "none" }}>
              <table className="gl-data-table">
                <thead>
                  <tr>
                    <th>{t("campaign.voucher.pool")}</th>
                    <th>{t("campaign.voucher.issued")}</th>
                    <th>{t("campaign.voucher.redeemed")}</th>
                    <th>{t("campaign.voucher.push")}</th>
                    <th>{t("campaign.voucher.open")}</th>
                    <th>{t("campaign.voucher.expiry")}</th>
                    <th>{t("campaign.voucher.costPerRedeem")}</th>
                    <th>{t("campaign.voucher.budgetLeft")}</th>
                  </tr>
                </thead>
                <tbody>
                  {gl.mockData.campaignVouchers.map((v) => (
                    <tr key={v.id}>
                      <td>{v.pool}</td>
                      <td>{v.issued}</td>
                      <td>{v.redeemed}</td>
                      <td>{v.push}</td>
                      <td>{v.openRate}</td>
                      <td className="gl-cell-muted">{v.expiry}</td>
                      <td>{v.costPerRedeem}</td>
                      <td className="gl-cell-muted">{v.budgetLeft}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
      )}
      {screen === "research" && (
      <section
        className="gl-screen gl-screen-active"

      >
        <TabDataNote
          perm={t("research.tabPerm")}
          flow={t("research.tabFlow")}
          source={t("research.tabSource")}
          process_={t("research.tabProcess")}
        />
        <div className="gl-section-head">
          <h2>{t("research.section.h")}</h2>
        </div>
        <div className="gl-card-row">
          <div className="gl-panel">
            <h4>{t("research.cards.c1h")}</h4>
            <p style={{ fontSize: "0.8rem", color: "var(--muted)", margin: 0 }}>
              {t("research.cards.c1p")}
            </p>
          </div>
          <div className="gl-panel">
            <h4>{t("research.cards.c2h")}</h4>
            <p style={{ fontSize: "0.8rem", color: "var(--muted)", margin: 0 }}>
              {t("research.cards.c2p")}
            </p>
          </div>
          <div className="gl-panel">
            <h4>{t("research.cards.c3h")}</h4>
            <p style={{ fontSize: "0.8rem", color: "var(--muted)", margin: 0 }}>
              {t("research.cards.c3p")}
            </p>
          </div>
        </div>
        <div className="gl-ai-card">
          <strong>{t("research.ai.a1t")}</strong>
          <p>{t("research.ai.a1p")}</p>
        </div>
        <div className="gl-ai-card">
          <strong>{t("research.ai.a2t")}</strong>
          <p>{t("research.ai.a2p")}</p>
        </div>
        <div className="gl-ai-card">
          <strong>{t("research.ai.a3t")}</strong>
          <p>{t("research.ai.a3p")}</p>
        </div>
      </section>
      )}
      {screen === "cases" && (
      <section
        className="gl-screen gl-screen-active"

      >
        <TabDataNote
          perm={t("cases.tabPerm")}
          flow={t("cases.tabFlow")}
          source={t("cases.tabSource")}
          process_={t("cases.tabProcess")}
        />
        <div className="gl-section-head">
          <h2>{t("cases.section.h")}</h2>
        </div>
        <div className="gl-panel gl-cases-table-panel">
          <h4>{t("cases.sla.h")}</h4>
          <div
            className="gl-table-wrap gl-table-nowrap gl-table-scroll-x"
            style={{ border: "none" }}
          >
            <table className="gl-data-table gl-data-table-layout">
              <thead>
                <tr>
                  <th>{t("cases.sla.case")}</th>
                  <th>{t("cases.sla.type")}</th>
                  <th>{t("cases.sla.priority")}</th>
                  <th>{t("cases.sla.receivedBy")}</th>
                  <th>{t("cases.sla.receivedAt")}</th>
                  <th>{t("cases.sla.sla")}</th>
                  <th>{t("cases.sla.owner")}</th>
                  <th>{t("cases.sla.situation")}</th>
                  <th>{t("cases.sla.status")}</th>
                </tr>
              </thead>
              <tbody>
                {gl.mockData.cases.map((c, i) => (
                  <tr key={i}>
                    <td>{c.id}</td>
                    <td>{c.type}</td>
                    <td>
                      <span className={`gl-badge gl-${c.statusKey}`}>{c.pri}</span>
                    </td>
                    <td>{c.receivedBy}</td>
                    <td>{c.receivedAt}</td>
                    <td>{c.sla}</td>
                    <td>{c.owner}</td>
                    <td className="gl-cell-muted">{c.situation}</td>
                    <td>
                      <span className={`gl-badge gl-${c.statusKey}`}>
                        {t(`labels.cases.${c.labelKey}`)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      )}
      {screen === "hrm" && (
      <section
        className="gl-screen gl-screen-active"

      >
        <TabDataNote
          perm={t("hrm.tabPerm")}
          flow={t("hrm.tabFlow")}
          source={t("hrm.tabSource")}
          process_={t("hrm.tabProcess")}
        />
        <div className="gl-section-head">
          <h2>{t("hrm.section.h")}</h2>
        </div>
        <div className="gl-kpi-grid">
          <article className="gl-kpi-card">
            <div className="gl-kpi-top">
              <span className="gl-kpi-label">{t("hrm.kpi.head")}</span>
              <span className="gl-kpi-icon">
                <i className="fas fa-users" />
              </span>
            </div>
            <div className="gl-kpi-value">482</div>
            <div className="gl-kpi-meta">
              <span className="gl-growth gl-up">{t("hrm.kpi.g1")}</span>
            </div>
          </article>
          <article className="gl-kpi-card">
            <div className="gl-kpi-top">
              <span className="gl-kpi-label">{t("hrm.kpi.att")}</span>
              <span className="gl-kpi-icon">
                <i className="fas fa-user-check" />
              </span>
            </div>
            <div className="gl-kpi-value">94%</div>
            <div className="gl-kpi-meta">
              <span className="gl-growth gl-up">{t("hrm.kpi.g2")}</span>
            </div>
          </article>
          <article className="gl-kpi-card">
            <div className="gl-kpi-top">
              <span className="gl-kpi-label">{t("hrm.kpi.open")}</span>
              <span className="gl-kpi-icon">
                <i className="fas fa-file-signature" />
              </span>
            </div>
            <div className="gl-kpi-value">26</div>
            <div className="gl-kpi-meta">
              <span className="gl-badge gl-warning">{t("hrm.kpi.badge")}</span>
            </div>
          </article>
        </div>
        <div className="gl-hrm-stack">
          <div className="gl-panel">
            <h4>{t("hrm.dept.h")}</h4>
            <div className="gl-table-wrap" style={{ border: "none" }}>
              <table className="gl-data-table">
                <thead>
                  <tr>
                    <th>{t("hrm.dept.dept")}</th>
                    <th>{t("hrm.dept.kpi")}</th>
                    <th>{t("hrm.dept.sla")}</th>
                    <th>{t("hrm.dept.trend")}</th>
                    <th>{t("hrm.dept.status")}</th>
                  </tr>
                </thead>
                <tbody>
                  {(["r1", "r2", "r3"] as const).map((rk) => (
                    <tr key={rk}>
                      {(messages.GoldenLotus as { hrm: { dept: Record<string, string[]> } }).hrm.dept[rk].map(
                        (cell: string, i: number) => (
                          <td key={i}>
                            {i === 3 ? (
                              <span
                                className={`gl-growth ${cell.includes("−") || cell.includes("-")
                                    ? "gl-down"
                                    : "gl-up"
                                  }`}
                              >
                                {cell}
                              </span>
                            ) : i === 4 ? (
                              <span
                                className={`gl-badge ${rk === "r2" ? "gl-warning" : "gl-success"
                                  }`}
                              >
                                {cell}
                              </span>
                            ) : (
                              cell
                            )}
                          </td>
                        )
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="gl-panel">
            <h4>{t("hrm.approval.h")}</h4>
            <div
              className="gl-table-wrap gl-table-nowrap gl-table-scroll-x"
              style={{ border: "none", boxShadow: "none" }}
            >
              <Table<MockHrmApproval>
                className="gl-table-ant"
                size="small"
                rowKey="id"
                columns={hrmApprovalColumns}
                dataSource={gl.mockData.hrmApprovals}
                pagination={false}
              />
            </div>
          </div>
          <div className="gl-panel">
            <h4>{t("hrm.staff.h")}</h4>
            <div
              className="gl-table-wrap gl-table-nowrap gl-table-scroll-x"
              style={{ border: "none", boxShadow: "none" }}
            >
              <Table<MockHrmStaff>
                className="gl-table-ant"
                size="small"
                rowKey="id"
                columns={hrmStaffColumns}
                dataSource={gl.mockData.hrmStaff}
                pagination={false}
              />
            </div>
          </div>
        </div>
      </section>
      )}
      {screen === "ai" && (
      <section
        className="gl-screen gl-screen-active"

      >
        <TabDataNote
          perm={t("aiCenter.tabPerm")}
          flow={t("aiCenter.tabFlow")}
          source={t("aiCenter.tabSource")}
          process_={t("aiCenter.tabProcess")}
        />
        <div className="gl-section-head">
          <h2>{t("aiCenter.section.h")}</h2>
        </div>
        {gl.mockData.aiRecs.map((a, i) => (
          <div key={i} className="gl-ai-card">
            <strong>{a.title}</strong>
            <p>{a.detail}</p>
            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                flexWrap: "wrap",
                marginTop: "0.65rem",
                fontSize: "0.72rem",
              }}
            >
              <span className={`gl-badge gl-${a.statusKey}`}>
                {t("aiCenter.badges.impact")}{" "}
                {t(`aiCenter.impactLevels.${a.impactKey}`)}
              </span>
              <span className="gl-badge gl-info">
                {t("aiCenter.badges.conf")} {a.conf}
              </span>
              <span className="gl-badge gl-success">{a.owner}</span>
            </div>
          </div>
        ))}
      </section>
      )}
      {screen === "settings" && (
      <section
        className="gl-screen gl-screen-active"

      >
        <TabDataNote
          perm={t("settings.tabPerm")}
          flow={t("settings.tabFlow")}
          source={t("settings.tabSource")}
          process_={t("settings.tabProcess")}
        />
        <div className="gl-section-head">
          <h2>{t("settings.section.h")}</h2>
        </div>
        <div className="gl-split">
          <div className="gl-panel">
            <h4>{t("settings.roles.h")}</h4>
            <div className="gl-table-wrap" style={{ border: "none" }}>
              <table className="gl-data-table">
                <thead>
                  <tr>
                    <th>{t("settings.roles.role")}</th>
                    <th>{t("settings.roles.users")}</th>
                    <th>{t("settings.roles.risk")}</th>
                    <th>{t("settings.roles.status")}</th>
                  </tr>
                </thead>
                <tbody>
                  {(["r1", "r2", "r3"] as const).map((rk) => (
                    <tr key={rk}>
                      {(
                        messages.GoldenLotus as {
                          settings: { roles: Record<string, string[]> };
                        }
                      ).settings.roles[rk].map((cell: string, i: number) => (
                        <td key={i}>
                          {i === 3 ? (
                            <span
                              className={`gl-badge ${rk === "r3" ? "gl-warning" : "gl-success"
                                }`}
                            >
                              {cell}
                            </span>
                          ) : (
                            cell
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="gl-panel">
            <h4>{t("settings.integrations.h")}</h4>
            <div className="gl-setting-row">
              <span>{t("settings.integrations.i1")}</span>
              <span className="gl-badge gl-success">{t("settings.integrations.live")}</span>
            </div>
            <div className="gl-setting-row">
              <span>{t("settings.integrations.i2")}</span>
              <span className="gl-badge gl-success">{t("settings.integrations.live")}</span>
            </div>
            <div className="gl-setting-row">
              <span>{t("settings.integrations.i3")}</span>
              <span className="gl-badge gl-warning">{t("settings.integrations.degraded")}</span>
            </div>
          </div>
        </div>
        <div className="gl-panel mb-[1.25rem]">
          <h4>{t("settings.notify.h")}</h4>
          <div className="gl-setting-row">
            <span>{t("settings.notify.n1")}</span>
            <div
              className="gl-toggle gl-on"
              role="switch"
              tabIndex={0}
              aria-checked
              onClick={() => pushToast(t("shell.toastNotifyToggle"), "info")}
            />
          </div>
          <div className="gl-setting-row">
            <span>{t("settings.notify.n2")}</span>
            <div
              className="gl-toggle gl-on"
              role="switch"
              tabIndex={0}
              aria-checked
              onClick={() => pushToast(t("shell.toastNotifyToggle"), "info")}
            />
          </div>
          <div className="gl-setting-row">
            <span>{t("settings.notify.n3")}</span>
            <div
              className="gl-toggle"
              role="switch"
              tabIndex={0}
              onClick={() => pushToast(t("shell.toastNotifyToggle"), "info")}
            />
          </div>
        </div>
        <div className="gl-panel">
          <h4>{t("settings.matrix.h")}</h4>
          <div className="gl-table-wrap" style={{ border: "none" }}>
            <table className="gl-data-table">
              <thead>
                <tr>
                  <th>{t("settings.matrix.module")}</th>
                  <th>{t("settings.matrix.read")}</th>
                  <th>{t("settings.matrix.write")}</th>
                  <th>{t("settings.matrix.approve")}</th>
                </tr>
              </thead>
              <tbody>
                {(["m1", "m2"] as const).map((mk) => (
                  <tr key={mk}>
                    {(messages.GoldenLotus as { settings: { matrix: Record<string, string[]> } }).settings.matrix[mk].map(
                      (cell: string, i: number) => (
                        <td key={i}>
                          {i > 0 ? (
                            <span
                              className={`gl-badge ${mk === "m1" && i === 2
                                  ? "gl-warning"
                                  : i === 3
                                    ? "gl-danger"
                                    : "gl-info"
                                }`}
                            >
                              {cell}
                            </span>
                          ) : (
                            cell
                          )}
                        </td>
                      )
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      )}
      {screen === "events" && (
      <section
        className="gl-screen gl-screen-active"
        data-screen="events"

      >
        <DomainFlowPlaceholder moduleId="events" />
      </section>
      )}
      {screen === "inventory" && (
      <section
        className="gl-screen gl-screen-active"
        data-screen="inventory"

      >
        <DomainFlowPlaceholder moduleId="inventory" />
      </section>
      )}
      {screen === "orders" && (
      <section
        className="gl-screen gl-screen-active"
        data-screen="orders"

      >
        <DomainFlowPlaceholder moduleId="orders" />
      </section>
      )}
      {screen === "sellout" && (
      <section
        className="gl-screen gl-screen-active"
        data-screen="sellout"

      >
        <DomainFlowPlaceholder moduleId="sellout" />
      </section>
      )}
      {screen === "ar" && (
      <section
        className="gl-screen gl-screen-active"
        data-screen="ar"

      >
        <DomainFlowPlaceholder moduleId="ar" />
      </section>
      )}
      {screen === "reconciliation" && (
      <section
        className="gl-screen gl-screen-active"
        data-screen="reconciliation"

      >
        <DomainFlowPlaceholder moduleId="reconciliation" />
      </section>
      )}
    </>
  );
}

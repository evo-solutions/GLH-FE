"use client";

import { Spin, Tag } from "antd";
import { useTranslations } from "next-intl";
import type { ProductDetail, ProductMeta, ProductSalesStatus } from "@/types/product";
import { useProductDetailCharts } from "../useProductDetailCharts";

function salesStatusColor(status: ProductSalesStatus) {
  if (status === "hot") return "success";
  if (status === "new") return "processing";
  if (status === "slow") return "warning";
  if (status === "out") return "error";
  return "default";
}

function ProductInfoCard({ meta }: { meta: ProductMeta }) {
  const t = useTranslations("product");

  return (
    <section className="location-panel product-info-card">
      <p className="product-info-name">
        {meta.productCode} · {meta.name}
      </p>
      <div className="product-info-meta">
        <Tag>{meta.category}</Tag>
        <Tag>{meta.brand}</Tag>
        <Tag color={salesStatusColor(meta.status)}>{meta.statusLabel}</Tag>
        <Tag>
          {t("launchedAt")}: {meta.launchedAt}
        </Tag>
        <Tag>
          {t("instanceCount")}: {meta.instanceCount.toLocaleString()}
        </Tag>
        <Tag>
          {t("sellPrice")}: {meta.sellPrice}
        </Tag>
        <Tag>
          {t("importPrice")}: {meta.importPrice}
        </Tag>
      </div>
      {meta.description ? <p className="product-info-desc">{meta.description}</p> : null}
    </section>
  );
}

export function ProductOverviewTab({
  data,
  enabled,
}: {
  data: ProductDetail | undefined;
  enabled: boolean;
}) {
  const t = useTranslations("product");

  useProductDetailCharts(data, enabled && !!data);

  if (!data) {
    return (
      <div className="flex justify-center py-16">
        <Spin />
      </div>
    );
  }

  const { meta, overview } = data;

  return (
    <>
      <ProductInfoCard meta={meta} />
      <div className="product-kpi-grid">
        {overview.kpis.map((kpi) => (
          <div key={kpi.label} className="product-kpi-card">
            <div className="product-kpi-label">{kpi.label}</div>
            <div className="product-kpi-value">{kpi.value}</div>
            {kpi.growth && (
              <div
                className={`product-kpi-growth ${kpi.growthUp ? "dashboard-growth-up" : "dashboard-growth-down"}`}
              >
                {kpi.growth}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="product-chart-grid">
        <div className="product-chart-panel">
          <h4>{t("salesTrend")}</h4>
          <div className="product-chart-wrap">
            <canvas id="product-chart-sales" />
          </div>
        </div>
        <div className="product-chart-panel">
          <h4>{t("locationShare")}</h4>
          <div className="product-chart-wrap">
            <canvas id="product-chart-location" />
          </div>
        </div>
        <div className="product-chart-panel">
          <h4>{t("channelMix")}</h4>
          <div className="product-chart-wrap">
            <canvas id="product-chart-channel" />
          </div>
        </div>
      </div>
    </>
  );
}

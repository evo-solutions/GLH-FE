"use client";

import Link from "next/link";
import { Spin, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useTranslations } from "next-intl";
import { useBusinessModuleScope } from "@/hooks/useBusinessModuleScope";
import { locationDetailPath } from "@/lib/locationRoutes";
import type { ProductDetail, ProductUnitInstance } from "@/types/product";
import { defaultTablePagination, tableScroll } from "@/lib/tablePagination";

function instanceStatusColor(status: ProductUnitInstance["status"]) {
  if (status === "expired") return "error";
  if (status === "near_expiry") return "warning";
  return "success";
}

function placementColor(placement: ProductUnitInstance["placement"]) {
  return placement === "central" ? "default" : "processing";
}

export function ProductItemsTab({
  data,
  enabled,
}: {
  data: ProductDetail | undefined;
  enabled: boolean;
}) {
  const t = useTranslations("product");
  const { moduleBasePath } = useBusinessModuleScope();

  if (!enabled) return null;

  if (!data) {
    return (
      <div className="flex justify-center py-16">
        <Spin />
      </div>
    );
  }

  const columns: ColumnsType<ProductUnitInstance> = [
    {
      title: t("instanceImage"),
      dataIndex: "imageUrl",
      width: 72,
      fixed: "left",
      render: (url: string, row) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt={row.id} className="product-instance-thumb" width={48} height={48} />
      ),
    },
    {
      title: t("instanceId"),
      dataIndex: "id",
      render: (id: string) => <span className="font-mono text-xs">{id}</span>,
    },
    {
      title: t("barcode"),
      dataIndex: "barcode",
      render: (code: string) => <span className="font-mono text-xs">{code}</span>,
    },
    { title: t("batchNo"), dataIndex: "batchNo" },
    { title: t("importedAt"), dataIndex: "importedAt" },
    { title: t("expiresAt"), dataIndex: "expiresAt" },
    {
      title: t("expiryStatus"),
      dataIndex: "statusLabel",
      render: (_, row) => <Tag color={instanceStatusColor(row.status)}>{row.statusLabel}</Tag>,
    },
    {
      title: t("placement"),
      dataIndex: "placement",
      render: (_, row) => (
        <Tag color={placementColor(row.placement)}>
          {row.placement === "central" ? t("placementCentral") : t("placementLocation")}
        </Tag>
      ),
    },
    {
      title: t("locationName"),
      dataIndex: "locationName",
      render: (name, row) =>
        row.locationId ? (
          <Link
            href={locationDetailPath(row.locationId, undefined, moduleBasePath)}
            className="product-location-link font-semibold"
          >
            {row.locationCode} · {name}
          </Link>
        ) : (
          <span className="font-semibold">
            {row.locationCode} · {name}
          </span>
        ),
    },
    { title: t("importPrice"), dataIndex: "importPrice" },
    { title: t("sellPrice"), dataIndex: "sellPrice" },
    {
      title: t("condition"),
      dataIndex: "conditionLabel",
      render: (_, row) => (
        <Tag color={row.condition === "sealed" ? "success" : "warning"}>{row.conditionLabel}</Tag>
      ),
    },
  ];

  return (
    <section className="product-panel product-items-panel">
      <h4 className="product-items-title">{t("instances")}</h4>
      <Table
        size="small"
        rowKey="id"
        columns={columns}
        dataSource={data.instances}
        pagination={defaultTablePagination}
        tableLayout="auto"
        className="gl-table-scroll"
        scroll={tableScroll("max-content")}
      />
    </section>
  );
}

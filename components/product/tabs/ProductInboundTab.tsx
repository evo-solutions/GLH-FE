"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Spin, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useTranslations } from "next-intl";
import { useBusinessModuleScope } from "@/hooks/useBusinessModuleScope";
import { locationDetailPath } from "@/lib/locationRoutes";
import { productInboundOrderPath } from "@/lib/productRoutes";
import { defaultTablePagination, tableScroll } from "@/lib/tablePagination";
import type { ProductDetail, ProductInboundOrder } from "@/types/product";
import type { InboundOrderStatus } from "@/types/location";

function orderStatusColor(status: InboundOrderStatus) {
  if (status === "received") return "success";
  if (status === "shipping" || status === "confirmed") return "processing";
  if (status === "return_supplier" || status === "return_location") return "warning";
  return "default";
}

export function ProductInboundTab({
  productCode,
  data,
  enabled,
}: {
  productCode: string;
  data: ProductDetail | undefined;
  enabled: boolean;
}) {
  const t = useTranslations("product.inbound");
  const tWh = useTranslations("location.warehouse");
  const router = useRouter();
  const { moduleBasePath } = useBusinessModuleScope();

  if (!enabled) return null;

  if (!data) {
    return (
      <div className="flex justify-center py-16">
        <Spin />
      </div>
    );
  }

  const dash = (v?: string | number | null) =>
    v === undefined || v === null || v === "" ? "—" : String(v);

  const columns: ColumnsType<ProductInboundOrder> = [
    {
      title: t("locationCode"),
      dataIndex: "locationCode",
      fixed: "left",
      render: (code: string, row) => (
        <Link
          href={locationDetailPath(row.locationId, undefined, moduleBasePath)}
          className="product-location-link font-semibold"
        >
          {code}
        </Link>
      ),
    },
    {
      title: t("locationName"),
      dataIndex: "locationName",
      render: (name, row) => (
        <Link
          href={locationDetailPath(row.locationId, undefined, moduleBasePath)}
          className="product-location-link"
        >
          {name}
        </Link>
      ),
    },
    { title: tWh("orderCode"), dataIndex: "orderCode" },
    { title: tWh("supplier"), dataIndex: "supplier" },
    {
      title: tWh("orderStatus"),
      dataIndex: "statusLabel",
      render: (_, row) => <Tag color={orderStatusColor(row.status)}>{row.statusLabel}</Tag>,
    },
    { title: t("productQty"), dataIndex: "productQty", align: "right" },
    { title: tWh("lastEvent"), dataIndex: "lastEvent" },
    { title: tWh("totalValue"), dataIndex: "totalValue" },
    { title: tWh("orderedAt"), dataIndex: "orderedAt" },
    { title: tWh("eta"), dataIndex: "eta", render: (v) => dash(v) },
    { title: tWh("receivedAt"), dataIndex: "receivedAt", render: (v) => dash(v) },
    { title: tWh("shipmentTracking"), dataIndex: "shipmentTracking", render: (v) => dash(v) },
  ];

  return (
    <section className="product-panel product-items-panel">
      <h4 className="product-items-title">{t("title")}</h4>
      <Table
        size="small"
        rowKey="id"
        columns={columns}
        dataSource={data.inboundOrders}
        pagination={defaultTablePagination}
        className="gl-table-scroll"
        scroll={tableScroll("max-content")}
        tableLayout="auto"
        locale={{ emptyText: t("empty") }}
        onRow={(row) => ({
          onClick: () =>
            router.push(
              productInboundOrderPath(
                productCode,
                row.locationId,
                row.id,
                moduleBasePath,
              ),
            ),
          style: { cursor: "pointer" },
        })}
      />
    </section>
  );
}

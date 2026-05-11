"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Spin, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useTranslations } from "next-intl";
import { orderDetailPath } from "@/lib/orderRoutes";
import { useOrderList } from "@/hooks/useOrder";
import { ProductCodeLink } from "@/components/product/ProductCodeLink";
import type { LocationInboundOrder, InboundOrderStatus } from "@/types/location";
import "@/components/location/location.css";

function orderStatusColor(status: InboundOrderStatus) {
  if (status === "received") return "success";
  if (status === "shipping" || status === "confirmed") return "processing";
  if (status === "return_supplier" || status === "return_location") return "warning";
  return "default";
}

export function OrderListScreen() {
  const t = useTranslations("order");
  const tWh = useTranslations("location.warehouse");
  const tProduct = useTranslations("product");
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useOrderList();

  const dash = (v?: string | number | null) =>
    v === undefined || v === null || v === "" ? "—" : String(v);

  const columns: ColumnsType<LocationInboundOrder> = [
    {
      title: tProduct("name"),
      key: "products",
      render: (_, row) => {
        const items = row.productLineItems ?? [];
        if (items.length === 0) return "—";
        return (
          <span className="inline-flex flex-wrap items-center gap-x-1">
            {items.map((item, index) => (
              <span key={`${item.productCode}-${index}`}>
                {index > 0 && <span className="text-muted">, </span>}
                <ProductCodeLink
                  productCode={item.productCode}
                  name={item.name}
                  stopPropagation
                />
              </span>
            ))}
          </span>
        );
      },
    },
    {
      title: t("locationName"),
      dataIndex: "locationName",
      render: (name, row) => (
        <Link
          href={`/location/${row.locationId}`}
          className="product-location-link font-semibold"
          onClick={(e) => e.stopPropagation()}
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
    { title: tWh("items"), dataIndex: "items", align: "right" },
    { title: tWh("lastEvent"), dataIndex: "lastEvent" },
    { title: tWh("totalValue"), dataIndex: "totalValue" },
    { title: tWh("orderedAt"), dataIndex: "orderedAt" },
    { title: tWh("eta"), dataIndex: "eta", render: (v) => dash(v) },
    { title: tWh("receivedAt"), dataIndex: "receivedAt", render: (v) => dash(v) },
    { title: tWh("shipmentTracking"), dataIndex: "shipmentTracking", render: (v) => dash(v) },
  ];

  if (isLoading) {
    return (
      <div className="location-page flex justify-center py-20">
        <Spin size="large" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="location-page text-center py-20 text-muted">
        <p>{t("error")}</p>
        <button type="button" className="mt-3 text-pharma underline" onClick={() => refetch()}>
          {t("retry")}
        </button>
      </div>
    );
  }

  return (
    <div className="location-page">
      <header className="location-page-header">
        <h1 className="location-page-title">{t("title")}</h1>
      </header>

      <Table<LocationInboundOrder>
        className="location-list-table"
        rowKey="id"
        columns={columns}
        dataSource={data}
        pagination={false}
        tableLayout="auto"
        scroll={{ x: "max-content" }}
        locale={{ emptyText: t("empty") }}
        onRow={(row) => ({
          onClick: () => router.push(orderDetailPath(row.id)),
          style: { cursor: "pointer" },
        })}
      />
    </div>
  );
}

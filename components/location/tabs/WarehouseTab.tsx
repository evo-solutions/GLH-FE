"use client";

import { Spin, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useTranslations } from "next-intl";
import { ProductCodeLink } from "@/components/product/ProductCodeLink";
import { useLocationWarehouse } from "@/hooks/useLocation";
import { defaultTablePagination, tableScroll } from "@/lib/tablePagination";
import type { LocationInventoryItem } from "@/types/location";

function stockColor(status: LocationInventoryItem["status"]) {
  if (status === "out") return "error";
  if (status === "low") return "warning";
  return "success";
}

export function WarehouseTab({
  locationId,
  enabled,
}: {
  locationId: string;
  enabled: boolean;
}) {
  const t = useTranslations("location.warehouse");
  const tRoot = useTranslations("location");
  const { data, isLoading, isError } = useLocationWarehouse(locationId, enabled);

  const stockColumns: ColumnsType<LocationInventoryItem> = [
    {
      title: t("name"),
      dataIndex: "name",
      render: (name: string, row) => (
        <ProductCodeLink productCode={row.productCode} name={name} stopPropagation />
      ),
    },
    { title: t("category"), dataIndex: "category" },
    { title: t("sellPrice"), dataIndex: "sellPrice" },
    { title: t("importPrice"), dataIndex: "importPrice" },
    { title: t("stock"), dataIndex: "stock", align: "right" },
    { title: t("minStock"), dataIndex: "minStock", align: "right" },
    {
      title: t("status"),
      dataIndex: "statusLabel",
      render: (_, row) => <Tag color={stockColor(row.status)}>{row.statusLabel}</Tag>,
    },
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
          <div className="location-kpi-label">{t("skuCount")}</div>
          <div className="location-kpi-value text-base">{data.summary.skuCount}</div>
        </div>
        <div className="location-kpi-card">
          <div className="location-kpi-label">{t("lowStock")}</div>
          <div className="location-kpi-value text-base">{data.summary.lowStock}</div>
        </div>
        <div className="location-kpi-card">
          <div className="location-kpi-label">{t("stockValue")}</div>
          <div className="location-kpi-value text-base">{data.summary.stockValue}</div>
        </div>
        <div className="location-kpi-card">
          <div className="location-kpi-label">{t("inTransit")}</div>
          <div className="location-kpi-value text-base">{data.summary.inTransit}</div>
        </div>
      </div>

      <div className="location-panel">
        <h4 className="m-0 mb-3 text-sm font-semibold">{t("stockOnHand")}</h4>
        <Table
          size="small"
          rowKey="id"
          columns={stockColumns}
          dataSource={data.items}
          pagination={defaultTablePagination}
          className="gl-table-scroll"
          scroll={tableScroll("max-content")}
          tableLayout="auto"
        />
      </div>
    </>
  );
}

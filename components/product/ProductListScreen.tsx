"use client";

import { useRouter } from "next/navigation";
import { Spin, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useTranslations } from "next-intl";
import { productDetailPath } from "@/lib/productCode";
import { useProductList } from "@/hooks/useProduct";
import type { ProductListItem, ProductSalesStatus } from "@/types/product";
import "./product.css";

function salesStatusColor(status: ProductSalesStatus) {
  if (status === "hot") return "success";
  if (status === "new") return "processing";
  if (status === "slow") return "warning";
  if (status === "out") return "error";
  return "default";
}

export function ProductListScreen() {
  const t = useTranslations("product");
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useProductList();

  const columns: ColumnsType<ProductListItem> = [
    {
      title: t("name"),
      dataIndex: "name",
      render: (name) => <span className="font-semibold">{name}</span>,
    },
    { title: t("category"), dataIndex: "category" },
    { title: t("brand"), dataIndex: "brand" },
    {
      title: t("salesStatus"),
      dataIndex: "statusLabel",
      render: (_, row) => <Tag color={salesStatusColor(row.status)}>{row.statusLabel}</Tag>,
    },
    { title: t("sellPrice"), dataIndex: "sellPrice" },
    { title: t("importPrice"), dataIndex: "importPrice" },
    { title: t("monthlyUnits"), dataIndex: "monthlyUnits", align: "right" },
    { title: t("monthlyRevenue"), dataIndex: "monthlyRevenue", align: "right" },
    {
      title: t("growth"),
      dataIndex: "growth",
      render: (growth, row) => (
        <span className={row.growthUp ? "dashboard-growth-up" : "dashboard-growth-down"}>{growth}</span>
      ),
    },
    { title: t("totalStock"), dataIndex: "totalStock", align: "right" },
    { title: t("locationCount"), dataIndex: "locationCount", align: "right" },
    { title: t("avgDailyUnits"), dataIndex: "avgDailyUnits", align: "right" },
  ];

  if (isLoading) {
    return (
      <div className="product-page flex justify-center py-20">
        <Spin size="large" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="product-page text-center py-20 text-muted">
        <p>{t("error")}</p>
        <button type="button" className="mt-3 text-pharma underline" onClick={() => refetch()}>
          {t("retry")}
        </button>
      </div>
    );
  }

  return (
    <div className="product-page">
      <header className="product-page-header">
        <h1 className="product-page-title">{t("title")}</h1>
      </header>

      <Table<ProductListItem>
        className="product-list-table"
        rowKey="productCode"
        columns={columns}
        dataSource={data}
        pagination={false}
        tableLayout="auto"
        scroll={{ x: "max-content" }}
        onRow={(row) => ({
          onClick: () => router.push(productDetailPath(row.productCode)),
          style: { cursor: "pointer" },
        })}
      />
    </div>
  );
}

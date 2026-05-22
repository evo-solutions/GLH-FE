"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Spin, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useTranslations } from "next-intl";
import { ListScreenFilters } from "@/components/list/ListScreenFilters";
import { productDetailPath } from "@/lib/productRoutes";
import { BusinessModelModuleHeader } from "@/components/layout/BusinessModelModuleHeader";
import { useBusinessModel, useBusinessModelSlug } from "@/libs/business-models/BusinessModelContext";
import { getB2BProductLinesForSegment } from "@/lib/b2bCustomerCatalog";
import type { B2BProductLineKey } from "@/lib/b2bCustomerCatalog";
import { B2bProductLineTabs } from "@/components/product/B2bProductLineTabs";
import { matchesSearch, uniqueFilterOptions } from "@/lib/listFilter";
import { defaultTablePagination, tableScroll } from "@/lib/tablePagination";
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
  const tFilter = useTranslations("listFilters");
  const router = useRouter();
  const businessModel = useBusinessModelSlug();
  const { b2bSegmentKey } = useBusinessModel();
  const productLines = b2bSegmentKey ? getB2BProductLinesForSegment(b2bSegmentKey) : null;
  const { data, isLoading, isError, refetch } = useProductList();

  const [activeLineKey, setActiveLineKey] = useState<B2BProductLineKey | undefined>();
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (productLines?.length) {
      setActiveLineKey((prev) =>
        prev && productLines.some((l) => l.key === prev) ? prev : productLines[0].key
      );
    } else {
      setActiveLineKey(undefined);
    }
  }, [b2bSegmentKey, productLines]);
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>();
  const [brandFilter, setBrandFilter] = useState<string | undefined>();
  const [statusFilter, setStatusFilter] = useState<ProductSalesStatus | undefined>();

  const categoryOptions = useMemo(
    () => uniqueFilterOptions(data ?? [], (r) => r.category),
    [data]
  );
  const brandOptions = useMemo(
    () => uniqueFilterOptions(data ?? [], (r) => r.brand),
    [data]
  );
  const statusOptions = useMemo(
    () => uniqueFilterOptions(data ?? [], (r) => r.status, (r) => r.statusLabel),
    [data]
  );

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.filter((row) => {
      if (activeLineKey && row.b2bProductLineKey && row.b2bProductLineKey !== activeLineKey) {
        return false;
      }
      if (categoryFilter && row.category !== categoryFilter) return false;
      if (brandFilter && row.brand !== brandFilter) return false;
      if (statusFilter && row.status !== statusFilter) return false;
      return matchesSearch(
        search,
        row.productCode,
        row.name,
        row.category,
        row.brand,
        row.statusLabel,
        row.sellPrice,
        row.importPrice
      );
    });
  }, [data, search, categoryFilter, brandFilter, statusFilter, activeLineKey]);

  const hasActiveFilters = Boolean(
    search || categoryFilter || brandFilter || statusFilter
  );

  const clearFilters = () => {
    setSearch("");
    setCategoryFilter(undefined);
    setBrandFilter(undefined);
    setStatusFilter(undefined);
  };

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
      <BusinessModelModuleHeader pageKey="products" />

      {productLines && activeLineKey && (
        <B2bProductLineTabs
          lines={productLines}
          activeKey={activeLineKey}
          onChange={setActiveLineKey}
        />
      )}

      <ListScreenFilters
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder={tFilter("product.search")}
        clearLabel={tFilter("clear")}
        onClear={clearFilters}
        hasActiveFilters={hasActiveFilters}
        selects={[
          {
            id: "category",
            label: tFilter("product.category"),
            value: categoryFilter,
            onChange: setCategoryFilter,
            options: categoryOptions,
            minWidth: 160,
          },
          {
            id: "brand",
            label: tFilter("product.brand"),
            value: brandFilter,
            onChange: setBrandFilter,
            options: brandOptions,
            minWidth: 160,
          },
          {
            id: "status",
            label: tFilter("product.salesStatus"),
            value: statusFilter,
            onChange: (v) => setStatusFilter(v as ProductSalesStatus | undefined),
            options: statusOptions,
            minWidth: 168,
          },
        ]}
      />

      <Table<ProductListItem>
        className="product-list-table gl-table-scroll"
        rowKey="productCode"
        columns={columns}
        dataSource={filtered}
        pagination={defaultTablePagination}
        tableLayout="auto"
        scroll={tableScroll("max-content")}
        onRow={(row) => ({
          onClick: () => router.push(productDetailPath(row.productCode, businessModel)),
          style: { cursor: "pointer" },
        })}
      />
    </div>
  );
}

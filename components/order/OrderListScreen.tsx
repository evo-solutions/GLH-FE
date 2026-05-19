"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Spin, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useTranslations } from "next-intl";
import { ListScreenFilters } from "@/components/list/ListScreenFilters";
import { orderDetailPath } from "@/lib/orderRoutes";
import { matchesSearch, uniqueFilterOptions } from "@/lib/listFilter";
import { defaultTablePagination, tableScroll } from "@/lib/tablePagination";
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

function orderSearchFields(row: LocationInboundOrder): (string | number | undefined | null)[] {
  const productFields = (row.productLineItems ?? []).flatMap((item) => [
    item.productCode,
    item.name,
  ]);
  return [
    row.orderCode,
    row.supplier,
    row.locationName,
    row.locationCode,
    row.statusLabel,
    row.shipmentTracking,
    row.lastEvent,
    row.productCodes,
    row.productSummary,
    row.trackingCodes,
    ...productFields,
  ];
}

export function OrderListScreen() {
  const t = useTranslations("order");
  const tWh = useTranslations("location.warehouse");
  const tProduct = useTranslations("product");
  const tFilter = useTranslations("listFilters");
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useOrderList();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<InboundOrderStatus | undefined>();
  const [locationFilter, setLocationFilter] = useState<string | undefined>();
  const [supplierFilter, setSupplierFilter] = useState<string | undefined>();

  const statusOptions = useMemo(
    () => uniqueFilterOptions(data ?? [], (r) => r.status, (r) => r.statusLabel),
    [data]
  );
  const locationOptions = useMemo(
    () =>
      uniqueFilterOptions(
        data ?? [],
        (r) => r.locationId,
        (r) => `${r.locationName} (${r.locationCode})`
      ),
    [data]
  );
  const supplierOptions = useMemo(
    () => uniqueFilterOptions(data ?? [], (r) => r.supplier),
    [data]
  );

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.filter((row) => {
      if (statusFilter && row.status !== statusFilter) return false;
      if (locationFilter && row.locationId !== locationFilter) return false;
      if (supplierFilter && row.supplier !== supplierFilter) return false;
      return matchesSearch(search, ...orderSearchFields(row));
    });
  }, [data, search, statusFilter, locationFilter, supplierFilter]);

  const hasActiveFilters = Boolean(
    search || statusFilter || locationFilter || supplierFilter
  );

  const clearFilters = () => {
    setSearch("");
    setStatusFilter(undefined);
    setLocationFilter(undefined);
    setSupplierFilter(undefined);
  };

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

      <ListScreenFilters
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder={tFilter("order.search")}
        clearLabel={tFilter("clear")}
        onClear={clearFilters}
        hasActiveFilters={hasActiveFilters}
        selects={[
          {
            id: "status",
            label: tFilter("order.status"),
            value: statusFilter,
            onChange: (v) => setStatusFilter(v as InboundOrderStatus | undefined),
            options: statusOptions,
            minWidth: 168,
          },
          {
            id: "location",
            label: tFilter("order.location"),
            value: locationFilter,
            onChange: setLocationFilter,
            options: locationOptions,
            minWidth: 200,
          },
          {
            id: "supplier",
            label: tFilter("order.supplier"),
            value: supplierFilter,
            onChange: setSupplierFilter,
            options: supplierOptions,
            minWidth: 180,
          },
        ]}
      />

      <Table<LocationInboundOrder>
        className="location-list-table gl-table-scroll"
        rowKey="id"
        columns={columns}
        dataSource={filtered}
        pagination={defaultTablePagination}
        tableLayout="auto"
        scroll={tableScroll("max-content")}
        locale={{ emptyText: t("empty") }}
        onRow={(row) => ({
          onClick: () => router.push(orderDetailPath(row.id)),
          style: { cursor: "pointer" },
        })}
      />
    </div>
  );
}

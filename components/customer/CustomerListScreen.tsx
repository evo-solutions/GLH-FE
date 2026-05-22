"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Spin, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useTranslations } from "next-intl";
import { ListScreenFilters } from "@/components/list/ListScreenFilters";
import { modelCustomerDetailPath, modelLocationDetailPath } from "@/lib/businessModelRoutes";
import { getLocationBusinessModel } from "@/lib/businessModelLocationMap";
import { BusinessModelModuleHeader } from "@/components/layout/BusinessModelModuleHeader";
import { useBusinessModel } from "@/libs/business-models/BusinessModelContext";
import { matchesSearch, uniqueFilterOptions } from "@/lib/listFilter";
import { defaultTablePagination, tableScroll } from "@/lib/tablePagination";
import { useCustomerList } from "@/hooks/useCustomer";
import type { GlobalCustomerListItem } from "@/types/customer";
import type { CustomerTier } from "@/types/location";
import "@/components/location/location.css";

function tierColor(tier: CustomerTier) {
  if (tier === "gold") return "warning";
  if (tier === "silver") return "default";
  return "processing";
}

export function CustomerListScreen() {
  const t = useTranslations("customer");
  const tSales = useTranslations("location.sales");
  const tFilter = useTranslations("listFilters");
  const router = useRouter();
  const { slug, entityRole, customerSegment } = useBusinessModel();
  const { data, isLoading, isError, refetch } = useCustomerList();

  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState<CustomerTier | undefined>();
  const [locationFilter, setLocationFilter] = useState<string | undefined>();

  const tierOptions = useMemo(
    () => uniqueFilterOptions(data ?? [], (r) => r.tier, (r) => r.tierLabel),
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

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.filter((row) => {
      if (tierFilter && row.tier !== tierFilter) return false;
      if (locationFilter && row.locationId !== locationFilter) return false;
      return matchesSearch(
        search,
        row.name,
        row.phone,
        row.locationName,
        row.locationCode,
        row.tierLabel,
        row.totalSpent,
        row.preferredHour
      );
    });
  }, [data, search, tierFilter, locationFilter]);

  const hasActiveFilters = Boolean(search || tierFilter || locationFilter);

  const clearFilters = () => {
    setSearch("");
    setTierFilter(undefined);
    setLocationFilter(undefined);
  };

  const columns: ColumnsType<GlobalCustomerListItem> = [
    { title: tSales("name"), dataIndex: "name", render: (name) => <span className="font-semibold">{name}</span> },
    {
      title: customerSegment === "B" ? t("b2bSegment") : tSales("tier"),
      dataIndex: "tierLabel",
      render: (_, row) => (
        <Tag color={customerSegment === "B" ? "blue" : tierColor(row.tier)}>{row.tierLabel}</Tag>
      ),
    },
    { title: tSales("phone"), dataIndex: "phone" },
    { title: tSales("totalSpent"), dataIndex: "totalSpent" },
    { title: tSales("visits"), dataIndex: "visits", align: "right" },
    { title: tSales("preferredHour"), dataIndex: "preferredHour" },
    { title: tSales("lastVisit"), dataIndex: "lastVisit" },
    {
      title: t("lastVisitLocation"),
      dataIndex: "locationName",
      render: (name, row) =>
        entityRole === "holding" ? (
          <span className="font-semibold">{name}</span>
        ) : (
          <Link
            href={modelLocationDetailPath(getLocationBusinessModel(row.locationId), row.locationId, "sales")}
            className="product-location-link font-semibold"
            onClick={(e) => e.stopPropagation()}
          >
            {name}
          </Link>
        ),
    },
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
      <BusinessModelModuleHeader pageKey="customers" />
      {customerSegment === "C" && (
        <p className="text-muted text-sm mb-3 m-0">{t("titleC")}</p>
      )}
      {customerSegment === "B" && (
        <p className="text-muted text-sm mb-3 m-0">{t("titleB")}</p>
      )}

      <ListScreenFilters
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder={tFilter("customer.search")}
        clearLabel={tFilter("clear")}
        onClear={clearFilters}
        hasActiveFilters={hasActiveFilters}
        selects={[
          {
            id: "tier",
            label: customerSegment === "B" ? t("b2bSegmentFilter") : tFilter("customer.tier"),
            value: tierFilter,
            onChange: (v) => setTierFilter(v as CustomerTier | undefined),
            options: tierOptions,
          },
          ...(entityRole === "subsidiary"
            ? [
                {
                  id: "location",
                  label: tFilter("customer.location"),
                  value: locationFilter,
                  onChange: setLocationFilter,
                  options: locationOptions,
                  minWidth: 200,
                },
              ]
            : []),
        ]}
      />

      <Table<GlobalCustomerListItem>
        className="location-list-table gl-table-scroll"
        rowKey="globalId"
        columns={columns}
        dataSource={filtered}
        pagination={defaultTablePagination}
        tableLayout="auto"
        scroll={tableScroll("max-content")}
        locale={{ emptyText: t("empty") }}
        onRow={(row) => ({
          onClick: () => router.push(modelCustomerDetailPath(slug, row.globalId)),
          style: { cursor: "pointer" },
        })}
      />
    </div>
  );
}

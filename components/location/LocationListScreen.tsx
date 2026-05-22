"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Spin, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useTranslations } from "next-intl";
import { ListScreenFilters } from "@/components/list/ListScreenFilters";
import { modelLocationDetailPath } from "@/lib/businessModelRoutes";
import { BusinessModelModuleHeader } from "@/components/layout/BusinessModelModuleHeader";
import { useBusinessModelSlug } from "@/libs/business-models/BusinessModelContext";
import { useLocationList } from "@/hooks/useLocation";
import { matchesSearch, uniqueFilterOptions } from "@/lib/listFilter";
import { defaultTablePagination, tableScroll } from "@/lib/tablePagination";
import type { LocationListItem, LocationStatus, LocationType } from "@/types/location";
import "./location.css";

function statusColor(status: LocationListItem["status"]) {
  if (status === "active") return "success";
  if (status === "setup") return "processing";
  return "default";
}

export function LocationListScreen() {
  const t = useTranslations("location");
  const tFilter = useTranslations("listFilters");
  const router = useRouter();
  const businessModel = useBusinessModelSlug();
  const { data, isLoading, isError, refetch } = useLocationList();

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<LocationType | undefined>();
  const [statusFilter, setStatusFilter] = useState<LocationStatus | undefined>();
  const [cityFilter, setCityFilter] = useState<string | undefined>();

  const typeOptions = useMemo(
    () => uniqueFilterOptions(data ?? [], (r) => r.type, (r) => r.typeLabel),
    [data]
  );
  const statusOptions = useMemo(
    () => uniqueFilterOptions(data ?? [], (r) => r.status, (r) => r.statusLabel),
    [data]
  );
  const cityOptions = useMemo(
    () => uniqueFilterOptions(data ?? [], (r) => r.city),
    [data]
  );

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.filter((row) => {
      if (typeFilter && row.type !== typeFilter) return false;
      if (statusFilter && row.status !== statusFilter) return false;
      if (cityFilter && row.city !== cityFilter) return false;
      return matchesSearch(
        search,
        row.code,
        row.name,
        row.address,
        row.city,
        row.managerName,
        row.typeLabel,
        row.statusLabel
      );
    });
  }, [data, search, typeFilter, statusFilter, cityFilter]);

  const hasActiveFilters = Boolean(search || typeFilter || statusFilter || cityFilter);

  const clearFilters = () => {
    setSearch("");
    setTypeFilter(undefined);
    setStatusFilter(undefined);
    setCityFilter(undefined);
  };

  const columns: ColumnsType<LocationListItem> = [
    {
      title: t("code"),
      dataIndex: "code",
      render: (code) => <span className="font-mono text-xs text-muted">{code}</span>,
    },
    {
      title: t("name"),
      dataIndex: "name",
      render: (name) => <span className="font-semibold">{name}</span>,
    },
    {
      title: t("type"),
      dataIndex: "typeLabel",
      render: (_, row) => (
        <Tag color={row.type === "owned" ? "processing" : "warning"}>{row.typeLabel}</Tag>
      ),
    },
    {
      title: t("address"),
      key: "address",
      render: (_, row) => `${row.address}, ${row.city}`,
    },
    { title: t("manager"), dataIndex: "managerName" },
    { title: t("staff"), dataIndex: "staffCount", align: "right" },
    { title: t("revenue"), dataIndex: "monthlyRevenueDisplay", align: "right" },
    {
      title: t("fillRate"),
      dataIndex: "fillRatePct",
      align: "right",
      render: (pct: number) => `${pct}%`,
    },
    {
      title: t("status"),
      dataIndex: "statusLabel",
      render: (_, row) => <Tag color={statusColor(row.status)}>{row.statusLabel}</Tag>,
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
      <BusinessModelModuleHeader pageKey="stores" />

      <ListScreenFilters
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder={tFilter("location.search")}
        clearLabel={tFilter("clear")}
        onClear={clearFilters}
        hasActiveFilters={hasActiveFilters}
        selects={[
          {
            id: "type",
            label: tFilter("location.type"),
            value: typeFilter,
            onChange: (v) => setTypeFilter(v as LocationType | undefined),
            options: typeOptions,
          },
          {
            id: "status",
            label: tFilter("location.status"),
            value: statusFilter,
            onChange: (v) => setStatusFilter(v as LocationStatus | undefined),
            options: statusOptions,
          },
          {
            id: "city",
            label: tFilter("location.city"),
            value: cityFilter,
            onChange: setCityFilter,
            options: cityOptions,
            minWidth: 160,
          },
        ]}
      />

      <Table<LocationListItem>
        className="location-list-table gl-table-scroll"
        rowKey="id"
        columns={columns}
        dataSource={filtered}
        pagination={defaultTablePagination}
        tableLayout="auto"
        scroll={tableScroll("max-content")}
        onRow={(row) => ({
          onClick: () => router.push(modelLocationDetailPath(businessModel, row.id)),
          style: { cursor: "pointer" },
        })}
      />
    </div>
  );
}

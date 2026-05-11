"use client";

import { useRouter } from "next/navigation";
import { Spin, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useTranslations } from "next-intl";
import { useLocationList } from "@/hooks/useLocation";
import type { LocationListItem } from "@/types/location";
import "./location.css";

function statusColor(status: LocationListItem["status"]) {
  if (status === "active") return "success";
  if (status === "setup") return "processing";
  return "default";
}

export function LocationListScreen() {
  const t = useTranslations("location");
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useLocationList();

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
      <header className="location-page-header">
        <h1 className="location-page-title">{t("title")}</h1>
      </header>

      <Table<LocationListItem>
        className="location-list-table"
        rowKey="id"
        columns={columns}
        dataSource={data}
        pagination={false}
        tableLayout="auto"
        scroll={{ x: "max-content" }}
        onRow={(row) => ({
          onClick: () => router.push(`/location/${row.id}`),
          style: { cursor: "pointer" },
        })}
      />
    </div>
  );
}

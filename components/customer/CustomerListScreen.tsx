"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Spin, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useTranslations } from "next-intl";
import { customerDetailPath } from "@/lib/customerRoutes";
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
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useCustomerList();

  const columns: ColumnsType<GlobalCustomerListItem> = [
    { title: tSales("name"), dataIndex: "name", render: (name) => <span className="font-semibold">{name}</span> },
    {
      title: tSales("tier"),
      dataIndex: "tierLabel",
      render: (_, row) => <Tag color={tierColor(row.tier)}>{row.tierLabel}</Tag>,
    },
    { title: tSales("phone"), dataIndex: "phone" },
    { title: tSales("totalSpent"), dataIndex: "totalSpent" },
    { title: tSales("visits"), dataIndex: "visits", align: "right" },
    { title: tSales("preferredHour"), dataIndex: "preferredHour" },
    { title: tSales("lastVisit"), dataIndex: "lastVisit" },
    {
      title: t("lastVisitLocation"),
      dataIndex: "locationName",
      render: (name, row) => (
        <Link
          href={`/location/${row.locationId}?tab=sales`}
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
      <header className="location-page-header">
        <h1 className="location-page-title">{t("title")}</h1>
      </header>

      <Table<GlobalCustomerListItem>
        className="location-list-table"
        rowKey="globalId"
        columns={columns}
        dataSource={data}
        pagination={false}
        tableLayout="auto"
        scroll={{ x: "max-content" }}
        locale={{ emptyText: t("empty") }}
        onRow={(row) => ({
          onClick: () => router.push(customerDetailPath(row.locationId, row.id)),
          style: { cursor: "pointer" },
        })}
      />
    </div>
  );
}

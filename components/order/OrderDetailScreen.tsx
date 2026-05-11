"use client";

import Link from "next/link";
import { Breadcrumb, Spin } from "antd";
import { useTranslations } from "next-intl";
import { InboundOrderDetailView } from "@/components/inbound/InboundOrderDetailView";
import { useOrderDetailMeta } from "@/hooks/useOrder";
import "@/components/location/location.css";
import "@/components/product/product.css";

export function OrderDetailScreen({ orderId }: { orderId: string }) {
  const t = useTranslations("order");
  const { data: meta, isLoading, isError } = useOrderDetailMeta(orderId);

  if (isLoading) {
    return (
      <div className="location-page flex justify-center py-20">
        <Spin size="large" />
      </div>
    );
  }

  if (isError || !meta) {
    return (
      <div className="location-page text-center py-20 text-muted">
        <p>{t("detailError")}</p>
        <Link href="/order" className="mt-3 inline-block text-pharma underline">
          {t("backToList")}
        </Link>
      </div>
    );
  }

  return (
    <div className="location-page">
      <header className="location-detail-header">
        <Breadcrumb
          className="location-breadcrumb"
          items={[
            { title: <Link href="/order">{t("title")}</Link> },
            { title: meta.orderCode },
          ]}
        />
      </header>

      <InboundOrderDetailView
        locationId={meta.locationId}
        orderId={orderId}
        showAllUnits
      />
    </div>
  );
}

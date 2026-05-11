"use client";

import Link from "next/link";
import { Breadcrumb } from "antd";
import { useTranslations } from "next-intl";
import { CustomerDetailView } from "@/components/location/CustomerDetailView";
import { useLocationMeta } from "@/hooks/useLocation";
import { locationDetailPath } from "@/lib/locationRoutes";
import "./location.css";

export function CustomerDetailScreen({
  locationId,
  customerId,
}: {
  locationId: string;
  customerId: string;
}) {
  const t = useTranslations("location");
  const tSales = useTranslations("location.sales");
  const { data: meta } = useLocationMeta(locationId);

  const locationName = meta?.name ?? locationId;
  const locationHref = locationDetailPath(locationId, "sales");

  return (
    <div className="location-page">
      <header className="location-detail-header">
        <Breadcrumb
          className="location-breadcrumb"
          items={[
            { title: <Link href="/location">{t("title")}</Link> },
            { title: <Link href={locationHref}>{locationName}</Link> },
            { title: <Link href={locationHref}>{tSales("customerList")}</Link> },
            { title: tSales("customerDetail") },
          ]}
        />
      </header>

      <CustomerDetailView locationId={locationId} customerId={customerId} />
    </div>
  );
}

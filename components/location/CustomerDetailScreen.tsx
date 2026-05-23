"use client";

import Link from "next/link";
import { Breadcrumb } from "antd";
import { useTranslations } from "next-intl";
import { CustomerDetailView } from "@/components/location/CustomerDetailView";
import { useBusinessModuleScope } from "@/hooks/useBusinessModuleScope";
import { useLocationMeta } from "@/hooks/useLocation";
import { locationDetailPath, locationListPath } from "@/lib/locationRoutes";
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
  const { moduleBasePath } = useBusinessModuleScope();
  const { data: meta } = useLocationMeta(locationId);

  const locationName = meta?.name ?? locationId;
  const listHref = locationListPath(moduleBasePath);
  const locationHref = locationDetailPath(locationId, "sales", moduleBasePath);

  return (
    <div className="location-page">
      <header className="location-detail-header">
        <Breadcrumb
          className="location-breadcrumb"
          items={[
            { title: <Link href={listHref}>{t("title")}</Link> },
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

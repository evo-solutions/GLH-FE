"use client";

import Link from "next/link";
import { Breadcrumb } from "antd";
import { useTranslations } from "next-intl";
import { CustomerDetailView } from "@/components/location/CustomerDetailView";
import { modelLocationDetailPath, modelLocationListPath } from "@/lib/businessModelRoutes";
import { useBusinessModel, useBusinessModelSlug } from "@/libs/business-models/BusinessModelContext";
import { useLocationMeta } from "@/hooks/useLocation";
import "./location.css";

export function CustomerDetailScreen({
  locationId,
  customerId,
}: {
  locationId: string;
  customerId: string;
}) {
  const t = useTranslations("location");
  const tNav = useTranslations("nav.businessModels");
  const tSales = useTranslations("location.sales");
  const businessModel = useBusinessModelSlug();
  const { navKey } = useBusinessModel();
  const { data: meta } = useLocationMeta(locationId);

  const locationName = meta?.name ?? locationId;
  const locationHref = modelLocationDetailPath(businessModel, locationId, "sales");
  const moduleTitle = tNav(navKey);

  return (
    <div className="location-page">
      <header className="location-detail-header">
        <Breadcrumb
          className="location-breadcrumb"
          items={[
            { title: <Link href={modelLocationListPath(businessModel)}>{moduleTitle}</Link> },
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

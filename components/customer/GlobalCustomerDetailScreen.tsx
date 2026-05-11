"use client";

import Link from "next/link";
import { Breadcrumb, Spin } from "antd";
import { useLocale, useTranslations } from "next-intl";
import { CustomerDetailView } from "@/components/location/CustomerDetailView";
import { parseGlobalCustomerId } from "@/lib/customerRoutes";
import { useGlobalCustomerDetail } from "@/hooks/useCustomer";
import { getLocationSeed } from "@/lib/locationRegistry";
import { locationDetailPath } from "@/lib/locationRoutes";
import "@/components/location/location.css";

export function GlobalCustomerDetailScreen({ globalId }: { globalId: string }) {
  const t = useTranslations("customer");
  const locale = useLocale();
  const parsed = parseGlobalCustomerId(globalId);
  const { data, isLoading, isError } = useGlobalCustomerDetail(globalId, !!parsed);

  if (!parsed) {
    return (
      <div className="location-page text-center py-20 text-muted">
        <p>{t("detailError")}</p>
        <Link href="/customer" className="mt-3 inline-block text-pharma underline">
          {t("backToList")}
        </Link>
      </div>
    );
  }

  const { locationId, customerId } = parsed;

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
        <p>{t("detailError")}</p>
        <Link href="/customer" className="mt-3 inline-block text-pharma underline">
          {t("backToList")}
        </Link>
      </div>
    );
  }

  const locationHref = locationDetailPath(locationId, "sales");
  const seed = getLocationSeed(locationId);
  const locationName = locale === "zh" ? seed.nameZh : locale === "en" ? seed.nameEn : seed.nameVi;

  return (
    <div className="location-page">
      <header className="location-detail-header">
        <Breadcrumb
          className="location-breadcrumb"
          items={[
            { title: <Link href="/customer">{t("title")}</Link> },
            {
              title: (
                <Link href={locationHref}>
                  {seed.code} · {locationName}
                </Link>
              ),
            },
            { title: data.name },
          ]}
        />
      </header>

      <CustomerDetailView locationId={locationId} customerId={customerId} />
    </div>
  );
}

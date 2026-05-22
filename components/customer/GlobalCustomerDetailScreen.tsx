"use client";

import Link from "next/link";
import { Breadcrumb, Spin } from "antd";
import { useLocale, useTranslations } from "next-intl";
import { CustomerDetailView } from "@/components/location/CustomerDetailView";
import { modelCustomerListPath } from "@/lib/businessModelRoutes";
import { parseGlobalCustomerId } from "@/lib/customerRoutes";
import { useGlobalCustomerDetail } from "@/hooks/useCustomer";
import { useOptionalBusinessModelSlug } from "@/libs/business-models/BusinessModelContext";
import { getLocationSeed } from "@/lib/locationRegistry";
import { locationDetailPath } from "@/lib/locationRoutes";

import "@/components/location/location.css";

const HOLDING_B2B_LOCATION_ID = "holding-bsv";

export function GlobalCustomerDetailScreen({ globalId }: { globalId: string }) {
  const t = useTranslations("customer");
  const locale = useLocale();
  const businessModel = useOptionalBusinessModelSlug();
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

  const isHoldingB2B = locationId === HOLDING_B2B_LOCATION_ID;
  const listHref = businessModel ? modelCustomerListPath(businessModel) : "/customer";

  const locationHref = isHoldingB2B ? listHref : locationDetailPath(locationId, "sales");
  const locationCrumbTitle = isHoldingB2B
    ? locale === "zh"
      ? "金莲花控股"
      : locale === "en"
        ? "Golden Lotus Holding"
        : "Bông Sen Vàng Holding"
    : (() => {
        const seed = getLocationSeed(locationId);
        const locationName = locale === "zh" ? seed.nameZh : locale === "en" ? seed.nameEn : seed.nameVi;
        return `${seed.code} · ${locationName}`;
      })();

  return (
    <div className="location-page">
      <header className="location-detail-header">
        <Breadcrumb
          className="location-breadcrumb"
          items={[
            { title: <Link href={listHref}>{t("title")}</Link> },
            {
              title: isHoldingB2B ? (
                <span>{locationCrumbTitle}</span>
              ) : (
                <Link href={locationHref}>{locationCrumbTitle}</Link>
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

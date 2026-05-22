"use client";

import Link from "next/link";
import { Breadcrumb } from "antd";
import { useTranslations } from "next-intl";
import { InboundOrderDetailView } from "@/components/inbound/InboundOrderDetailView";
import { useProductDetail } from "@/hooks/useProduct";
import {
  modelProductDetailPath,
  modelProductListPath,
} from "@/lib/businessModelRoutes";
import {
  useBusinessModel,
  useBusinessModelSlug,
} from "@/libs/business-models/BusinessModelContext";
import "@/components/location/location.css";
import "./product.css";

export function InboundOrderDetailScreen({
  productCode,
  locationId,
  orderId,
}: {
  productCode: string;
  locationId: string;
  orderId: string;
}) {
  const t = useTranslations("product");
  const tNav = useTranslations("nav.businessModels");
  const tInbound = useTranslations("product.inbound");
  const businessModel = useBusinessModelSlug();
  const { navKey } = useBusinessModel();
  const { data: product } = useProductDetail(productCode);

  const productName = product?.meta.name ?? productCode;
  const productHref = modelProductDetailPath(businessModel, productCode);
  const productListHref = modelProductListPath(businessModel);
  const unitLabel = tNav(navKey);

  return (
    <div className="product-page">
      <header className="location-detail-header">
        <Breadcrumb
          className="location-breadcrumb"
          items={[
            { title: <Link href={productListHref}>{unitLabel}</Link> },
            { title: <Link href={productHref}>{productName}</Link> },
            { title: <Link href={`${productHref}?tab=inbound`}>{tInbound("title")}</Link> },
            { title: tInbound("orderDetail") },
          ]}
        />
      </header>

      <InboundOrderDetailView
        locationId={locationId}
        orderId={orderId}
        productCode={productCode}
      />
    </div>
  );
}

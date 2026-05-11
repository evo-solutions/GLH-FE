"use client";

import Link from "next/link";
import { Breadcrumb } from "antd";
import { useTranslations } from "next-intl";
import { InboundOrderDetailView } from "@/components/inbound/InboundOrderDetailView";
import { useProductDetail } from "@/hooks/useProduct";
import { productDetailPath } from "@/lib/productRoutes";
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
  const tInbound = useTranslations("product.inbound");
  const { data: product } = useProductDetail(productCode);

  const productName = product?.meta.name ?? productCode;
  const productHref = productDetailPath(productCode);

  return (
    <div className="product-page">
      <header className="location-detail-header">
        <Breadcrumb
          className="location-breadcrumb"
          items={[
            { title: <Link href="/product">{t("title")}</Link> },
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

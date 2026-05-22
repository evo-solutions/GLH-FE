"use client";

import Link from "next/link";
import { productDetailPath } from "@/lib/productRoutes";
import { useOptionalBusinessModelSlug } from "@/libs/business-models/BusinessModelContext";
import { DEFAULT_SUBSIDIARY_SLUG } from "@/libs/business-models/config";

export function ProductCodeLink({
  productCode,
  name,
  stopPropagation,
  className,
}: {
  productCode: string;
  name?: string;
  stopPropagation?: boolean;
  className?: string;
}) {
  const model = useOptionalBusinessModelSlug() ?? DEFAULT_SUBSIDIARY_SLUG;
  const label = name ?? productCode;
  const defaultClass = name
    ? "font-semibold text-pharma hover:underline"
    : "font-mono text-xs text-pharma hover:underline";

  return (
    <Link
      href={productDetailPath(productCode, model)}
      className={className ?? defaultClass}
      onClick={stopPropagation ? (e) => e.stopPropagation() : undefined}
    >
      {label}
    </Link>
  );
}

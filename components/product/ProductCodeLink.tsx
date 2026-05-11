"use client";

import Link from "next/link";
import { productDetailPath } from "@/lib/productCode";

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
  const label = name ?? productCode;
  const defaultClass = name
    ? "font-semibold text-pharma hover:underline"
    : "font-mono text-xs text-pharma hover:underline";

  return (
    <Link
      href={productDetailPath(productCode)}
      className={className ?? defaultClass}
      onClick={stopPropagation ? (e) => e.stopPropagation() : undefined}
    >
      {label}
    </Link>
  );
}

"use client";

import Link from "next/link";
import { Spin, Table, Tag, Timeline } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useLocale, useTranslations } from "next-intl";
import { modelLocationDetailPath, modelOrderListPath } from "@/lib/businessModelRoutes";
import { getLocationBusinessModel } from "@/lib/businessModelLocationMap";
import {
  HOLDING_CENTRAL_WAREHOUSE_ID,
  HOLDING_WAREHOUSE_LABEL,
} from "@/lib/holdingWarehouseData";
import { getLocationSeed } from "@/lib/locationRegistry";
import { useOptionalBusinessModelSlug } from "@/libs/business-models/BusinessModelContext";
import { DEFAULT_SUBSIDIARY_SLUG } from "@/libs/business-models/config";
import { getInboundOrderProductUnits } from "@/lib/productInstanceCatalog";
import { defaultTablePagination, tableScroll } from "@/lib/tablePagination";
import { ProductCodeLink } from "@/components/product/ProductCodeLink";
import { useLocationInboundOrderDetail } from "@/hooks/useLocation";
import type {
  InboundOrderLineItem,
  InboundOrderStatus,
  InboundReturnLineItem,
} from "@/types/location";
import type { ProductUnitInstance } from "@/types/product";

function orderStatusColor(status: InboundOrderStatus) {
  if (status === "received") return "success";
  if (status === "shipping" || status === "confirmed") return "processing";
  if (status === "return_supplier" || status === "return_location") return "warning";
  return "default";
}

function instanceStatusColor(status: ProductUnitInstance["status"]) {
  if (status === "expired") return "error";
  if (status === "near_expiry") return "warning";
  return "success";
}

type OrderUnitRow = ProductUnitInstance & { productCode: string; productName: string };

export function InboundOrderDetailView({
  locationId,
  orderId,
  productCode,
  showAllUnits = false,
  enabled = true,
}: {
  locationId: string;
  orderId: string;
  productCode?: string;
  showAllUnits?: boolean;
  enabled?: boolean;
}) {
  const t = useTranslations("location.warehouse");
  const tInbound = useTranslations("product.inbound");
  const tOrder = useTranslations("order");
  const tProduct = useTranslations("product");
  const businessModel = useOptionalBusinessModelSlug() ?? DEFAULT_SUBSIDIARY_SLUG;

  const locationHref =
    locationId === HOLDING_CENTRAL_WAREHOUSE_ID
      ? modelOrderListPath("bong-sen-vang")
      : modelLocationDetailPath(getLocationBusinessModel(locationId), locationId);
  const locale = useLocale();
  const { data, isLoading, isError } = useLocationInboundOrderDetail(
    locationId,
    orderId,
    enabled && !!orderId
  );

  const lineColumns: ColumnsType<InboundOrderLineItem> = [
    {
      title: t("name"),
      dataIndex: "name",
      ellipsis: true,
      render: (name: string, row) => (
        <ProductCodeLink productCode={row.productCode} name={name} />
      ),
    },
    {
      title: t("trackingCode"),
      dataIndex: "trackingCode",
      width: 120,
      render: (code: string) => <span className="font-mono text-xs text-muted">{code}</span>,
    },
    { title: t("qty"), dataIndex: "qty", width: 56, align: "right" },
    { title: t("unitPrice"), dataIndex: "unitPrice", width: 96 },
    { title: t("lineTotal"), dataIndex: "lineTotal", width: 96 },
  ];

  const unitColumns: ColumnsType<OrderUnitRow> = [
    ...(showAllUnits
      ? [
          {
            title: t("name"),
            dataIndex: "productName",
            ellipsis: true,
            fixed: "left" as const,
            render: (name: string, row: OrderUnitRow) => (
              <ProductCodeLink productCode={row.productCode} name={name} />
            ),
          },
        ]
      : []),
    {
      title: tProduct("instanceImage"),
      dataIndex: "imageUrl",
      width: 72,
      fixed: showAllUnits ? undefined : "left",
      render: (url: string, row) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt={row.id} className="product-instance-thumb" width={48} height={48} />
      ),
    },
    {
      title: tProduct("barcode"),
      dataIndex: "barcode",
      render: (code: string) => <span className="font-mono text-xs">{code}</span>,
    },
    { title: tProduct("batchNo"), dataIndex: "batchNo" },
    { title: tProduct("importedAt"), dataIndex: "importedAt" },
    { title: tProduct("expiresAt"), dataIndex: "expiresAt" },
    {
      title: tProduct("expiryStatus"),
      dataIndex: "statusLabel",
      render: (_, row) => <Tag color={instanceStatusColor(row.status)}>{row.statusLabel}</Tag>,
    },
    {
      title: tProduct("condition"),
      dataIndex: "conditionLabel",
      render: (_, row) => (
        <Tag color={row.condition === "sealed" ? "success" : "warning"}>{row.conditionLabel}</Tag>
      ),
    },
  ];

  const returnColumns: ColumnsType<InboundReturnLineItem> = [
    {
      title: t("name"),
      dataIndex: "name",
      ellipsis: true,
      render: (name: string, row) => (
        <ProductCodeLink productCode={row.productCode} name={name} />
      ),
    },
    {
      title: t("trackingCode"),
      dataIndex: "trackingCode",
      width: 120,
      render: (code: string) => <span className="font-mono text-xs text-muted">{code}</span>,
    },
    { title: t("qty"), dataIndex: "qty", width: 56, align: "right" },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spin size="large" />
      </div>
    );
  }

  if (isError || !data) {
    return <p className="text-muted text-center py-16 m-0">{t("loadOrderError")}</p>;
  }

  const locationName =
    locationId === HOLDING_CENTRAL_WAREHOUSE_ID
      ? locale === "zh"
        ? HOLDING_WAREHOUSE_LABEL.zh
        : locale === "en"
          ? HOLDING_WAREHOUSE_LABEL.en
          : HOLDING_WAREHOUSE_LABEL.vi
      : (() => {
          const seed = getLocationSeed(locationId);
          return locale === "zh" ? seed.nameZh : locale === "en" ? seed.nameEn : seed.nameVi;
        })();
  const productLines = productCode
    ? data.lineItems.filter((l) => l.productCode === productCode)
    : data.lineItems;
  const productQty = productLines.reduce((sum, l) => sum + l.qty, 0);
  const filteredProductName = productLines[0]?.name;
  const orderUnits: OrderUnitRow[] =
    productCode && productQty > 0
      ? getInboundOrderProductUnits(locationId, orderId, productCode, productQty).map((u) => ({
          ...u,
          productCode,
          productName: filteredProductName ?? productCode,
        }))
      : showAllUnits
        ? data.lineItems.flatMap((line) =>
            getInboundOrderProductUnits(locationId, orderId, line.productCode, line.qty).map((u) => ({
              ...u,
              productCode: line.productCode,
              productName: line.name,
            }))
          )
        : [];

  return (
    <>
      <section className="location-panel inbound-order-summary-card">
        <div className="inbound-order-summary-head">
          <div>
            <div className="inbound-order-summary-code m-0">{data.orderCode}</div>
            <div className="inbound-order-summary-supplier m-0 text-muted text-sm">{data.supplier}</div>
          </div>
          <Tag color={orderStatusColor(data.status)} className="location-tier-tag">
            {data.statusLabel}
          </Tag>
        </div>

        <dl className="location-drawer-dl inbound-order-summary-dl">
          <div>
            <dt>{tOrder("locationName")}</dt>
            <dd>
              <Link href={locationHref} className="product-location-link font-semibold">
                {locationName}
              </Link>
            </dd>
          </div>
          <div>
            <dt>{t("totalValue")}</dt>
            <dd>{data.totalValue}</dd>
          </div>
          <div>
            <dt>{t("items")}</dt>
            <dd>{data.items}</dd>
          </div>
          {productCode && (
            <div>
              <dt>{tInbound("productQty")}</dt>
              <dd>
                {productQty} ({filteredProductName ?? productCode})
              </dd>
            </div>
          )}
          <div>
            <dt>{t("orderedAt")}</dt>
            <dd>{data.orderedAt}</dd>
          </div>
          {data.eta && (
            <div>
              <dt>{t("eta")}</dt>
              <dd>{data.eta}</dd>
            </div>
          )}
          {data.receivedAt && (
            <div>
              <dt>{t("receivedAt")}</dt>
              <dd>{data.receivedAt}</dd>
            </div>
          )}
        </dl>
      </section>

      <div className="inbound-order-detail-grid">
        <div className="inbound-order-detail-main">
          {productCode || showAllUnits ? (
            <section className="location-panel product-items-panel">
              <h4 className="location-drawer-section-title">{tInbound("orderUnits")}</h4>
              <Table
                size="small"
                rowKey="id"
                columns={unitColumns}
                dataSource={orderUnits}
                pagination={defaultTablePagination}
                className="gl-table-scroll"
                scroll={tableScroll("max-content")}
                tableLayout="auto"
                locale={{ emptyText: tInbound("orderUnitsEmpty") }}
              />
            </section>
          ) : (
            <section className="location-panel">
              <h4 className="location-drawer-section-title">{t("lineItems")}</h4>
              <Table
                size="small"
                rowKey={(row) => row.trackingCode}
                columns={lineColumns}
                dataSource={data.lineItems}
                pagination={defaultTablePagination}
                className="gl-table-scroll"
                scroll={tableScroll("max-content")}
                tableLayout="auto"
              />
            </section>
          )}

          {data.returnItems && data.returnItems.length > 0 && (
            <section className="location-panel mt-3">
              <h4 className="location-drawer-section-title">{t("returnItems")}</h4>
              <Table
                size="small"
                rowKey={(row) => row.trackingCode}
                columns={returnColumns}
                dataSource={data.returnItems}
                pagination={defaultTablePagination}
                className="gl-table-scroll"
                scroll={tableScroll("max-content")}
              />
            </section>
          )}
        </div>

        <section className="location-panel inbound-order-timeline-panel">
          <h4 className="location-drawer-section-title">{t("orderTimeline")}</h4>
          <div className="inbound-order-timeline-scroll">
            <Timeline
              className="location-drawer-timeline"
              items={data.timeline.map((ev) => ({
                content: (
                  <div>
                    <div className="text-sm font-semibold">
                      {ev.date}
                      {ev.time ? ` · ${ev.time}` : ""} — {ev.title}
                    </div>
                    {ev.detail && <div className="text-xs text-muted">{ev.detail}</div>}
                  </div>
                ),
              }))}
            />
          </div>
        </section>
      </div>
    </>
  );
}

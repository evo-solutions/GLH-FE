"use client";

import Link from "next/link";
import { Drawer, Spin, Table, Tag, Timeline } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useLocale, useTranslations } from "next-intl";
import { getLocationSeed } from "@/lib/locationRegistry";
import { ProductCodeLink } from "@/components/product/ProductCodeLink";
import { useLocationInboundOrderDetail } from "@/hooks/useLocation";
import { defaultTablePagination, tableScroll } from "@/lib/tablePagination";
import type {
  InboundOrderLineItem,
  InboundOrderStatus,
  InboundReturnLineItem,
} from "@/types/location";

function orderStatusColor(status: InboundOrderStatus) {
  if (status === "received") return "success";
  if (status === "shipping" || status === "confirmed") return "processing";
  if (status === "return_supplier" || status === "return_location") return "warning";
  return "default";
}

export function InboundOrderDetailDrawer({
  locationId,
  orderId,
  open,
  onClose,
}: {
  locationId: string;
  orderId: string | null;
  open: boolean;
  onClose: () => void;
}) {
  const t = useTranslations("location.warehouse");
  const locale = useLocale();
  const { data, isLoading, isError } = useLocationInboundOrderDetail(
    locationId,
    orderId,
    open && !!orderId
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
      width: 108,
      render: (code: string) => <span className="font-mono text-xs text-muted">{code}</span>,
    },
    { title: t("qty"), dataIndex: "qty", width: 56, align: "right" },
    { title: t("unitPrice"), dataIndex: "unitPrice", width: 96 },
    { title: t("lineTotal"), dataIndex: "lineTotal", width: 96 },
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
    { title: t("qty"), dataIndex: "qty", width: 56, align: "right" },
  ];

  const drawerTitle = data ? (
    <div className="location-drawer-title">
      <span className="location-drawer-name">{data.orderCode}</span>
      <Tag color={orderStatusColor(data.status)} className="location-tier-tag">
        {data.statusLabel}
      </Tag>
    </div>
  ) : (
    t("orderDetail")
  );

  return (
    <Drawer
      title={drawerTitle}
      open={open}
      onClose={onClose}
      size={480}
      className="location-customer-drawer"
      styles={{
        body: {
          paddingTop: 12,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        },
      }}
    >
      {isLoading && (
        <div className="flex justify-center py-12">
          <Spin />
        </div>
      )}
      {isError && <p className="text-muted text-center">{t("loadOrderError")}</p>}
      {data && (
        <div className="location-drawer-content">
          <section className="location-drawer-card">
            <dl className="location-drawer-dl">
              <div>
                <dt>{t("locationName")}</dt>
                <dd>
                  {(() => {
                    const seed = getLocationSeed(locationId);
                    const name =
                      locale === "zh" ? seed.nameZh : locale === "en" ? seed.nameEn : seed.nameVi;
                    return (
                      <Link href={`/location/${locationId}`} className="product-location-link font-semibold">
                        {name}
                      </Link>
                    );
                  })()}
                </dd>
              </div>
              <div>
                <dt>{t("supplier")}</dt>
                <dd>{data.supplier}</dd>
              </div>
              <div>
                <dt>{t("totalValue")}</dt>
                <dd>{data.totalValue}</dd>
              </div>
              <div>
                <dt>{t("items")}</dt>
                <dd>{data.items}</dd>
              </div>
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

          <section className="location-drawer-card">
            <h4 className="location-drawer-section-title">{t("lineItems")}</h4>
            <Table
              size="small"
              rowKey={(row) => row.trackingCode}
              columns={lineColumns}
              dataSource={data.lineItems}
              pagination={defaultTablePagination}
              className="gl-table-scroll"
              scroll={tableScroll("max-content")}
            />
          </section>

          {data.returnItems && data.returnItems.length > 0 && (
            <section className="location-drawer-card">
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

          <section className="location-drawer-card location-drawer-card--timeline">
            <h4 className="location-drawer-section-title">{t("orderTimeline")}</h4>
            <div className="location-drawer-timeline-scroll">
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
      )}
    </Drawer>
  );
}

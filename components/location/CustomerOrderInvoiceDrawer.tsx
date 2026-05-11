"use client";

import { Drawer, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useTranslations } from "next-intl";
import { ProductCodeLink } from "@/components/product/ProductCodeLink";
import type { CustomerOrderInvoice, CustomerOrderInvoiceLine } from "@/types/location";

export function CustomerOrderInvoiceDrawer({
  invoice,
  open,
  onClose,
}: {
  invoice: CustomerOrderInvoice | null;
  open: boolean;
  onClose: () => void;
}) {
  const t = useTranslations("location.sales");

  const lineColumns: ColumnsType<CustomerOrderInvoiceLine> = [
    {
      title: t("invoiceProductName"),
      dataIndex: "productName",
      render: (name: string, row) => (
        <ProductCodeLink productCode={row.productCode} name={name} />
      ),
    },
    {
      title: t("invoiceBarcode"),
      dataIndex: "barcode",
      render: (code: string) => <span className="font-mono text-xs whitespace-nowrap">{code}</span>,
    },
    { title: t("invoiceBatchNo"), dataIndex: "batchNo" },
    { title: t("invoiceQty"), dataIndex: "qty", align: "right" },
    { title: t("invoiceUnitPrice"), dataIndex: "unitPrice" },
    { title: t("invoiceLineTotal"), dataIndex: "lineTotal" },
  ];

  return (
    <Drawer
      title={
        invoice ? (
          <div>
            <span className="font-semibold">{invoice.orderCode}</span>
            <span className="text-muted text-sm font-normal ml-2">{invoice.totalAmount}</span>
          </div>
        ) : (
          t("invoiceTitle")
        )
      }
      open={open}
      onClose={onClose}
      size={720}
      className="location-customer-drawer"
      styles={{ body: { paddingTop: 12 } }}
    >
      {invoice && (
        <>
          <dl className="location-drawer-dl mb-3">
            <div>
              <dt>{t("activityAt")}</dt>
              <dd>{invoice.orderedAt}</dd>
            </div>
            <div>
              <dt>{t("activityChannel")}</dt>
              <dd>{invoice.channel}</dd>
            </div>
            <div>
              <dt>{t("activityTouchpoint")}</dt>
              <dd>{invoice.touchpoint}</dd>
            </div>
            <div>
              <dt>{t("invoiceTotal")}</dt>
              <dd className="font-semibold">{invoice.totalAmount}</dd>
            </div>
          </dl>

          <div className="customer-invoice-lines-scroll">
            <Table
              size="small"
              rowKey="id"
              columns={lineColumns}
              dataSource={invoice.lines}
              pagination={false}
              scroll={{ x: "max-content" }}
              tableLayout="auto"
            />
          </div>
        </>
      )}
    </Drawer>
  );
}

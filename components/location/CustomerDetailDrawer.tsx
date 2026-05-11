"use client";

import { Drawer, Spin, Tag, Timeline } from "antd";
import { useTranslations } from "next-intl";
import { useLocationCustomerDetail } from "@/hooks/useLocation";
import type { CustomerTier } from "@/types/location";

function tierColor(tier: CustomerTier) {
  if (tier === "gold") return "warning";
  if (tier === "silver") return "default";
  return "processing";
}

export function CustomerDetailDrawer({
  locationId,
  customerId,
  open,
  onClose,
}: {
  locationId: string;
  customerId: string | null;
  open: boolean;
  onClose: () => void;
}) {
  const t = useTranslations("location.sales");
  const { data, isLoading, isError } = useLocationCustomerDetail(
    locationId,
    customerId,
    open && !!customerId
  );

  const drawerTitle = data ? (
    <div className="location-drawer-title">
      <span className="location-drawer-name">{data.name}</span>
      <Tag color={tierColor(data.tier)} className="location-tier-tag">
        {data.tierLabel}
      </Tag>
    </div>
  ) : (
    t("customerDetail")
  );

  return (
    <Drawer
      title={drawerTitle}
      open={open}
      onClose={onClose}
      size={440}
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
      {isError && <p className="text-muted text-center">{t("loadError")}</p>}
      {data && (
        <div className="location-drawer-content">
          <section className="location-drawer-card">
            <dl className="location-drawer-dl">
              <div>
                <dt>{t("phone")}</dt>
                <dd>{data.phone}</dd>
              </div>
              {data.email && (
                <div>
                  <dt>{t("email")}</dt>
                  <dd>{data.email}</dd>
                </div>
              )}
              <div>
                <dt>{t("totalSpent")}</dt>
                <dd>{data.totalSpent}</dd>
              </div>
              <div>
                <dt>{t("visits")}</dt>
                <dd>{data.visits}</dd>
              </div>
              <div>
                <dt>{t("preferredHours")}</dt>
                <dd>{data.preferredHours.join(" · ")}</dd>
              </div>
              <div>
                <dt>{t("memberSince")}</dt>
                <dd>{data.memberSince}</dd>
              </div>
            </dl>
          </section>

          <section className="location-drawer-card location-drawer-card--timeline">
            <div className="location-drawer-timeline-scroll">
              <Timeline
                className="location-drawer-timeline"
                items={data.timeline.map((ev) => ({
                  children: (
                    <div>
                      <div className="text-sm font-semibold"> 
                        {ev.date} · {ev.time} — {ev.amount}
                      </div>
                      <div className="text-xs text-muted">{ev.items}</div>
                      <div className="text-xs text-muted">{ev.channel}</div>
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

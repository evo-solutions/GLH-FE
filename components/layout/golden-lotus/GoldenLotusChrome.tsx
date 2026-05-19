"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { MenuOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Drawer,
  Input,
  Layout,
  Menu,
  Select,
  Space,
  Typography,
  type MenuProps,
} from "antd";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { locales, type Locale } from "@/libs/i18n/config";
import { GOLDEN_LOTUS_MENU_GROUPS } from "@/lib/golden-lotus/constants/nav";
import { GOLDEN_LOTUS_NAV_ICONS } from "@/lib/golden-lotus/constants/nav-icons";
import { GOLDEN_LOTUS_PATHS } from "@/lib/golden-lotus/constants/routes";
import type { ScreenId } from "@/lib/golden-lotus/types";
import { useGoldenLotusToast } from "@/lib/golden-lotus/context/GoldenLotusToastContext";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

function useIsMobile(breakpoint = 992) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const on = () => setIsMobile(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [breakpoint]);
  return isMobile;
}

export function GoldenLotusChrome({
  screen,
  sidebarOpen,
  setSidebarOpen,
  children,
}: {
  screen: ScreenId;
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean | ((o: boolean) => boolean)) => void;
  children: ReactNode;
}) {
  const t = useTranslations("GoldenLotus");
  const locale = useLocale();
  const router = useRouter();
  const { pushToast } = useGoldenLotusToast();
  const isMobile = useIsMobile(992);

  const setLocaleCookie = (loc: Locale) => {
    document.cookie = `NEXT_LOCALE=${loc};path=/;max-age=31536000`;
    router.refresh();
  };

  const crumb = t(`crumb.${screen}`);

  const menuItems = useMemo<MenuProps["items"]>(
    () =>
      GOLDEN_LOTUS_MENU_GROUPS.map((g) => ({
        type: "group" as const,
        label: (
          <div className="gl-nav-group-head">
            <span className="gl-nav-group-title">{t(`navGroup.${g.id}`)}</span>
          </div>
        ),
        children: g.screens.map((id) => ({
          key: id,
          icon: GOLDEN_LOTUS_NAV_ICONS[id],
          label: (
            <Link href={GOLDEN_LOTUS_PATHS[id]} onClick={() => setSidebarOpen(false)}>
              {t(`nav.${id}`)}
            </Link>
          ),
        })),
      })),
    [t, setSidebarOpen]
  );

  const onMenu = (e: { key: string }) => {
    const id = e.key as ScreenId;
    router.push(GOLDEN_LOTUS_PATHS[id]);
    setSidebarOpen(false);
  };

  const siderContent = (
    <div className="gl-sidebar-inner">
      <header className="gl-sidebar-header">
        <Text strong className="gl-sidebar-brand-title">
          {t("shell.brandTitle")}
        </Text>
      </header>
      <nav className="gl-sidebar-scroll">
        <Menu
          mode="inline"
          selectedKeys={[screen]}
          items={menuItems}
          onClick={onMenu}
          style={{ borderRight: 0 }}
        />
      </nav>
    </div>
  );

  return (
    <Layout className="gl-app">
      {!isMobile && (
        <Sider
          id="gl-sidebar"
          width={240}
          theme="light"
          className="gl-sidebar"
          aria-label={t("shell.sidebarAria")}
          style={{
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {siderContent}
        </Sider>
      )}

      {isMobile && (
        <Drawer
          rootClassName="gl-drawer-sidebar"
          title={null}
          placement="left"
          size={260}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          classNames={{ body: "gl-drawer-sidebar-body" }}
          styles={{
            body: {
              padding: 0,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              height: "100%",
            },
          }}
        >
          {siderContent}
        </Drawer>
      )}

      <Layout>
        <Header
          className="gl-topbar"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "0 16px",
            height: "auto",
            minHeight: 64,
            lineHeight: 1.3,
            flexWrap: "wrap",
          }}
        >
          {isMobile && (
            <Button
              type="text"
              icon={<MenuOutlined />}
              aria-label={t("shell.openMenu")}
              onClick={() => setSidebarOpen(true)}
            />
          )}
          <div className="gl-topbar-title" style={{ flex: "1 1 200px", minWidth: 0 }}>
            <Text strong className="gl-screen-label" style={{ display: "block" }}>
              {t(`nav.${screen}`)}
            </Text>
            <Text type="secondary" className="gl-breadcrumb" style={{ fontSize: 12 }}>
              {crumb}
            </Text>
          </div>
          <Input
            className="gl-topbar-search"
            allowClear
            prefix={<SearchOutlined style={{ color: "var(--muted)" }} />}
            placeholder={t("shell.searchPlaceholder")}
            onPressEnter={() => pushToast(t("shell.toastSearch"), "info")}
          />
          <Space size="small" wrap>
            <Select
              className="gl-lang-select"
              value={locale}
              aria-label={t("shell.language")}
              title={t("shell.language")}
              options={locales.map((loc) => ({
                value: loc,
                label: t(`langs.${loc}`),
              }))}
              onChange={(v) => setLocaleCookie(v as Locale)}
            />
            <Space size={8}>
              <Avatar size="small" style={{ backgroundColor: "#0d6e8d" }}>
                GL
              </Avatar>
              <Text style={{ fontSize: 13 }}>{t("shell.accountRole")}</Text>
            </Space>
          </Space>
        </Header>

        <Content className="gl-page">{children}</Content>
      </Layout>
    </Layout>
  );
}

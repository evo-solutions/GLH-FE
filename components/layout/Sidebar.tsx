"use client";

import { Layout, Menu } from "antd";
import { useRouter } from "next/navigation";
import { useThemeContext } from "@/libs/theme/ThemeProvider";
import { Logo } from "./Logo";
import { useNavMenuItems } from "./useNavMenuItems";
import { useNavMenuState } from "./useNavMenuState";

const { Sider } = Layout;

export function Sidebar() {
  const router = useRouter();
  const { theme } = useThemeContext();
  const menuItems = useNavMenuItems();
  const { selectedKeys, openKeys, onOpenChange } = useNavMenuState();

  return (
    <Sider
      width={260}
      className="app-sidebar !bg-transparent"
      theme={theme === "dark" ? "dark" : "light"}
    >
      <Menu
        mode="inline"
        selectedKeys={selectedKeys}
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        items={menuItems}
        onClick={({ key }) => router.push(key)}
        style={{ background: "transparent", borderInlineEnd: "none" }}
        className="app-sidebar-menu font-semibold"
      />
    </Sider>
  );
}

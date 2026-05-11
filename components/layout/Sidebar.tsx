"use client";

import { Layout, Menu } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { useThemeContext } from "@/libs/theme/ThemeProvider";
import { navSelectedKey } from "./navSelectedKey";
import { useNavMenuItems } from "./useNavMenuItems";

const { Sider } = Layout;

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme } = useThemeContext();
  const menuItems = useNavMenuItems();

  return (
    <Sider
      width={260}
      className="app-sidebar !bg-transparent"
      theme={theme === "dark" ? "dark" : "light"}
    >
      <Menu
        mode="inline"
        selectedKeys={[navSelectedKey(pathname)].filter(Boolean)}
        items={menuItems}
        onClick={({ key }) => router.push(key)}
        style={{ background: "transparent", borderInlineEnd: "none" }}
        className="app-sidebar-menu font-semibold"
      />
    </Sider>
  );
}

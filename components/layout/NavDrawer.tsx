"use client";

import { Drawer, Menu } from "antd";
import { useRouter } from "next/navigation";
import { useThemeContext } from "@/libs/theme/ThemeProvider";
import { Logo } from "./Logo";
import { useNavMenuItems } from "./useNavMenuItems";
import { useNavMenuState } from "./useNavMenuState";

export function NavDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const { theme } = useThemeContext();
  const menuItems = useNavMenuItems();
  const { selectedKeys, openKeys, onOpenChange } = useNavMenuState();

  return (
    <Drawer
      title={<Logo size="sm" href={null} />}
      placement="left"
      open={open}
      onClose={onClose}
      size={280}
      className="app-nav-drawer"
      styles={{ body: { padding: 0 } }}
    >
      <Menu
        mode="inline"
        selectedKeys={selectedKeys}
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        items={menuItems}
        theme={theme === "dark" ? "dark" : "light"}
        className="app-nav-drawer-menu border-0 font-semibold"
        onClick={({ key }) => {
          router.push(key);
          onClose();
        }}
      />
    </Drawer>
  );
}

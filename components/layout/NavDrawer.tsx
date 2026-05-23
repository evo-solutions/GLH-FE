"use client";

import { Drawer, Menu } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { useThemeContext } from "@/libs/theme/ThemeProvider";
import { useNavMenuOpenKeys } from "@/hooks/useNavMenuOpenKeys";
import { Logo } from "./Logo";
import { navSelectedKey } from "./navSelectedKey";
import { useNavMenuItems } from "./useNavMenuItems";

export function NavDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme } = useThemeContext();
  const menuItems = useNavMenuItems();
  const { openKeys, onOpenChange } = useNavMenuOpenKeys(pathname);

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
        selectedKeys={[navSelectedKey(pathname)].filter(Boolean)}
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        items={menuItems}
        theme={theme === "dark" ? "dark" : "light"}
        className="app-nav-drawer-menu border-0 font-semibold"
        onClick={({ key }) => {
          if (typeof key === "string" && key.startsWith("/")) {
            router.push(key);
            onClose();
          }
        }}
      />
    </Drawer>
  );
}

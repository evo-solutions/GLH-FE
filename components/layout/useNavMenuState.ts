"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ALL_BUSINESS_MODELS } from "@/libs/business-models/config";
import { navOpenKeys, navSelectedKey } from "./navSelectedKey";

const ROOT_SUBMENU_KEYS = ALL_BUSINESS_MODELS.map((m) => `bm-${m.slug}`);

/** Accordion: chỉ mở một submenu mô hình kinh doanh tại một thời điểm. */
export function useNavMenuState() {
  const pathname = usePathname();
  const [openKeys, setOpenKeys] = useState<string[]>(() => navOpenKeys(pathname));

  useEffect(() => {
    setOpenKeys(navOpenKeys(pathname));
  }, [pathname]);

  const onOpenChange = (keys: string[]) => {
    const latestOpenKey = keys.find((key) => !openKeys.includes(key));
    if (latestOpenKey && ROOT_SUBMENU_KEYS.includes(latestOpenKey)) {
      setOpenKeys([latestOpenKey]);
      return;
    }
    setOpenKeys(keys);
  };

  return {
    selectedKeys: [navSelectedKey(pathname)].filter(Boolean),
    openKeys,
    onOpenChange,
  };
}

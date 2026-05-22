"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ALL_BUSINESS_MODELS } from "@/libs/business-models/config";
import {
  B2B_DISTRIBUTOR_GROUP_KEY,
  isB2BDistributorChannelSlug,
} from "@/libs/business-models/b2bChannels";
import { navOpenKeys, navSelectedKey } from "./navSelectedKey";

/** Cấp 1 sidebar — accordion chỉ áp dụng giữa các mục này. */
const TOP_LEVEL_SUBMENU_KEYS = [
  ...ALL_BUSINESS_MODELS.filter((m) => !isB2BDistributorChannelSlug(m.slug)).map(
    (m) => `bm-${m.slug}`
  ),
  B2B_DISTRIBUTOR_GROUP_KEY,
];

/** Accordion: chỉ mở một submenu mô hình kinh doanh tại một thời điểm. */
export function useNavMenuState() {
  const pathname = usePathname();
  const [openKeys, setOpenKeys] = useState<string[]>(() => navOpenKeys(pathname));

  useEffect(() => {
    setOpenKeys(navOpenKeys(pathname));
  }, [pathname]);

  const onOpenChange = (keys: string[]) => {
    const latestOpenKey = keys.find((key) => !openKeys.includes(key));
    if (latestOpenKey && TOP_LEVEL_SUBMENU_KEYS.includes(latestOpenKey)) {
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

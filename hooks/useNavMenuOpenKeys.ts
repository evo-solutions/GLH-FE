"use client";

import { useCallback, useEffect, useState } from "react";
import { BUSINESS_MODULES, SUBSIDIARY_MENU_KEY } from "@/libs/business-modules/config";
import {
  EXTERNAL_DISTRIBUTOR_GROUP_MENU_KEY,
  EXTERNAL_ORGANIZATION_MENU_KEY,
  EXTERNAL_ORGANIZATIONS,
} from "@/libs/external-organizations/config";
import { navOpenKeysForPath } from "@/libs/business-modules/nav";

const SUBSIDIARY_MODULE_KEYS = new Set(BUSINESS_MODULES.map((m) => m.menuKey));
const EXTERNAL_LEAF_KEYS = new Set(EXTERNAL_ORGANIZATIONS.map((o) => o.menuKey));
const LEAF_ORG_MENU_KEYS = new Set([...SUBSIDIARY_MODULE_KEYS, ...EXTERNAL_LEAF_KEYS]);

const ROOT_ORG_MENU_KEYS = [SUBSIDIARY_MENU_KEY, EXTERNAL_ORGANIZATION_MENU_KEY] as const;

const COLLAPSIBLE_MENU_KEYS = new Set<string>([
  SUBSIDIARY_MENU_KEY,
  EXTERNAL_ORGANIZATION_MENU_KEY,
  EXTERNAL_DISTRIBUTOR_GROUP_MENU_KEY,
]);

const PARENT_MENU_KEYS = COLLAPSIBLE_MENU_KEYS;

function keysEqual(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((k, i) => k === b[i]);
}

function isRootOrgKey(key: string): key is (typeof ROOT_ORG_MENU_KEYS)[number] {
  return (ROOT_ORG_MENU_KEYS as readonly string[]).includes(key);
}

function isDistributorChannelKey(key: string): boolean {
  return (
    EXTERNAL_ORGANIZATIONS.find((o) => o.menuKey === key)?.parentMenuKey ===
    EXTERNAL_DISTRIBUTOR_GROUP_MENU_KEY
  );
}

/** Xóa key con khi user đóng submenu cha. */
function stripDescendantsOfCollapsed(collapsedKey: string, keys: string[]): string[] {
  if (collapsedKey === EXTERNAL_ORGANIZATION_MENU_KEY) {
    return keys.filter(
      (k) =>
        k !== EXTERNAL_ORGANIZATION_MENU_KEY &&
        k !== EXTERNAL_DISTRIBUTOR_GROUP_MENU_KEY &&
        !EXTERNAL_LEAF_KEYS.has(k),
    );
  }
  if (collapsedKey === SUBSIDIARY_MENU_KEY) {
    return keys.filter((k) => k !== SUBSIDIARY_MENU_KEY && !SUBSIDIARY_MODULE_KEYS.has(k));
  }
  if (collapsedKey === EXTERNAL_DISTRIBUTOR_GROUP_MENU_KEY) {
    return keys.filter((k) => k !== EXTERNAL_DISTRIBUTOR_GROUP_MENU_KEY && !isDistributorChannelKey(k));
  }
  return keys;
}

/** User bấm đóng submenu (cha hoặc nhóm) — trả keys sau khi gỡ nhánh, hoặc null nếu không đóng. */
function applyUserCollapse(prev: string[], keys: string[]): string[] | null {
  const collapsed = [...COLLAPSIBLE_MENU_KEYS].filter(
    (k) => prev.includes(k) && !keys.includes(k),
  );
  if (collapsed.length === 0) return null;

  let next = [...keys];
  for (const key of collapsed) {
    next = stripDescendantsOfCollapsed(key, next);
  }
  return [...new Set(next)];
}

/** Chỉ mở Subsidiary hoặc External Organization — đóng nhóm còn lại. */
function enforceSingleRootMenu(keys: string[], prev: string[]): string[] {
  const openRoots = ROOT_ORG_MENU_KEYS.filter((k) => keys.includes(k));
  if (openRoots.length <= 1) return keys;

  const prevRoots = ROOT_ORG_MENU_KEYS.filter((k) => prev.includes(k));
  const added = openRoots.find((k) => !prevRoots.includes(k));
  const keepRoot = added ?? openRoots[openRoots.length - 1];

  return keys.filter((k) => {
    if (isRootOrgKey(k)) return k === keepRoot;
    if (keepRoot === SUBSIDIARY_MENU_KEY) {
      return !EXTERNAL_LEAF_KEYS.has(k) && k !== EXTERNAL_DISTRIBUTOR_GROUP_MENU_KEY;
    }
    return !SUBSIDIARY_MODULE_KEYS.has(k);
  });
}

/** Khi mở module lá — đảm bảo mở đủ submenu cha (không dùng khi user vừa đóng cha). */
function normalizeOpenKeysForExpand(keys: string[], leafKeys: string[]): string[] {
  const leaf = leafKeys.filter((k) => LEAF_ORG_MENU_KEYS.has(k));
  const parents = keys.filter((k) => PARENT_MENU_KEYS.has(k));
  const other = keys.filter(
    (k) => !LEAF_ORG_MENU_KEYS.has(k) && !PARENT_MENU_KEYS.has(k),
  );

  if (leaf.length === 0) {
    return [...new Set([...parents, ...other])];
  }

  const activeLeaf = leaf[leaf.length - 1];
  const scopeParents: string[] = [];

  if (SUBSIDIARY_MODULE_KEYS.has(activeLeaf)) {
    scopeParents.push(SUBSIDIARY_MENU_KEY);
  } else if (EXTERNAL_LEAF_KEYS.has(activeLeaf)) {
    scopeParents.push(EXTERNAL_ORGANIZATION_MENU_KEY);
    const org = EXTERNAL_ORGANIZATIONS.find((o) => o.menuKey === activeLeaf);
    if (org?.parentMenuKey) scopeParents.push(org.parentMenuKey);
  }

  return [...new Set([...scopeParents, ...other, activeLeaf])];
}

/** Controlled Menu openKeys: accordion + đóng submenu cha được tôn trọng. */
export function useNavMenuOpenKeys(pathname: string) {
  const [openKeys, setOpenKeys] = useState<string[]>(() =>
    navOpenKeysForPath(pathname),
  );

  useEffect(() => {
    const fromRoute = navOpenKeysForPath(pathname);
    setOpenKeys((prev) => (keysEqual(prev, fromRoute) ? prev : fromRoute));
  }, [pathname]);

  const onOpenChange = useCallback((keys: string[]) => {
    setOpenKeys((prev) => {
      const afterRoot = enforceSingleRootMenu(keys, prev);

      const collapsed = applyUserCollapse(prev, afterRoot);
      if (collapsed !== null) {
        return keysEqual(prev, collapsed) ? prev : collapsed;
      }

      const openLeaves = afterRoot.filter((k) => LEAF_ORG_MENU_KEYS.has(k));

      if (openLeaves.length <= 1) {
        const next = normalizeOpenKeysForExpand(afterRoot, openLeaves);
        return keysEqual(prev, next) ? prev : next;
      }

      const prevLeaves = prev.filter((k) => LEAF_ORG_MENU_KEYS.has(k));
      const added = openLeaves.find((k) => !prevLeaves.includes(k));
      const keepLeaf = added ?? openLeaves[openLeaves.length - 1];
      const next = normalizeOpenKeysForExpand(afterRoot, [keepLeaf]);
      return keysEqual(prev, next) ? prev : next;
    });
  }, []);

  return { openKeys, onOpenChange };
}

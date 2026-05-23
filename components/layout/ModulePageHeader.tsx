"use client";

import type { ReactNode } from "react";
import { Tag } from "antd";
import { useModulePageHeaderMeta } from "@/hooks/useModulePageHeaderMeta";
import type { ModulePageHeaderTag } from "./ModulePageHeader.types";
import "./module-page-header.css";

export type { ModulePageHeaderTag };

export function ModulePageHeader({
  title,
  breadcrumb,
  tags,
  children,
}: {
  title: string;
  breadcrumb?: string;
  tags?: ModulePageHeaderTag[];
  children?: ReactNode;
}) {
  const meta = useModulePageHeaderMeta();
  const headerTags = tags ?? meta.tags;
  const headerBreadcrumb = breadcrumb ?? meta.breadcrumb;

  return (
    <header className="module-page-header">
      <div className="module-page-title-row">
        <h1 className="module-page-title">{title}</h1>
        {headerTags.map((tag) => (
          <Tag key={tag.key} className="module-page-tag" color={tag.color}>
            {tag.label}
          </Tag>
        ))}
      </div>
      {headerBreadcrumb ? (
        <p className="module-page-breadcrumb">{headerBreadcrumb}</p>
      ) : null}
      {children ? <div className="module-page-tabs">{children}</div> : null}
    </header>
  );
}

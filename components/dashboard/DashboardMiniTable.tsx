"use client";

import type { ReactNode } from "react";

export type DashboardMiniTableColumn<T> = {
  key: string;
  title: string;
  align?: "left" | "center";
  cellClass?: string;
  render: (row: T) => ReactNode;
};

function cellClassName<T>(col: DashboardMiniTableColumn<T>) {
  return [
    col.cellClass,
    col.align === "center" ? "dashboard-mini-table-cell--center" : undefined,
  ]
    .filter(Boolean)
    .join(" ");
}

export function DashboardMiniTable<T>({
  title,
  columns,
  rows,
  getRowKey,
}: {
  title: string;
  columns: DashboardMiniTableColumn<T>[];
  rows: T[];
  getRowKey: (row: T, index: number) => string;
}) {
  return (
    <div className="dashboard-mini-table-panel">
      <h4 className="dashboard-mini-table-title">{title}</h4>
      <div className="dashboard-mini-table-scroll">
        <table className="dashboard-mini-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} className={cellClassName(col)}>
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={getRowKey(row, index)}>
                {columns.map((col) => (
                  <td key={col.key} className={cellClassName(col)}>
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

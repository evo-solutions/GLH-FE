"use client";

import { Button, Input, Select } from "antd";
import { ClearOutlined, SearchOutlined } from "@ant-design/icons";
import type { FilterOption } from "@/lib/listFilter";

export type ListFilterSelectConfig = {
  id: string;
  label: string;
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  options: FilterOption[];
  placeholder?: string;
  minWidth?: number;
};

type ListScreenFiltersProps = {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  selects?: ListFilterSelectConfig[];
  clearLabel: string;
  onClear: () => void;
  hasActiveFilters: boolean;
};

export function ListScreenFilters({
  searchValue,
  onSearchChange,
  searchPlaceholder,
  selects = [],
  clearLabel,
  onClear,
  hasActiveFilters,
}: ListScreenFiltersProps) {
  return (
    <div className="list-filters-bar">
      <div className="list-filters-row">
        <Input
          allowClear
          size="middle"
          prefix={<SearchOutlined className="list-filters-search-icon" />}
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="list-filters-search"
          aria-label={searchPlaceholder}
        />
        {selects.map((field) => (
          <Select
            key={field.id}
            allowClear
            showSearch
            size="middle"
            optionFilterProp="label"
            placeholder={field.placeholder ?? field.label}
            value={field.value}
            onChange={(v) => field.onChange(v)}
            options={field.options}
            style={{ minWidth: field.minWidth ?? 148 }}
            aria-label={field.label}
          />
        ))}
        {hasActiveFilters ? (
          <Button
            type="link"
            size="small"
            className="list-filters-clear"
            icon={<ClearOutlined />}
            onClick={onClear}
          >
            {clearLabel}
          </Button>
        ) : null}
      </div>
    </div>
  );
}

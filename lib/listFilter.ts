/** Chuẩn hóa chuỗi tìm kiếm (bỏ dấu, lowercase). */
export function normalizeSearchText(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

/** Khớp query với bất kỳ trường nào (substring, không phân biệt dấu). */
export function matchesSearch(
  query: string,
  ...fields: (string | number | undefined | null)[]
): boolean {
  const q = normalizeSearchText(query);
  if (!q) return true;
  return fields.some((field) => {
    if (field === undefined || field === null || field === "") return false;
    return normalizeSearchText(String(field)).includes(q);
  });
}

export interface FilterOption {
  value: string;
  label: string;
}

/** Lấy danh sách option duy nhất từ dữ liệu, sắp xếp theo label. */
export function uniqueFilterOptions<T>(
  items: T[],
  getValue: (item: T) => string | undefined | null,
  getLabel: (item: T) => string = (item) => getValue(item) ?? ""
): FilterOption[] {
  const map = new Map<string, string>();
  for (const item of items) {
    const value = getValue(item);
    if (!value || map.has(value)) continue;
    map.set(value, getLabel(item) || value);
  }
  return Array.from(map.entries())
    .map(([value, label]) => ({ value, label }))
    .sort((a, b) => a.label.localeCompare(b.label, "vi"));
}

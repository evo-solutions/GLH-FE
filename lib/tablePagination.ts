import type { TablePaginationConfig } from "antd/es/table";

/** Số dòng mặc định trên mỗi trang cho mọi bảng trong app. */
export const TABLE_PAGE_SIZE = 20;

/**
 * Chiều cao vùng body cuộn dọc (px). Header + pagination cố định; chỉ tbody scroll.
 * ~10–11 dòng size="small" hiển thị cùng lúc; tối đa 20 dòng/trang cuộn trong vùng này.
 */
export const TABLE_BODY_SCROLL_Y = 460;

/** Phân trang chuẩn: 20 dòng/trang, không đổi page size. */
export const defaultTablePagination: TablePaginationConfig = {
  pageSize: TABLE_PAGE_SIZE,
  showSizeChanger: false,
};

/** Scroll cố định: header sticky, body scroll dọc; gộp thêm scroll ngang nếu cần. */
export function tableScroll(x?: number | string | true) {
  return x === undefined
    ? { y: TABLE_BODY_SCROLL_Y }
    : { x, y: TABLE_BODY_SCROLL_Y };
}

import type { SupplySourceData } from "@/types/supply-source";
import { supplySourceMockVi } from "./supply-source.mock";

export const supplySourceMockZh: SupplySourceData = {
  domestic: {
    scope: "domestic",
    regions: supplySourceMockVi.domestic.regions.map((r) => ({
      ...r,
      sections: r.sections.map((s) => ({
        ...s,
        fields: s.fields.map((f) => ({
          ...f,
          label:
            f.label === "Địa điểm"
              ? "地点"
              : f.label === "Diện tích canh tác" || f.label === "Diện tích"
                ? "面积"
                : f.label === "Độ cao"
                  ? "海拔"
                  : f.label === "Tổ chức" || f.label === "Doanh nghiệp"
                    ? "组织"
                    : f.label === "Chủng loại"
                      ? "品种"
                      : f.label === "Thời vụ thu hái" || f.label === "Thời vụ"
                        ? "采收季"
                        : f.label === "Năng suất"
                          ? "产量"
                          : f.label === "Đơn giá"
                            ? "单价"
                            : f.label === "Thanh toán"
                              ? "付款"
                              : f.label,
        })),
      })),
    })),
  },
  international: supplySourceMockVi.international,
  import: supplySourceMockVi.import,
};

import type { SupplySourceData } from "@/types/supply-source";
import { supplySourceMockVi } from "./supply-source.mock";

/** English labels; region narratives aligned with VI mock. */
export const supplySourceMockEn: SupplySourceData = {
  domestic: {
    scope: "domestic",
    regions: supplySourceMockVi.domestic.regions.map((r) => ({
      ...r,
      name: r.name
        .replace("Lào Cai — Sa Pa", "Lao Cai — Sa Pa")
        .replace("Hòa Bình — Mai Châu", "Hoa Binh — Mai Chau")
        .replace("Quảng Nam — Nam Trà My", "Quang Nam — Nam Tra My"),
      sections: r.sections.map((s) => ({
        ...s,
        fields: s.fields.map((f) => ({
          ...f,
          label:
            f.label === "Địa điểm"
              ? "Location"
              : f.label === "Diện tích canh tác" || f.label === "Diện tích"
                ? "Area"
                : f.label === "Độ cao"
                  ? "Altitude"
                  : f.label === "Tổ chức" || f.label === "Doanh nghiệp"
                    ? "Organization"
                    : f.label === "Chủng loại"
                      ? "Species"
                      : f.label === "Thời vụ thu hái" || f.label === "Thời vụ"
                        ? "Harvest season"
                        : f.label === "Năng suất"
                          ? "Yield"
                          : f.label === "Đơn giá tham chiếu" || f.label === "Đơn giá"
                            ? "Unit price"
                            : f.label === "Thanh toán"
                              ? "Payment"
                              : f.label,
        })),
      })),
    })),
  },
  international: {
    scope: "international",
    regions: supplySourceMockVi.international.regions.map((r) => ({
      ...r,
      name: r.name
        .replace("Vân Nam", "Yunnan")
        .replace("Lào — Bolaven", "Laos — Bolaven"),
    })),
  },
  import: {
    scope: "import",
    regions: supplySourceMockVi.import.regions.map((r) => ({
      ...r,
      name: r.name.replace("Nhập khẩu", "Import"),
    })),
  },
};

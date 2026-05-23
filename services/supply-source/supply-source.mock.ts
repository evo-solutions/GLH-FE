import type { SupplyGrowingRegion, SupplySourceData } from "@/types/supply-source";
import { SUPPLY_SECTION_PERMISSION } from "@/libs/supply-source/permissions";

function region(
  id: string,
  regionCode: string,
  name: string,
  sections: SupplyGrowingRegion["sections"],
): SupplyGrowingRegion {
  return {
    id,
    regionCode,
    name,
    permissionCommand: "GLH.SUPPLY.REGION.VIEW",
    sections,
  };
}

const domesticRegions: SupplyGrowingRegion[] = [
  region("vn-r1", "VT-LC-01", "Vùng trồng Tây Bắc · Lào Cai — Sa Pa (Sâm quý)", [
    {
      id: "location",
      permissionCommand: SUPPLY_SECTION_PERMISSION.location,
      fields: [
        { key: "addr", label: "Địa điểm", value: "Xã Tả Phìn, huyện Sa Pa, tỉnh Lào Cai" },
        { key: "area", label: "Diện tích canh tác", value: "42 ha (hợp tác xã + hộ gia đình)" },
        { key: "alt", label: "Độ cao", value: "1.450 – 1.720 m so với mực nước biển" },
        { key: "coord", label: "Tọa độ tham chiếu", value: "22°20'N · 103°50'E (vùng lõi)" },
      ],
    },
    {
      id: "enterprise",
      permissionCommand: SUPPLY_SECTION_PERMISSION.enterprise,
      fields: [
        { key: "org", label: "Tổ chức", value: "HTX Dược liệu Sa Pa — Bông Sen Vàng" },
        { key: "rep", label: "Đại diện", value: "Nguyễn Văn B — Giám đốc HTX" },
        { key: "license", label: "Giấy phép", value: "Số 12/GP-UBND-LC · GACP nội địa" },
        { key: "contact", label: "Liên hệ", value: "supply.sapa@glh.vn · 0214 xxx xxx" },
      ],
    },
    {
      id: "soilClimate",
      permissionCommand: SUPPLY_SECTION_PERMISSION.soilClimate,
      fields: [
        { key: "soil", label: "Thổ nhưỡng", value: "Pha cát phù sa, pH 5.2–5.8, hàm lượng hữu cơ cao" },
        { key: "climate", label: "Khí hậu", value: "Khí hậu ôn đới núi cao, sương mù dày T10–T3" },
        { key: "hydro", label: "Thủy văn", value: "Nguồn suối khe Sa Pa, tưới nhỏ giọt 65% diện tích" },
      ],
    },
    {
      id: "species",
      permissionCommand: SUPPLY_SECTION_PERMISSION.species,
      fields: [
        { key: "species", label: "Chủng loại", value: "Sâm (Panax vietnamensis) — giống chọn lọc GLH-VN-01" },
        { key: "age", label: "Tuổi cây", value: "6–8 năm (thu hoạch củ)" },
        { key: "cert", label: "Tiêu chuẩn", value: "VietGAP · truy xuất QR theo lô" },
      ],
    },
    {
      id: "harvestYield",
      permissionCommand: SUPPLY_SECTION_PERMISSION.harvestYield,
      fields: [
        { key: "season", label: "Thời vụ thu hái", value: "T9–T11 hàng năm (sau mùa mưa)" },
        { key: "yield", label: "Năng suất", value: "~280 kg củ tươi/ha/vụ (ước tính 2025)" },
        { key: "forecast", label: "Dự báo 2026", value: "+8% nhờ mở rộng 6 ha liên kết" },
      ],
    },
    {
      id: "processingLogistics",
      permissionCommand: SUPPLY_SECTION_PERMISSION.processingLogistics,
      fields: [
        { key: "transport", label: "Vận chuyển", value: "Xe lạnh 2–8°C · Sa Pa → Kho sơ chế Hòa Bình (8h)" },
        { key: "prep", label: "Sơ chế", value: "Rửa, cắt khúc, sấy lạnh thăng hoa tại HB" },
        { key: "format", label: "Định dạng", value: "Củ nguyên, lát mỏng 3mm, bột mịn 80 mesh" },
        { key: "storage", label: "Bảo quản", value: "Kho 15–18°C, RH < 65%, COA đính kèm mỗi lô" },
      ],
    },
    {
      id: "pricingTerms",
      permissionCommand: SUPPLY_SECTION_PERMISSION.pricingTerms,
      fields: [
        { key: "price", label: "Đơn giá tham chiếu", value: "₫4.850.000/kg củ sấy (FOB kho HB)" },
        { key: "payment", label: "Thanh toán", value: "30% tạm ứng · 70% sau QC & COA (Net 15)" },
        { key: "ship", label: "Vận chuyển", value: "CIF nội địa do GLH đặt xe lạnh" },
        { key: "delivery", label: "Giao hàng", value: "Trong 5 ngày làm việc sau nghiệm thu lô" },
      ],
    },
  ]),
  region("vn-r2", "VT-HB-02", "Hòa Bình — Mai Châu (Đương quy)", [
    {
      id: "location",
      permissionCommand: SUPPLY_SECTION_PERMISSION.location,
      fields: [
        { key: "addr", label: "Địa điểm", value: "Xã Pùng, huyện Mai Châu, tỉnh Hòa Bình" },
        { key: "area", label: "Diện tích", value: "28 ha liên kết" },
        { key: "alt", label: "Độ cao", value: "380 – 520 m" },
      ],
    },
    {
      id: "enterprise",
      permissionCommand: SUPPLY_SECTION_PERMISSION.enterprise,
      fields: [
        { key: "org", label: "Doanh nghiệp", value: "Công ty TNHH Dược liệu Mai Châu GLH" },
        { key: "rep", label: "Phụ trách", value: "Trần Thị H — Trưởng vùng nguyên liệu" },
      ],
    },
    {
      id: "soilClimate",
      permissionCommand: SUPPLY_SECTION_PERMISSION.soilClimate,
      fields: [
        { key: "soil", label: "Thổ nhưỡng", value: "Đất feralit đỏ bazan, thoát nước tốt" },
        { key: "climate", label: "Khí hậu", value: "Nhiệt đới gió mùa, mưa tập trung T5–T9" },
        { key: "hydro", label: "Thủy văn", value: "Sông Mã nhánh phụ, bơm tưới 40% diện tích" },
      ],
    },
    {
      id: "species",
      permissionCommand: SUPPLY_SECTION_PERMISSION.species,
      fields: [
        { key: "species", label: "Chủng loại", value: "Đương quy (Angelica sinensis) — GLH-DQ-03" },
        { key: "part", label: "Bộ phận dùng", value: "Rễ — thu hái năm thứ 2" },
      ],
    },
    {
      id: "harvestYield",
      permissionCommand: SUPPLY_SECTION_PERMISSION.harvestYield,
      fields: [
        { key: "season", label: "Thời vụ", value: "T11–T12 (rễ đạt dược tính)" },
        { key: "yield", label: "Năng suất", value: "~1.2 tấn rễ tươi/ha/vụ" },
      ],
    },
    {
      id: "processingLogistics",
      permissionCommand: SUPPLY_SECTION_PERMISSION.processingLogistics,
      fields: [
        { key: "transport", label: "Vận chuyển", value: "Xe thường có nhiệt kế · Mai Châu → Kho GLH HN (4h)" },
        { key: "prep", label: "Sơ chế", value: "Rửa, hấp thụi, sấy khô 45°C" },
        { key: "format", label: "Định dạng", value: "Rễ nguyên, thanh cắt 5cm" },
        { key: "storage", label: "Bảo quản", value: "Bao PE 25kg, pallet, kho khô" },
      ],
    },
    {
      id: "pricingTerms",
      permissionCommand: SUPPLY_SECTION_PERMISSION.pricingTerms,
      fields: [
        { key: "price", label: "Đơn giá", value: "₫185.000/kg rễ sấy (EXW Mai Châu)" },
        { key: "payment", label: "Thanh toán", value: "LC nội địa hoặc chuyển khoản 100% sau giao" },
        { key: "delivery", label: "Giao hàng", value: "Gom lô tối thiểu 500 kg" },
      ],
    },
  ]),
  region("vn-r3", "VT-QN-03", "Quảng Nam — Nam Trà My (Sâm Ngọc Linh)", [
    {
      id: "location",
      permissionCommand: SUPPLY_SECTION_PERMISSION.location,
      fields: [
        { key: "addr", label: "Địa điểm", value: "Xã Trà Leng, huyện Nam Trà My" },
        { key: "area", label: "Diện tích", value: "18 ha (vùng bảo tồn kết hợp)" },
        { key: "alt", label: "Độ cao", value: "1.200 – 1.480 m" },
      ],
    },
    {
      id: "enterprise",
      permissionCommand: SUPPLY_SECTION_PERMISSION.enterprise,
      fields: [
        { key: "org", label: "Đối tác", value: "HTX Sâm Ngọc Linh Nam Trà My" },
        { key: "joint", label: "Liên doanh", value: "GLH 51% — HTX 49% (hợp đồng 2024–2029)" },
      ],
    },
    {
      id: "soilClimate",
      permissionCommand: SUPPLY_SECTION_PERMISSION.soilClimate,
      fields: [
        { key: "soil", label: "Thổ nhưỡng", value: "Đất vàng đỏ trên đá phiến sét" },
        { key: "climate", label: "Khí hậu", value: "Ẩm cao, mưa bốn mùa, nhiệt độ TB 22°C" },
      ],
    },
    {
      id: "species",
      permissionCommand: SUPPLY_SECTION_PERMISSION.species,
      fields: [
        { key: "species", label: "Chủng loại", value: "Sâm Ngọc Linh (Panax vietnamensis var.)" },
        { key: "trace", label: "Truy xuất", value: "Blockchain lô GLH-SNL-2026" },
      ],
    },
    {
      id: "harvestYield",
      permissionCommand: SUPPLY_SECTION_PERMISSION.harvestYield,
      fields: [
        { key: "season", label: "Thời vụ", value: "T10 (củ 5–7 tuổi)" },
        { key: "yield", label: "Năng suất", value: "~95 kg củ khô/ha/vụ (hạn chế diện tích)" },
      ],
    },
    {
      id: "processingLogistics",
      permissionCommand: SUPPLY_SECTION_PERMISSION.processingLogistics,
      fields: [
        { key: "transport", label: "Vận chuyển", value: "Xe bảo quản · Nam Trà My → Đà Nẵng sơ chế" },
        { key: "prep", label: "Chế biến", value: "Rửa, sấy mây, đóng gói chân không 250g" },
      ],
    },
    {
      id: "pricingTerms",
      permissionCommand: SUPPLY_SECTION_PERMISSION.pricingTerms,
      fields: [
        { key: "price", label: "Đơn giá", value: "Thỏa thuận theo hàm lượng saponin (bảng giá nội bộ)" },
        { key: "payment", label: "Thanh toán", value: "Escrow QC — giải ngân 7 ngày" },
      ],
    },
  ]),
];

const internationalRegions: SupplyGrowingRegion[] = [
  region("int-r1", "VT-YN-01", "Vân Nam — Vùng đồi trà (Đinh lăng, Tam thất)", [
    {
      id: "location",
      permissionCommand: SUPPLY_SECTION_PERMISSION.location,
      fields: [
        { key: "addr", label: "Địa điểm", value: "Châu Hưng, Vân Nam, Trung Quốc (đối tác xuất khẩu)" },
        { key: "area", label: "Diện tích", value: "120 ha hợp đồng dài hạn" },
        { key: "alt", label: "Độ cao", value: "900 – 1.100 m" },
      ],
    },
    {
      id: "enterprise",
      permissionCommand: SUPPLY_SECTION_PERMISSION.enterprise,
      fields: [
        { key: "org", label: "Tổ chức", value: "Yunnan Herbal Co-op — đại lý GLH ASEAN" },
        { key: "license", label: "Giấy phép", value: "Nhập khẩu dược liệu sơ chế · C/O Form E" },
      ],
    },
    {
      id: "soilClimate",
      permissionCommand: SUPPLY_SECTION_PERMISSION.soilClimate,
      fields: [
        { key: "soil", label: "Thổ nhưỡng", value: "Đất đỏ bazan vùng đồi" },
        { key: "climate", label: "Khí hậu", value: "Cận nhiệt đới, mùa khô T11–T4" },
        { key: "hydro", label: "Thủy văn", value: "Tưới đập nhỏ, hồ chứa 2.5 triệu m³" },
      ],
    },
    {
      id: "species",
      permissionCommand: SUPPLY_SECTION_PERMISSION.species,
      fields: [
        { key: "species", label: "Chủng loại", value: "Đinh lăng, Tam thất — chứng nhận GAP Trung Quốc" },
      ],
    },
    {
      id: "harvestYield",
      permissionCommand: SUPPLY_SECTION_PERMISSION.harvestYield,
      fields: [
        { key: "season", label: "Thời vụ", value: "2 vụ/năm (T3, T9)" },
        { key: "yield", label: "Năng suất", value: "~2.8 tấn/lô (gộp 2 species)" },
      ],
    },
    {
      id: "processingLogistics",
      permissionCommand: SUPPLY_SECTION_PERMISSION.processingLogistics,
      fields: [
        { key: "transport", label: "Vận chuyển", value: "Container lạnh · Hekou → Lào Cai (GLH kho biên)" },
        { key: "prep", label: "Sơ chế", value: "Sấy tại nguồn, kiểm dư lượng trước xuất" },
        { key: "format", label: "Định dạng", value: "Củ cắt, bột, chiết xuất cô đặc (MOQ riêng)" },
        { key: "storage", label: "Bảo quản", value: "Kho ICD Lào Cai, kiểm nghiệm lại tại VN" },
      ],
    },
    {
      id: "pricingTerms",
      permissionCommand: SUPPLY_SECTION_PERMISSION.pricingTerms,
      fields: [
        { key: "price", label: "Đơn giá", value: "USD 12.5/kg (CIF Lào Cai, Incoterms 2020)" },
        { key: "payment", label: "Thanh toán", value: "T/T 50/50 hoặc L/C at sight" },
        { key: "ship", label: "Vận chuyển", value: "Đường bộ + hải quan song phương" },
        { key: "delivery", label: "Giao hàng", value: "Lô 2 tấn, lead time 21 ngày" },
      ],
    },
  ]),
  region("int-r2", "VT-LA-02", "Lào — Bolaven (Cà gai leo, Nhân sâm Lào)", [
    {
      id: "location",
      permissionCommand: SUPPLY_SECTION_PERMISSION.location,
      fields: [
        { key: "addr", label: "Địa điểm", value: "Champasak, Cao nguyên Bolaven" },
        { key: "area", label: "Diện tích", value: "65 ha" },
        { key: "alt", label: "Độ cao", value: "1.000 – 1.350 m" },
      ],
    },
    {
      id: "enterprise",
      permissionCommand: SUPPLY_SECTION_PERMISSION.enterprise,
      fields: [
        { key: "org", label: "Đối tác", value: "Bolaven Organic Farm Co., Ltd" },
        { key: "rep", label: "Liên hệ", value: "Somphone K. — Country manager" },
      ],
    },
    {
      id: "soilClimate",
      permissionCommand: SUPPLY_SECTION_PERMISSION.soilClimate,
      fields: [
        { key: "soil", label: "Thổ nhưỡng", value: "Đất bazan đỏ, volcanic" },
        { key: "climate", label: "Khí hậu", value: "Mát quanh năm, mưa 1.800mm/năm" },
      ],
    },
    {
      id: "species",
      permissionCommand: SUPPLY_SECTION_PERMISSION.species,
      fields: [
        { key: "species", label: "Chủng loại", value: "Cà gai leo, Sâm Lào (hợp đồng organic EU)" },
      ],
    },
    {
      id: "harvestYield",
      permissionCommand: SUPPLY_SECTION_PERMISSION.harvestYield,
      fields: [
        { key: "season", label: "Thời vụ", value: "Quanh năm (xoay vụ theo species)" },
        { key: "yield", label: "Năng suất", value: "~4.2 tấn tươi/ha/năm (cà gai leo)" },
      ],
    },
    {
      id: "processingLogistics",
      permissionCommand: SUPPLY_SECTION_PERMISSION.processingLogistics,
      fields: [
        { key: "transport", label: "Vận chuyển", value: "Bolaven → Pakse → Đà Nẵng (đường bộ + biển)" },
        { key: "prep", label: "Chế biến", value: "Sấy khô, nghiền tại Pakse" },
      ],
    },
    {
      id: "pricingTerms",
      permissionCommand: SUPPLY_SECTION_PERMISSION.pricingTerms,
      fields: [
        { key: "price", label: "Đơn giá", value: "USD 8.2/kg (FOB Pakse)" },
        { key: "payment", label: "Thanh toán", value: "Net 30 sau B/L" },
      ],
    },
  ]),
];

const importRegions: SupplyGrowingRegion[] = [
  region("imp-r1", "VT-YN-02", "Nhập khẩu — Vân Nam (Đinh lăng, Tam thất)", [
    {
      id: "location",
      permissionCommand: SUPPLY_SECTION_PERMISSION.location,
      fields: [
        { key: "addr", label: "Cửa khẩu / kho nhập", value: "Hekou — Kho ICD Lào Cai (GLH)" },
        { key: "area", label: "Quy mô hợp đồng", value: "120 ha · 2 species" },
      ],
    },
    {
      id: "enterprise",
      permissionCommand: SUPPLY_SECTION_PERMISSION.enterprise,
      fields: [
        { key: "org", label: "Nhà cung cấp", value: "Yunnan Herbal Co-op" },
        { key: "license", label: "Hồ sơ NK", value: "C/O Form E · Kiểm dư lượng batch" },
      ],
    },
    {
      id: "soilClimate",
      permissionCommand: SUPPLY_SECTION_PERMISSION.soilClimate,
      fields: [
        { key: "soil", label: "Vùng trồng gốc", value: "Đồi trà Châu Hưng, Vân Nam" },
        { key: "climate", label: "Khí hậu", value: "Cận nhiệt đới" },
      ],
    },
    {
      id: "species",
      permissionCommand: SUPPLY_SECTION_PERMISSION.species,
      fields: [
        { key: "species", label: "Chủng loại", value: "Đinh lăng · Tam thất (GAP TQ)" },
      ],
    },
    {
      id: "harvestYield",
      permissionCommand: SUPPLY_SECTION_PERMISSION.harvestYield,
      fields: [
        { key: "season", label: "Thời vụ", value: "2 vụ/năm" },
        { key: "yield", label: "Năng suất", value: "~2.8 tấn/lô gộp" },
      ],
    },
    {
      id: "processingLogistics",
      permissionCommand: SUPPLY_SECTION_PERMISSION.processingLogistics,
      fields: [
        { key: "transport", label: "Vận chuyển", value: "Container lạnh · Hekou → Lào Cai" },
        { key: "prep", label: "Sơ chế", value: "Sấy tại nguồn, QC trước xuất" },
        { key: "format", label: "Định dạng", value: "Củ cắt · bột · chiết xuất" },
        { key: "storage", label: "Bảo quản", value: "Kho ICD, kiểm nghiệm lại VN" },
      ],
    },
    {
      id: "pricingTerms",
      permissionCommand: SUPPLY_SECTION_PERMISSION.pricingTerms,
      fields: [
        { key: "price", label: "Đơn giá", value: "USD 12.5/kg (CIF Lào Cai)" },
        { key: "payment", label: "Thanh toán", value: "T/T 50/50 · L/C at sight" },
        { key: "delivery", label: "Giao hàng", value: "Lô 2 tấn · lead 21 ngày" },
      ],
    },
  ]),
  region("imp-r2", "VT-LA-03", "Nhập khẩu — Lào Bolaven (Organic EU)", [
    {
      id: "location",
      permissionCommand: SUPPLY_SECTION_PERMISSION.location,
      fields: [
        { key: "addr", label: "Điểm nhập", value: "Pakse → cảng Đà Nẵng" },
        { key: "alt", label: "Vùng trồng", value: "Cao nguyên Bolaven 1.000–1.350 m" },
      ],
    },
    {
      id: "enterprise",
      permissionCommand: SUPPLY_SECTION_PERMISSION.enterprise,
      fields: [
        { key: "org", label: "Đối tác", value: "Bolaven Organic Farm Co., Ltd" },
      ],
    },
    {
      id: "soilClimate",
      permissionCommand: SUPPLY_SECTION_PERMISSION.soilClimate,
      fields: [
        { key: "soil", label: "Thổ nhưỡng", value: "Đất bazan đỏ volcanic" },
      ],
    },
    {
      id: "species",
      permissionCommand: SUPPLY_SECTION_PERMISSION.species,
      fields: [
        { key: "species", label: "Chủng loại", value: "Cà gai leo · Sâm Lào organic EU" },
      ],
    },
    {
      id: "harvestYield",
      permissionCommand: SUPPLY_SECTION_PERMISSION.harvestYield,
      fields: [
        { key: "yield", label: "Năng suất", value: "~4.2 tấn tươi/ha/năm" },
      ],
    },
    {
      id: "processingLogistics",
      permissionCommand: SUPPLY_SECTION_PERMISSION.processingLogistics,
      fields: [
        { key: "transport", label: "Vận chuyển", value: "Bolaven → Pakse → Đà Nẵng" },
        { key: "prep", label: "Chế biến", value: "Sấy khô, nghiền tại Pakse" },
      ],
    },
    {
      id: "pricingTerms",
      permissionCommand: SUPPLY_SECTION_PERMISSION.pricingTerms,
      fields: [
        { key: "price", label: "Đơn giá", value: "USD 8.2/kg (FOB Pakse)" },
        { key: "payment", label: "Thanh toán", value: "Net 30 sau B/L" },
      ],
    },
  ]),
];

export const supplySourceMockVi: SupplySourceData = {
  domestic: { scope: "domestic", regions: domesticRegions },
  international: { scope: "international", regions: internationalRegions },
  import: { scope: "import", regions: importRegions },
};


/**
 * Mock nguồn cung Bông Sen Vàng Holding.
 * Trường nhạy cảm: mã PLQ + nội dung demo (plain) khi có quyền giải mã.
 */

export type SupplyScope = "domestic" | "foreign";

export type ImportSupplyType = "tcm" | "snacks";

export type Locale = "vi" | "en" | "zh";

export interface LocalizedText {
  vi: string;
  en: string;
  zh: string;
}

export interface EncodedSupplyField {
  encoded: boolean;
  plainValue?: string;
  token?: string;
}

export interface SupplyFieldItem {
  id: string;
  label: LocalizedText;
  field: EncodedSupplyField;
}

export interface SupplyFieldGroup {
  id: string;
  title: LocalizedText;
  items: SupplyFieldItem[];
}

export interface GrowingZoneSupply {
  id: string;
  scope: SupplyScope;
  zoneCode: string;
  zoneName: EncodedSupplyField;
  summary: LocalizedText;
  groups: SupplyFieldGroup[];
}

export interface ImportSupplyRecord {
  id: string;
  type: ImportSupplyType;
  statusLabel: LocalizedText;
  supplierName: EncodedSupplyField;
  groups: SupplyFieldGroup[];
}

export function labelFor(text: LocalizedText, locale: Locale): string {
  return locale === "zh" ? text.zh : locale === "en" ? text.en : text.vi;
}

function enc(token: string, plain: string): EncodedSupplyField {
  return { encoded: true, token, plainValue: plain };
}

function open(value: string): EncodedSupplyField {
  return { encoded: false, plainValue: value };
}

function L(vi: string, en: string, zh: string): LocalizedText {
  return { vi, en, zh };
}

function buildLocationGroup(prefix: string, data: {
  province: string;
  district: string;
  areaHa: string;
  elevation: string;
  coordinates: string;
  certificate: string;
}): SupplyFieldGroup {
  return {
    id: `${prefix}-loc`,
    title: L("Địa điểm / diện tích / độ cao", "Site / area / elevation", "地点 / 面积 / 海拔"),
    items: [
      { id: "province", label: L("Tỉnh / thành", "Province / city", "省/市"), field: enc(`${prefix}-LOC-P`, data.province) },
      { id: "district", label: L("Huyện / xã", "District / commune", "县/乡"), field: enc(`${prefix}-LOC-D`, data.district) },
      { id: "area", label: L("Diện tích canh tác", "Cultivated area", "种植面积"), field: enc(`${prefix}-LOC-A`, data.areaHa) },
      { id: "elevation", label: L("Độ cao trung bình", "Mean elevation", "平均海拔"), field: enc(`${prefix}-LOC-E`, data.elevation) },
      { id: "gps", label: L("Tọa độ GPS", "GPS coordinates", "GPS坐标"), field: enc(`${prefix}-LOC-G`, data.coordinates) },
      { id: "cert", label: L("Giấy chứng nhận vùng trồng", "Growing zone certificate", "种植区认证"), field: enc(`${prefix}-LOC-C`, data.certificate) },
    ],
  };
}

function buildEntityGroup(prefix: string, data: {
  name: string;
  type: string;
  taxId: string;
  representative: string;
  phone: string;
  members: string;
  contract: string;
}): SupplyFieldGroup {
  return {
    id: `${prefix}-ent`,
    title: L("Doanh nghiệp / tổ chức / cá nhân", "Enterprise / organization / individual", "企业 / 组织 / 个人"),
    items: [
      { id: "name", label: L("Tên pháp nhân", "Legal name", "法人名称"), field: enc(`${prefix}-ENT-N`, data.name) },
      { id: "type", label: L("Loại hình", "Entity type", "类型"), field: open(data.type) },
      { id: "tax", label: L("Mã số thuế", "Tax ID", "税号"), field: enc(`${prefix}-ENT-T`, data.taxId) },
      { id: "rep", label: L("Người đại diện", "Representative", "代表人"), field: enc(`${prefix}-ENT-R`, data.representative) },
      { id: "phone", label: L("Liên hệ", "Contact", "联系方式"), field: open(data.phone) },
      { id: "members", label: L("Quy mô / hộ / lao động", "Scale / households / labor", "规模"), field: enc(`${prefix}-ENT-M`, data.members) },
      { id: "contract", label: L("Hợp đồng BSV", "BSV contract", "BSV合同"), field: enc(`${prefix}-ENT-C`, data.contract) },
    ],
  };
}

function buildSoilGroup(prefix: string, data: {
  soil: string;
  climate: string;
  rainfall: string;
  water: string;
  temperature: string;
  organic: string;
}): SupplyFieldGroup {
  return {
    id: `${prefix}-scl`,
    title: L("Thổ nhưỡng, khí hậu, thủy văn", "Soil, climate, hydrology", "土壤、气候、水文"),
    items: [
      { id: "soil", label: L("Loại đất", "Soil type", "土壤类型"), field: enc(`${prefix}-SCL-S`, data.soil) },
      { id: "climate", label: L("Khí hậu vùng", "Regional climate", "区域气候"), field: enc(`${prefix}-SCL-C`, data.climate) },
      { id: "rain", label: L("Lượng mưa", "Rainfall", "降雨量"), field: open(data.rainfall) },
      { id: "water", label: L("Nguồn nước / thủy văn", "Water / hydrology", "水源/水文"), field: enc(`${prefix}-SCL-W`, data.water) },
      { id: "temp", label: L("Nhiệt độ TB", "Avg. temperature", "平均温度"), field: open(data.temperature) },
      { id: "organic", label: L("Hàm lượng hữu cơ", "Organic matter", "有机质"), field: enc(`${prefix}-SCL-O`, data.organic) },
    ],
  };
}

function buildSpeciesGroup(prefix: string, species: { name: string; area: string; age: string; gap: string }[]): SupplyFieldGroup {
  return {
    id: `${prefix}-spc`,
    title: L("Chủng loại cây thuốc", "Medicinal plant species", "药用植物品种"),
    items: species.flatMap((s, i) => [
      {
        id: `sp-${i}-n`,
        label: L(`Giống ${i + 1} · tên`, `Species ${i + 1} · name`, `品种 ${i + 1} · 名称`),
        field: enc(`${prefix}-SPC-${i}N`, s.name),
      },
      {
        id: `sp-${i}-a`,
        label: L(`Giống ${i + 1} · diện tích`, `Species ${i + 1} · area`, `品种 ${i + 1} · 面积`),
        field: open(s.area),
      },
      {
        id: `sp-${i}-y`,
        label: L(`Giống ${i + 1} · tuổi cây`, `Species ${i + 1} · plant age`, `品种 ${i + 1} · 树龄`),
        field: enc(`${prefix}-SPC-${i}Y`, s.age),
      },
      {
        id: `sp-${i}-g`,
        label: L(`Giống ${i + 1} · GAP`, `Species ${i + 1} · GAP`, `品种 ${i + 1} · GAP`),
        field: open(s.gap),
      },
    ]),
  };
}

function buildHarvestGroup(prefix: string, data: {
  seasons: string;
  yieldFresh: string;
  yieldDry: string;
  lossRate: string;
  qc: string;
  traceCode: string;
}): SupplyFieldGroup {
  return {
    id: `${prefix}-hrv`,
    title: L("Thời vụ thu hái & năng suất", "Harvest season & yield", "采收季节与产量"),
    items: [
      { id: "season", label: L("Thời vụ thu hái", "Harvest seasons", "采收季"), field: enc(`${prefix}-HRV-S`, data.seasons) },
      { id: "fresh", label: L("Sản lượng tươi", "Fresh yield", "鲜品产量"), field: open(data.yieldFresh) },
      { id: "dry", label: L("Sản lượng khô", "Dry yield", "干品产量"), field: enc(`${prefix}-HRV-D`, data.yieldDry) },
      { id: "loss", label: L("Tỷ lệ hao hụt sơ chế", "Processing loss", "初加工损耗"), field: open(data.lossRate) },
      { id: "qc", label: L("Tiêu chuẩn QC", "QC standard", "质检标准"), field: enc(`${prefix}-HRV-Q`, data.qc) },
      { id: "trace", label: L("Mã truy xuất vùng", "Zone traceability code", "产区追溯码"), field: enc(`${prefix}-HRV-T`, data.traceCode) },
    ],
  };
}

function buildLogisticsGroup(prefix: string, data: {
  transport: string;
  preprocess: string;
  process: string;
  format: string;
  storage: string;
  shelfLife: string;
  packaging: string;
}): SupplyFieldGroup {
  return {
    id: `${prefix}-log`,
    title: L("Vận chuyển, sơ chế, chế biến, bảo quản", "Transport, processing, storage", "运输、加工、仓储"),
    items: [
      { id: "trans", label: L("Vận chuyển", "Transport", "运输"), field: enc(`${prefix}-LOG-T`, data.transport) },
      { id: "pre", label: L("Sơ chế", "Pre-processing", "初加工"), field: enc(`${prefix}-LOG-P`, data.preprocess) },
      { id: "proc", label: L("Chế biến", "Processing", "深加工"), field: open(data.process) },
      { id: "fmt", label: L("Định dạng thành phẩm", "Product format", "成品规格"), field: enc(`${prefix}-LOG-F`, data.format) },
      { id: "store", label: L("Bảo quản", "Storage", "仓储"), field: enc(`${prefix}-LOG-S`, data.storage) },
      { id: "shelf", label: L("Hạn sử dụng", "Shelf life", "保质期"), field: open(data.shelfLife) },
      { id: "pack", label: L("Quy cách đóng gói", "Packaging", "包装"), field: enc(`${prefix}-LOG-K`, data.packaging) },
    ],
  };
}

function buildCommercialGroup(prefix: string, data: {
  unitPrice: string;
  payment: string;
  shipping: string;
  delivery: string;
  moq: string;
  incoterm: string;
  validUntil: string;
}): SupplyFieldGroup {
  return {
    id: `${prefix}-com`,
    title: L("Đơn giá / thanh toán / vận chuyển / giao hàng", "Price / payment / delivery", "价格 / 付款 / 交货"),
    items: [
      { id: "price", label: L("Đơn giá tham chiếu", "Reference unit price", "参考单价"), field: enc(`${prefix}-COM-P`, data.unitPrice) },
      { id: "pay", label: L("Điều kiện thanh toán", "Payment terms", "付款条件"), field: enc(`${prefix}-COM-Y`, data.payment) },
      { id: "ship", label: L("Điều kiện vận chuyển", "Shipping terms", "运输条件"), field: open(data.shipping) },
      { id: "del", label: L("Giao hàng", "Delivery", "交货"), field: enc(`${prefix}-COM-D`, data.delivery) },
      { id: "moq", label: L("MOQ / MOA", "MOQ / MOA", "最小订量"), field: open(data.moq) },
      { id: "inco", label: L("Incoterm", "Incoterm", "贸易术语"), field: enc(`${prefix}-COM-I`, data.incoterm) },
      { id: "valid", label: L("Hiệu lực báo giá", "Quote validity", "报价有效期"), field: open(data.validUntil) },
    ],
  };
}

const DOMESTIC_ZONES: GrowingZoneSupply[] = [
  {
    id: "dz-1",
    scope: "domestic",
    zoneCode: "PLQ-VT-001",
    zoneName: enc("PLQ-VT-001", "Vùng trồng Tây Bắc · Lai Châu"),
    summary: L(
      "Vùng sâm và dược liệu cao nguyên · 42 ha · chứng nhận GACP nội bộ",
      "Highland ginseng & herbs · 42 ha · internal GACP",
      "高山参及药材 · 42公顷"
    ),
    groups: [
      buildLocationGroup("VT1", {
        province: "Lai Châu",
        district: "Sìn Hồ · Pa Tần",
        areaHa: "42 ha (đất được cấp 38 ha + mở rộng 4 ha)",
        elevation: "1.050 – 1.280 m so với mực nước biển",
        coordinates: "22°18'12\"N · 103°24'51\"E",
        certificate: "CN-VT-2024-0187 · BSV audit 03/2026",
      }),
      buildEntityGroup("VT1", {
        name: "HTX Dược liệu Sìn Hồ",
        type: "Hợp tác xã",
        taxId: "0108 456 221",
        representative: "Nguyễn Văn Thọ · Chủ nhiệm HTX",
        phone: "0214 3876 550 · 0912 880 334",
        members: "186 hộ · 420 lao động mùa vụ",
        contract: "HĐ-BSV-2024-VT-018 · 36 tháng",
      }),
      buildSoilGroup("VT1", {
        soil: "Ferralsol đỏ vàng · pH 5,2 – 5,8",
        climate: "Khí hậu núi cao subtropical · sương mù buổi sáng",
        rainfall: "1.400 mm/năm · tập trung 6–9",
        water: "Suối bậc thang · hồ chứa 12.000 m³ · không dùng nguồn ô nhiễm",
        temperature: "TB 16–22°C · tối thiểu 4°C (12–1)",
        organic: "3,8 – 4,6%",
      }),
      buildSpeciesGroup("VT1", [
        { name: "Sâm Lai Châu (Panax vietnamensis)", area: "18 ha", age: "4–7 năm", gap: "GAP nội bộ · không thuốc BVTV cấm" },
        { name: "Đương quy (Angelica sinensis)", area: "12 ha", age: "2–3 năm", gap: "GACP checklist 2025" },
        { name: "Bạch thược (Paeonia lactiflora)", area: "8 ha", age: "3 năm", gap: "Đạt COA mẫu 2026-Q1" },
      ]),
      buildHarvestGroup("VT1", {
        seasons: "Sâm: thu 9–11 · Đương quy: 10–11 · Bạch thược: 9",
        yieldFresh: "≈ 42 tấn tươi/năm",
        yieldDry: "≈ 2,8 tấn khô/năm (hao hụt ~ 15%)",
        lossRate: "12–18% (sấy + phân loại)",
        qc: "COA theo lô · kim loại nặng · độ ẩm ≤ 12%",
        traceCode: "TRACE-VT-001-2026",
      }),
      buildLogisticsGroup("VT1", {
        transport: "Xe lạnh 5°C · 280 km → kho Lai Châu trung chuyển",
        preprocess: "Rửa · cắt · sấy khí nhiệt 45–55°C",
        process: "Phân loại 3 cấp · nghiền bột (theo đơn)",
        format: "Nguyên liệu khô · lát · bột · chiết xuất (PO)",
        storage: "Kho lạnh 5°C · 60% RH · pallet RFID",
        shelfLife: "24 tháng (khô) · 12 tháng (bột)",
        packaging: "Bao 25 kg PE food-grade · thùng carton 2 lớp",
      }),
      buildCommercialGroup("VT1", {
        unitPrice: "₫18.000/kg (khô, loại I) · ₫12.000/kg (loại II)",
        payment: "TT 30 ngày sau giao · cọc 10% đơn ≥ 500 kg",
        shipping: "Giao kho BSV Tây Bắc · BSV chịu cước nội địa",
        delivery: "7 ngày làm việc sau PO · SLA QC 48h",
        moq: "200 kg / mã SP · 1.000 kg / hợp đồng khung",
        incoterm: "DAP kho BSV",
        validUntil: "31/12/2026",
      }),
    ],
  },
  {
    id: "dz-2",
    scope: "domestic",
    zoneCode: "PLQ-QN-002",
    zoneName: enc("PLQ-QN-002", "Vùng trồng Trung Bộ · Quảng Nam"),
    summary: L(
      "Nam Trà My · dược liệu thảo dược núi Trường Sơn · 28 ha",
      "Nam Tra My · Truong Son herbal zone · 28 ha",
      "南茶美 · 28公顷"
    ),
    groups: [
      buildLocationGroup("QN2", {
        province: "Quảng Nam",
        district: "Nam Trà My · Trà Leng",
        areaHa: "28 ha",
        elevation: "800 – 950 m",
        coordinates: "15°23'08\"N · 108°14'33\"E",
        certificate: "CN-QN-2023-0442",
      }),
      buildEntityGroup("QN2", {
        name: "Cty CP Dược liệu Quảng Nam",
        type: "Công ty cổ phần",
        taxId: "4000 123 889",
        representative: "Trần Minh Đức · TGĐ",
        phone: "0235 3866 990",
        members: "1 xí nghiệp · 85 CN cố định",
        contract: "HĐ-BSV-2025-QN-007",
      }),
      buildSoilGroup("QN2", {
        soil: "Đất đỏ bazan",
        climate: "Nhiệt đới gió mùa · mùa mưa rõ",
        rainfall: "2.100 mm/năm",
        water: "Sông Trà · đập nhỏ 8.000 m³",
        temperature: "TB 22–26°C",
        organic: "2,9 – 3,4%",
      }),
      buildSpeciesGroup("QN2", [
        { name: "Ngưu tất (Achyranthes bidentata)", area: "10 ha", age: "1–2 năm", gap: "GAP 2024" },
        { name: "Hoàng kỳ (Astragalus membranaceus)", area: "10 ha", age: "2 năm", gap: "Đang thẩm GACP" },
        { name: "Đẳng sâm (Codonopsis pilosula)", area: "8 ha", age: "2–3 năm", gap: "COA đạt" },
      ]),
      buildHarvestGroup("QN2", {
        seasons: "Thu 3–5 & 10–11 (2 vụ)",
        yieldFresh: "≈ 28 tấn tươi/năm",
        yieldDry: "≈ 1,9 tấn khô/năm",
        lossRate: "14%",
        qc: "BSV checklist + công bố nội bộ",
        traceCode: "TRACE-QN-002-2026",
      }),
      buildLogisticsGroup("QN2", {
        transport: "Container lạnh · Quảng Nam → kho Đà Nẵng → BSV",
        preprocess: "Sơ chế + cắt lát tại xưởng",
        process: "Sấy · đóng túi MAP",
        format: "Lát khô · nguyên liệu thô",
        storage: "Kho khô 25°C · hút ẩm",
        shelfLife: "18 tháng",
        packaging: "Thùng 20 kg · màng PE",
      }),
      buildCommercialGroup("QN2", {
        unitPrice: "₫22.000/kg (Hoàng kỳ khô)",
        payment: "LC 60 ngày · TT 50% trước khi xuất",
        shipping: "CIF kho trung tâm BSV",
        delivery: "14 ngày sau LC",
        moq: "500 kg / lô",
        incoterm: "CIF Đà Nẵng",
        validUntil: "30/06/2026",
      }),
    ],
  },
  {
    id: "dz-3",
    scope: "domestic",
    zoneCode: "PLQ-LS-003",
    zoneName: enc("PLQ-LS-003", "Vùng trồng Tây Nguyên · Lâm Đồng"),
    summary: L("Di Linh · Atiso & dược liệu · 35 ha", "Di Linh · artichoke & herbs · 35 ha", "大叻 · 35公顷"),
    groups: [
      buildLocationGroup("LS3", {
        province: "Lâm Đồng",
        district: "Di Linh · Đinh Văn Lâm",
        areaHa: "35 ha",
        elevation: "1.200 – 1.450 m",
        coordinates: "11°42'55\"N · 108°02'18\"E",
        certificate: "CN-LS-2025-0021",
      }),
      buildEntityGroup("LS3", {
        name: "HTX Nông dược Di Linh",
        type: "Hợp tác xã",
        taxId: "5801 234 667",
        representative: "Lê Thị Hương",
        phone: "0263 3861 220",
        members: "92 hộ",
        contract: "HĐ-BSV-2026-LS-003",
      }),
      buildSoilGroup("LS3", {
        soil: "Đất ba dan đỏ",
        climate: "Cao nguyên ôn đới",
        rainfall: "1.750 mm/năm",
        water: "Giếng khoan + mưa thu gom",
        temperature: "TB 18°C",
        organic: "4,1%",
      }),
      buildSpeciesGroup("LS3", [
        { name: "Atiso (Cynara scolymus)", area: "15 ha", age: "1 năm", gap: "VietGAP" },
        { name: "Cây xạ can (Stevia rebaudiana)", area: "12 ha", age: "6–8 tháng", gap: "Organic transition" },
      ]),
      buildHarvestGroup("LS3", {
        seasons: "Atiso: 4–6 · Xạ can: 3 tháng/lần",
        yieldFresh: "55 tấn/năm",
        yieldDry: "8,2 tấn/năm",
        lossRate: "10%",
        qc: "Đường lượng / độ ẩm",
        traceCode: "TRACE-LS-003",
      }),
      buildLogisticsGroup("LS3", {
        transport: "Xe tải lạnh · 6h → BSV",
        preprocess: "Làm khô · nghiền",
        process: "Chiết xuất atiso (line riêng)",
        format: "Bột · lá khô",
        storage: "25°C khô ráo",
        shelfLife: "12 tháng",
        packaging: "Bao 10 kg",
      }),
      buildCommercialGroup("LS3", {
        unitPrice: "₫35.000/kg (atiso khô)",
        payment: "TT 15 ngày",
        shipping: "EXW xưởng Di Linh",
        delivery: "5 ngày",
        moq: "100 kg",
        incoterm: "EXW",
        validUntil: "31/03/2027",
      }),
    ],
  },
];

const FOREIGN_ZONES: GrowingZoneSupply[] = [
  {
    id: "fz-1",
    scope: "foreign",
    zoneCode: "PLQ-YN-101",
    zoneName: enc("PLQ-YN-101", "Vùng trồng Vân Nam · Trung Quốc"),
    summary: L("Cao nguyên Vân Nam · đối tác GMP · 65 ha", "Yunnan highlands · GMP partner · 65 ha", "云南高原 · 65公顷"),
    groups: [
      buildLocationGroup("YN1", {
        province: "Vân Nam (Yunnan)",
        district: "Văn Sơn · Mã Quan",
        areaHa: "65 ha",
        elevation: "1.600 – 2.100 m",
        coordinates: "23°42'N · 104°42'E",
        certificate: "CN-YN-IMP-2025-88",
      }),
      buildEntityGroup("YN1", {
        name: "Yunnan Herbal Cooperative Union",
        type: "Hợp tác xã liên hiệp",
        taxId: "CN-9153XXXXX",
        representative: "Zhang Wei · Export director",
        phone: "+86 870 312 8800",
        members: "320 hộ nông dân",
        contract: "HĐ-BSV-2025-YN-FW-01",
      }),
      buildSoilGroup("YN1", {
        soil: "Đất chua phù sa cao nguyên",
        climate: "Ẩm · sương mù",
        rainfall: "1.100 mm/năm",
        water: "Sông con · tuyền",
        temperature: "TB 14–20°C",
        organic: "5,2%",
      }),
      buildSpeciesGroup("YN1", [
        { name: "Tam thất (Panax notoginseng)", area: "25 ha", age: "3–5 năm", gap: "China GAP" },
        { name: "Đương quy", area: "20 ha", age: "2 năm", gap: "COA export" },
        { name: "Xuyên khung (Ligusticum)", area: "12 ha", age: "2 năm", gap: "EU pesticide list pass" },
      ]),
      buildHarvestGroup("YN1", {
        seasons: "Thu 8–10",
        yieldFresh: "120 tấn/năm",
        yieldDry: "4,2 tấn/năm",
        lossRate: "16%",
        qc: "GMP + kiểm dịch VN",
        traceCode: "TRACE-YN-101",
      }),
      buildLogisticsGroup("YN1", {
        transport: "Container lạnh · Hekou → HCM",
        preprocess: "Sơ chế tại Yunnan",
        process: "Cắt · sấy · kiểm",
        format: "Khô · bột",
        storage: "Kho lạnh border",
        shelfLife: "24 tháng",
        packaging: "25 kg bao",
      }),
      buildCommercialGroup("YN1", {
        unitPrice: "USD 12/kg FOB",
        payment: "TT LC at sight",
        shipping: "CIF HCM port",
        delivery: "21 ngày",
        moq: "2 tấn / SKU",
        incoterm: "CIF",
        validUntil: "30/09/2026",
      }),
    ],
  },
  {
    id: "fz-2",
    scope: "foreign",
    zoneCode: "PLQ-LA-102",
    zoneName: enc("PLQ-LA-102", "Vùng trồng Lào · Bolaven"),
    summary: L("Cao nguyên Bolaven · cafe & dược liệu · 22 ha", "Bolaven plateau · coffee & herbs", "波罗芬高原"),
    groups: [
      buildLocationGroup("LA2", {
        province: "Champasak, Lào",
        district: "Paksong · Bolaven",
        areaHa: "22 ha",
        elevation: "1.000 – 1.300 m",
        coordinates: "15°12'N · 106°02'E",
        certificate: "CN-LA-2024-011",
      }),
      buildEntityGroup("LA2", {
        name: "Bolaven Agri Export Co.",
        type: "Công ty TNHH",
        taxId: "LA-0109XXXX",
        representative: "Somphone Keo",
        phone: "+856 20 5555 8822",
        members: "45 hộ",
        contract: "HĐ-BSV-2026-LA-02",
      }),
      buildSoilGroup("LA2", {
        soil: "Volcanic basalt",
        climate: "Mát · mưa nhiều",
        rainfall: "2.000 mm",
        water: "Thác nước / suối",
        temperature: "TB 19°C",
        organic: "4,8%",
      }),
      buildSpeciesGroup("LA2", [
        { name: "Cafe Arabica", area: "12 ha", age: "3–5 năm", gap: "Organic cert pending" },
        { name: "Đinh lăng (Polyscias)", area: "10 ha", age: "4 năm", gap: "Farm audit 2025" },
      ]),
      buildHarvestGroup("LA2", {
        seasons: "Cafe: 11–2 · Đinh lăng: 8–9",
        yieldFresh: "18 tấn/năm",
        yieldDry: "3,1 tấn/năm",
        lossRate: "11%",
        qc: "Moisture / cupping (cafe)",
        traceCode: "TRACE-LA-102",
      }),
      buildLogisticsGroup("LA2", {
        transport: "Đường bộ · Lào → cửa khẩu Lao Bảo",
        preprocess: "Rửa · sấy",
        process: "Rang (cafe) theo PO",
        format: "Nhân xanh / khô",
        storage: "Kho silo",
        shelfLife: "18 tháng",
        packaging: "Jute 60 kg",
      }),
      buildCommercialGroup("LA2", {
        unitPrice: "USD 4,2/kg (cafe nhân) · USD 9/kg (đinh lăng)",
        payment: "TT 50% advance",
        shipping: "DAP cửa khẩu",
        delivery: "10 ngày",
        moq: "1 tấn",
        incoterm: "DAP",
        validUntil: "31/08/2026",
      }),
    ],
  },
];

function importGroups(prefix: string, type: "tcm" | "snacks"): SupplyFieldGroup[] {
  if (type === "tcm") {
    return [
      {
        id: `${prefix}-info`,
        title: L("Thông tin nhà cung cấp", "Supplier information", "供应商信息"),
        items: [
          { id: "reg", label: L("Số đăng ký lưu hành VN", "VN marketing authorization", "越南注册号"), field: enc(`${prefix}-REG`, "VD-2024-TCM-8891") },
          { id: "gmp", label: L("Chứng nhận GMP", "GMP certificate", "GMP认证"), field: open("WHO-GMP · còn hiệu lực 12/2027") },
          { id: "contact", label: L("Đầu mối nhập khẩu BSV", "BSV import contact", "BSV进口对接"), field: open("Phòng mua B2B · ext. 8802") },
        ],
      },
      buildLogisticsGroup(`${prefix}I`, {
        transport: "Air freight + cold chain 2–8°C",
        preprocess: "Kiểm dịch · lấy mẫu QC",
        process: "Phân loại theo SKU đăng ký",
        format: "Hộp / chai / túi theo NĐ",
        storage: "Kho dược GSP BSV",
        shelfLife: "Theo nhãn · min 18 tháng còn lại",
        packaging: "Carton có mã vạch GS1",
      }),
      buildCommercialGroup(`${prefix}C`, {
        unitPrice: "FOB Incheon USD 8,5/hộp (60 viên)",
        payment: "TT 45 ngày · LC accepted",
        shipping: "CIF Tân Sơn Nhất",
        delivery: "30 ngày sau PO",
        moq: "2.000 hộp / SKU",
        incoterm: "CIF",
        validUntil: "31/12/2026",
      }),
    ];
  }
  return [
    {
      id: `${prefix}-info`,
      title: L("Thông tin nhà cung cấp", "Supplier information", "供应商信息"),
      items: [
        { id: "brand", label: L("Thương hiệu / OEM", "Brand / OEM", "品牌/OEM"), field: open("Yogi Food · BSV private label") },
        { id: "cert", label: L("Giấy phép TPCN", "Supplement license", "保健食品许可"), field: enc(`${prefix}-TPCN`, "TPCN-2025-0044") },
        { id: "shelf", label: L("Shelf life & bảo quản", "Shelf life & storage", "保质期"), field: open("12 tháng · 25°C khô ráo") },
      ],
    },
    buildLogisticsGroup(`${prefix}I`, {
      transport: "Container 20ft · lạnh nếu cần",
      preprocess: "Kiểm nghiệm vi sinh / dinh dưỡng",
      process: "Đóng gói retail",
      format: "Gói 50g · hộp 12 gói",
      storage: "Kho FMCG BSV",
      shelfLife: "12 tháng",
      packaging: "Retail ready · tiếng Việt",
    }),
    buildCommercialGroup(`${prefix}C`, {
      unitPrice: "FOB Singapore USD 1,2/gói",
      payment: "TT 30 ngày",
      shipping: "CIF HCM",
      delivery: "21 ngày",
      moq: "5.000 gói / SKU",
      incoterm: "CIF",
      validUntil: "30/06/2026",
    }),
  ];
}

const IMPORT_RECORDS: ImportSupplyRecord[] = [
  {
    id: "imp-tcm-1",
    type: "tcm",
    statusLabel: L("Đang thẩm định", "Under review", "审核中"),
    supplierName: enc("IMP-TCM-S01", "Công ty Dược phẩm Đông y Hàn Quốc"),
    groups: [
      {
        id: "tcm1-base",
        title: L("Xuất xứ & dòng hàng", "Origin & product line", "产地与产品线"),
        items: [
          { id: "origin", label: L("Xuất xứ", "Origin", "产地"), field: enc("IMP-TCM-O01", "Hàn Quốc · Incheon") },
          { id: "line", label: L("Dòng hàng", "Product line", "产品线"), field: open("Thuốc YHCT - ETC & OTC (đăng ký VN)") },
          { id: "sku", label: L("SKU nhập", "Import SKUs", "进口SKU"), field: open("12 SKU · 4 đang thẩm định") },
        ],
      },
      ...importGroups("TCM1", "tcm"),
    ],
  },
  {
    id: "imp-tcm-2",
    type: "tcm",
    statusLabel: L("Hợp đồng khung", "Framework agreement", "框架协议"),
    supplierName: enc("IMP-TCM-S02", "Guangzhou TCM Import Co."),
    groups: [
      {
        id: "tcm2-base",
        title: L("Xuất xứ & dòng hàng", "Origin & product line", "产地与产品线"),
        items: [
          { id: "origin", label: L("Xuất xứ", "Origin", "产地"), field: open("Quảng Châu · Trung Quốc") },
          { id: "line", label: L("Dòng hàng", "Product line", "产品线"), field: open("Thuốc YHCT - OTC") },
          { id: "customs", label: L("Cửa khẩu", "Border gate", "口岸"), field: open("Móng Cái · đường bộ") },
        ],
      },
      ...importGroups("TCM2", "tcm"),
    ],
  },
  {
    id: "imp-snack-1",
    type: "snacks",
    statusLabel: L("Đang giao hàng", "In delivery", "交付中"),
    supplierName: enc("IMP-SN-S01", "NutriSnack Asia Pte Ltd"),
    groups: [
      {
        id: "sn1-base",
        title: L("Xuất xứ & dòng hàng", "Origin & product line", "产地与产品线"),
        items: [
          { id: "origin", label: L("Xuất xứ", "Origin", "产地"), field: enc("IMP-SN-O01", "Singapore · Jurong") },
          { id: "line", label: L("Dòng hàng", "Product line", "产品线"), field: open("Snacks dinh dưỡng · OEM Yogi Food") },
          { id: "flavor", label: L("Biến thể", "Variants", "口味"), field: open("Mật ong · Hạt chia · Cacao 55%") },
        ],
      },
      ...importGroups("SN1", "snacks"),
    ],
  },
  {
    id: "imp-snack-2",
    type: "snacks",
    statusLabel: L("Đang hợp tác", "Active", "合作中"),
    supplierName: open("Cty TNHH Thực phẩm Đông Nam Á"),
    groups: [
      {
        id: "sn2-base",
        title: L("Xuất xứ & dòng hàng", "Origin & product line", "产地与产品线"),
        items: [
          { id: "origin", label: L("Xuất xứ", "Origin", "产地"), field: open("Việt Nam · Bình Dương") },
          { id: "line", label: L("Dòng hàng", "Product line", "产品线"), field: open("Snacks dinh dưỡng · gia công") },
          { id: "cap", label: L("Công suất", "Capacity", "产能"), field: open("80.000 gói/tháng") },
        ],
      },
      ...importGroups("SN2", "snacks"),
    ],
  },
];

export function getGrowingZones(scope: SupplyScope): GrowingZoneSupply[] {
  return scope === "domestic" ? DOMESTIC_ZONES : FOREIGN_ZONES;
}

export function getImportSupplyRecords(type: ImportSupplyType): ImportSupplyRecord[] {
  return IMPORT_RECORDS.filter((r) => r.type === type);
}

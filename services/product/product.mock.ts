import { getProductInboundOrders } from "@/lib/inboundOrderData";
import { getProductDetailInstances } from "@/lib/productInstanceCatalog";
import { LOCATION_SEEDS } from "@/lib/locationRegistry";
import type { ProductDetail, ProductListItem, ProductMeta } from "@/types/product";

const listVi: ProductListItem[] = [
  {
    productCode: "BSV-COV19",
    name: "Vaccine Covid Vietnam",
    category: "Vaccine",
    brand: "Bông Sen Vàng",
    sellPrice: "₫185,000",
    importPrice: "₫142,000",
    status: "hot",
    statusLabel: "Đang phân phối",
    monthlyUnits: 186,
    monthlyRevenue: "₫34.4 tr",
    growth: "+18.2%",
    growthUp: true,
    totalStock: 1000,
    locationCount: 16,
    avgDailyUnits: 6,
  },
  {
    productCode: "BSV-4412",
    name: "Omega-3 Premium 60v",
    category: "TPCN",
    brand: "Bông Sen Vàng",
    sellPrice: "₫420,000",
    importPrice: "₫268,000",
    status: "hot",
    statusLabel: "Bán chạy",
    monthlyUnits: 842,
    monthlyRevenue: "₫353 tr",
    growth: "+12.4%",
    growthUp: true,
    totalStock: 312,
    locationCount: 16,
    avgDailyUnits: 28,
  },
  {
    productCode: "BSV-2281",
    name: "Vitamin C 1000mg",
    category: "Vitamin",
    brand: "Bông Sen Vàng",
    sellPrice: "₫185,000",
    importPrice: "₫92,000",
    status: "stable",
    statusLabel: "Ổn định",
    monthlyUnits: 624,
    monthlyRevenue: "₫115 tr",
    growth: "+3.1%",
    growthUp: true,
    totalStock: 198,
    locationCount: 14,
    avgDailyUnits: 21,
  },
  {
    productCode: "BSV-9033",
    name: "Collagen Peptide",
    category: "Làm đẹp",
    brand: "Bông Sen Vàng",
    sellPrice: "₫560,000",
    importPrice: "₫340,000",
    status: "slow",
    statusLabel: "Bán chậm",
    monthlyUnits: 186,
    monthlyRevenue: "₫104 tr",
    growth: "−8.2%",
    growthUp: false,
    totalStock: 94,
    locationCount: 12,
    avgDailyUnits: 6,
  },
  {
    productCode: "BSV-7710",
    name: "Men vi sinh 30g",
    category: "Tiêu hóa",
    brand: "Bông Sen Vàng",
    sellPrice: "₫295,000",
    importPrice: "₫168,000",
    status: "hot",
    statusLabel: "Bán chạy",
    monthlyUnits: 512,
    monthlyRevenue: "₫151 tr",
    growth: "+9.6%",
    growthUp: true,
    totalStock: 228,
    locationCount: 15,
    avgDailyUnits: 17,
  },
  {
    productCode: "BSV-5520",
    name: "Kẽm + Vitamin D3",
    category: "Vitamin",
    brand: "Bông Sen Vàng",
    sellPrice: "₫245,000",
    importPrice: "₫128,000",
    status: "stable",
    statusLabel: "Ổn định",
    monthlyUnits: 398,
    monthlyRevenue: "₫97 tr",
    growth: "+1.8%",
    growthUp: true,
    totalStock: 156,
    locationCount: 14,
    avgDailyUnits: 13,
  },
  {
    productCode: "BSV-6108",
    name: "Glucosamine 120v",
    category: "TPCN",
    brand: "Bông Sen Vàng",
    sellPrice: "₫380,000",
    importPrice: "₫210,000",
    status: "slow",
    statusLabel: "Bán chậm",
    monthlyUnits: 142,
    monthlyRevenue: "₫54 tr",
    growth: "−5.4%",
    growthUp: false,
    totalStock: 88,
    locationCount: 10,
    avgDailyUnits: 5,
  },
  {
    productCode: "BSV-3344",
    name: "Sữa rửa Collagen",
    category: "Làm đẹp",
    brand: "Bông Sen Vàng",
    sellPrice: "₫165,000",
    importPrice: "₫78,000",
    status: "new",
    statusLabel: "Mới",
    monthlyUnits: 268,
    monthlyRevenue: "₫44 tr",
    growth: "+24.0%",
    growthUp: true,
    totalStock: 120,
    locationCount: 8,
    avgDailyUnits: 9,
  },
  {
    productCode: "BSV-1199",
    name: "Dầu gội thảo dược",
    category: "Chăm sóc",
    brand: "Bông Sen Vàng",
    sellPrice: "₫125,000",
    importPrice: "₫62,000",
    status: "stable",
    statusLabel: "Ổn định",
    monthlyUnits: 456,
    monthlyRevenue: "₫57 tr",
    growth: "+4.2%",
    growthUp: true,
    totalStock: 184,
    locationCount: 12,
    avgDailyUnits: 15,
  },
  {
    productCode: "BSV-8801",
    name: "Magnesium Glycinate",
    category: "TPCN",
    brand: "Bông Sen Vàng",
    sellPrice: "₫320,000",
    importPrice: "₫175,000",
    status: "hot",
    statusLabel: "Bán chạy",
    monthlyUnits: 388,
    monthlyRevenue: "₫124 tr",
    growth: "+15.1%",
    growthUp: true,
    totalStock: 142,
    locationCount: 11,
    avgDailyUnits: 13,
  },
  {
    productCode: "BSV-7022",
    name: "Vitamin B Complex",
    category: "Vitamin",
    brand: "Bông Sen Vàng",
    sellPrice: "₫198,000",
    importPrice: "₫98,000",
    status: "out",
    statusLabel: "Hết hàng",
    monthlyUnits: 0,
    monthlyRevenue: "₫0",
    growth: "—",
    growthUp: false,
    totalStock: 0,
    locationCount: 0,
    avgDailyUnits: 0,
  },
];

const ACTIVE_LOCATIONS = LOCATION_SEEDS.filter((s) => s.status === "active");

function chartLocationShare(count: number) {
  const slice = ACTIVE_LOCATIONS.slice(0, Math.min(4, ACTIVE_LOCATIONS.length));
  const per = count === 0 ? 0 : Math.max(1, Math.floor(count / slice.length));
  return {
    labels: slice.map((l) => l.code),
    values: slice.map((_, i, arr) =>
      i === arr.length - 1 ? Math.max(0, count - per * (arr.length - 1)) : per
    ),
  };
}

function instanceOpts(item: ProductListItem) {
  return {
    maxRows: 60,
    sellPrice: item.sellPrice,
    importPrice: item.importPrice,
    centralRatio:
      item.productCode === "BSV-COV19" ? 0.35 : item.productCode === "BSV-7022" ? 0 : 0.2,
  };
}

function buildDetail(item: ProductListItem, extra?: Partial<ProductDetail>): ProductDetail {
  const instanceTotal = item.totalStock;
  const instances = getProductDetailInstances(item.productCode, instanceTotal, instanceOpts(item));

  return {
    meta: {
      productCode: item.productCode,
      name: item.name,
      category: item.category,
      brand: item.brand,
      sellPrice: item.sellPrice,
      importPrice: item.importPrice,
      marginPct: 32,
      status: item.status,
      statusLabel: item.statusLabel,
      launchedAt: item.productCode === "BSV-COV19" ? "01/2024" : "01/2023",
      description: "",
      instanceCount: instanceTotal,
    },
    overview: {
      kpis: [
        { label: "Tổng đơn vị tồn", value: String(instanceTotal) },
        {
          label: "Doanh thu tháng",
          value: item.monthlyRevenue,
          growth: item.growth,
          growthUp: item.growthUp,
        },
        { label: "Đã bán tháng", value: String(item.monthlyUnits), growth: item.growth, growthUp: item.growthUp },
        {
          label: "Cơ sở đang có hàng",
          value: String(item.locationCount),
          growth: `${ACTIVE_LOCATIONS.length} cơ sở mạng`,
          growthUp: true,
        },
      ],
      salesTrend: {
        labels: ["T12", "T1", "T2", "T3", "T4", "T5"],
        values: [
          Math.round(item.monthlyUnits * 0.72),
          Math.round(item.monthlyUnits * 0.8),
          Math.round(item.monthlyUnits * 0.86),
          Math.round(item.monthlyUnits * 0.92),
          Math.round(item.monthlyUnits * 0.96),
          item.monthlyUnits,
        ],
      },
      locationShare: chartLocationShare(instanceTotal),
      channelMix: {
        labels: ["Tại quầy", "Zalo đặt", "Grab", "Khác"],
        values: [58, 24, 14, 4],
      },
    },
    instances,
    instanceTotal,
    inboundOrders: getProductInboundOrders(item.productCode),
    ...extra,
  };
}

const detailsVi: Record<string, ProductDetail> = {
  "BSV-COV19": buildDetail(listVi[0], {
    overview: {
      kpis: [
        { label: "Tổng đơn vị tồn", value: "1.000" },
        { label: "Doanh thu tháng", value: "₫34.4 tr", growth: "+18.2%", growthUp: true },
        { label: "Đã bán tháng", value: "186", growth: "+18.2%", growthUp: true },
        { label: "Cơ sở đang có hàng", value: "16", growth: "Phân bổ đa điểm", growthUp: true },
      ],
      salesTrend: {
        labels: ["T12", "T1", "T2", "T3", "T4", "T5"],
        values: [98, 112, 128, 145, 168, 186],
      },
      locationShare: {
        labels: ["HCM-01", "HN-02", "DN-01", "CT-01"],
        values: [280, 220, 180, 120],
      },
      channelMix: {
        labels: ["Tại quầy", "Bệnh viện", "Đặt trước", "Khác"],
        values: [52, 28, 14, 6],
      },
    },
    instances: getProductDetailInstances("BSV-COV19", 1000, {
      ...instanceOpts(listVi[0]),
      maxRows: 60,
    }),
    instanceTotal: 1000,
  }),
  "BSV-4412": buildDetail(listVi[1]),
};

export const productMockVi = {
  list: () => listVi,
  detail: (productCode: string) =>
    detailsVi[productCode] ??
    buildDetail(listVi.find((p) => p.productCode === productCode) ?? listVi[0]),
  meta: (code: string): ProductMeta => productMockVi.detail(code).meta,
};

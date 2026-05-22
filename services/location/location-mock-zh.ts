import { buildCustomerCountChart } from "@/lib/customerCountChart";
import { buildRevenueChart } from "@/lib/dashboardRevenueChart";
import type { LocationOverview, LocationSales, LocationStaffCosts } from "@/types/location";
import { buildSalesCustomersForLocation, getLocationCustomerDetail } from "@/lib/customerDetailData";
import { locationIndex } from "@/lib/locationRegistry";
import type { BusinessModelSlug } from "@/libs/business-models/config";
import { locationListZh, locationMetaFromList } from "@/lib/locationList";
import { locationMockVi } from "./location.mock";

const listZh = (model?: BusinessModelSlug) => locationListZh(model);

const metaZh = (id: string, model?: BusinessModelSlug) =>
  locationMetaFromList(listZh(model), id);

function overviewZh(locationId: string): LocationOverview {
  return {
    kpis: [
      { label: "月度费用", value: "1.86亿₫", growth: "固定 42%", growthUp: false },
      { label: "金牌客户", value: "312", growth: "本月 +18", growthUp: true },
      { label: "进行中入库单", value: "5", growth: "2 在途", growthUp: true },
      { label: "库存价值", value: "12亿₫", growth: "−4 低库存 SKU", growthUp: false },
    ],
    charts: {
      staffCosts: { labels: ["固定", "变动", "人力"], values: [78, 32, 76] },
      sales: {
        labels: ["7时", "9时", "11时", "13时", "15时", "17时", "19时", "21时"],
        values: [5, 8, 14, 22, 12, 10, 20, 9],
      },
      warehouse: {
        labels: ["待确认", "运输中", "已收货", "退货"],
        values: [1, 2, 12, 2],
      },
    },
    revenue: buildRevenueChart("zh", locationId),
    customerCount: buildCustomerCountChart("zh", locationId),
  };
}

const staffCostsZh: LocationStaffCosts = {
  manager: {
    name: "阮明英",
    title: "门店经理",
    phone: "0903 111 222",
    email: "minh.anh@bongsen.com",
    since: "2022/03",
  },
  summary: { total: 18, onShift: 14, onLeave: 2 },
  staff: [
    { id: "s1", name: "黄兰", role: "收银主管", phone: "0901 222 333", shift: "早班", salary: "1200万₫", status: "active" },
    { id: "s2", name: "武坚", role: "OTC顾问", phone: "0902 333 444", shift: "午班", salary: "1100万₫", status: "active" },
    { id: "s3", name: "杜梅", role: "仓储", phone: "0903 444 555", shift: "全职", salary: "1050万₫", status: "active" },
    { id: "s4", name: "裴心", role: "顾问", phone: "0904 555 666", shift: "晚班", salary: "1000万₫", status: "leave" },
    { id: "s5", name: "吴河", role: "配送", phone: "0905 666 777", shift: "晚班", salary: "950万₫", status: "active" },
  ],
  costs: {
    summary: {
      fixedTotal: "7800万₫",
      variableTotal: "3200万₫",
      payrollTotal: "7600万₫",
      monthlyTotal: "1.86亿₫",
    },
    fixed: [
      { id: "f1", name: "租金", amount: "4500万₫", note: "24个月合同" },
      { id: "f2", name: "水电（固定）", amount: "800万₫" },
      { id: "f3", name: "保险及管理", amount: "1200万₫" },
      { id: "f4", name: "POS / 软件", amount: "1300万₫" },
    ],
    variable: [
      { id: "v1", name: "本地营销", amount: "1200万₫", note: "按活动" },
      { id: "v2", name: "包装耗材", amount: "800万₫" },
      { id: "v3", name: "配送 / Grab", amount: "700万₫" },
      { id: "v4", name: "杂项", amount: "500万₫" },
    ],
    chart: { labels: ["固定", "变动", "人力"], values: [78, 32, 76] },
  },
};

function salesZh(locationId: string): LocationSales {
  const idx = locationIndex(locationId);
  const vi = locationMockVi.sales(locationId);
  return {
    ...vi,
    summary: {
      ...vi.summary,
      todayRevenue: `${2.86 + idx * 0.12}亿₫`,
    },
    peakHours: {
      labels: ["7时", "9时", "11时", "13时", "15时", "17时", "19时", "21时"],
      values: vi.peakHours.values,
      peakIndices: vi.peakHours.peakIndices,
    },
    tierChart: { labels: ["金牌", "银牌", "铜牌"], values: vi.tierChart.values },
    customers: buildSalesCustomersForLocation(locationId, "zh"),
  };
}

export const locationMockZh = {
  list: (model?: BusinessModelSlug) => listZh(model),
  meta: (id: string, model?: BusinessModelSlug) => metaZh(id, model),
  overview: (id: string) => overviewZh(id),
  staffCosts: () => staffCostsZh,
  sales: (id: string) => salesZh(id),
  customer: (locationId: string, customerId: string) =>
    getLocationCustomerDetail(locationId, customerId, "zh"),
  warehouse: (id: string) => locationMockVi.warehouse(id),
  inboundOrder: (orderId: string) => locationMockVi.inboundOrder(orderId),
};

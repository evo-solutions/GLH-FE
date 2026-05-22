import { buildCustomerCountChart } from "@/lib/customerCountChart";
import { buildRevenueChart } from "@/lib/dashboardRevenueChart";
import type { LocationOverview, LocationSales, LocationStaffCosts } from "@/types/location";
import { buildSalesCustomersForLocation, getLocationCustomerDetail } from "@/lib/customerDetailData";
import { locationIndex } from "@/lib/locationRegistry";
import type { BusinessModelSlug } from "@/libs/business-models/config";
import { locationListEn, locationMetaFromList } from "@/lib/locationList";
import { locationMockVi } from "./location.mock";

const listEn = (model?: BusinessModelSlug) => locationListEn(model);

const metaEn = (id: string, model?: BusinessModelSlug) =>
  locationMetaFromList(listEn(model), id);

function overviewEn(locationId: string): LocationOverview {
  return {
    kpis: [
      { label: "Monthly costs", value: "₫186M", growth: "42% fixed", growthUp: false },
      { label: "Gold-tier customers", value: "312", growth: "+18 this month", growthUp: true },
      { label: "Inbound orders in progress", value: "5", growth: "2 in transit", growthUp: true },
      { label: "Stock value", value: "₫1.2B", growth: "−4 low SKUs", growthUp: false },
    ],
    charts: {
      staffCosts: { labels: ["Fixed", "Variable", "Payroll"], values: [78, 32, 76] },
      sales: {
        labels: ["7am", "9am", "11am", "1pm", "3pm", "5pm", "7pm", "9pm"],
        values: [5, 8, 14, 22, 12, 10, 20, 9],
      },
      warehouse: {
        labels: ["Pending", "In transit", "Received", "Returns"],
        values: [1, 2, 12, 2],
      },
    },
    revenue: buildRevenueChart("en", locationId),
    customerCount: buildCustomerCountChart("en", locationId),
  };
}

const staffCostsEn: LocationStaffCosts = {
  manager: {
    name: "Minh Anh Nguyen",
    title: "Store manager",
    phone: "0903 111 222",
    email: "minh.anh@bongsen.com",
    since: "03/2022",
  },
  summary: { total: 18, onShift: 14, onLeave: 2 },
  staff: [
    { id: "s1", name: "Hoang Lan", role: "Head cashier", phone: "0901 222 333", shift: "Morning", salary: "₫12M", status: "active" },
    { id: "s2", name: "Vo Kien", role: "OTC advisor", phone: "0902 333 444", shift: "Afternoon", salary: "₫11M", status: "active" },
    { id: "s3", name: "Do Mai", role: "Warehouse", phone: "0903 444 555", shift: "Full-time", salary: "₫10.5M", status: "active" },
    { id: "s4", name: "Bui Tam", role: "Advisor", phone: "0904 555 666", shift: "Evening", salary: "₫10M", status: "leave" },
    { id: "s5", name: "Ngo Ha", role: "Delivery", phone: "0905 666 777", shift: "Evening", salary: "₫9.5M", status: "active" },
  ],
  costs: {
    summary: {
      fixedTotal: "₫78M",
      variableTotal: "₫32M",
      payrollTotal: "₫76M",
      monthlyTotal: "₫186M",
    },
    fixed: [
      { id: "f1", name: "Rent", amount: "₫45M", note: "24-month lease" },
      { id: "f2", name: "Utilities (fixed)", amount: "₫8M" },
      { id: "f3", name: "Insurance & admin", amount: "₫12M" },
      { id: "f4", name: "POS / software", amount: "₫13M" },
    ],
    variable: [
      { id: "v1", name: "Local marketing", amount: "₫12M", note: "Campaign-based" },
      { id: "v2", name: "Packaging & supplies", amount: "₫8M" },
      { id: "v3", name: "Delivery / Grab", amount: "₫7M" },
      { id: "v4", name: "Miscellaneous", amount: "₫5M" },
    ],
    chart: {
      labels: ["Fixed", "Variable", "Payroll"],
      values: [78, 32, 76],
    },
  },
};

function salesEn(locationId: string): LocationSales {
  const idx = locationIndex(locationId);
  const vi = locationMockVi.sales(locationId);
  return {
    ...vi,
    summary: {
      ...vi.summary,
      todayRevenue: `₫${286 + idx * 12}M`,
    },
    peakHours: {
      labels: ["7am", "9am", "11am", "1pm", "3pm", "5pm", "7pm", "9pm"],
      values: vi.peakHours.values,
      peakIndices: vi.peakHours.peakIndices,
    },
    tierChart: {
      labels: ["Gold", "Silver", "Bronze"],
      values: vi.tierChart.values,
    },
    customers: buildSalesCustomersForLocation(locationId, "en"),
  };
}

export const locationMockEn = {
  list: (model?: BusinessModelSlug) => listEn(model),
  meta: (id: string, model?: BusinessModelSlug) => metaEn(id, model),
  overview: (id: string) => overviewEn(id),
  staffCosts: () => staffCostsEn,
  sales: (id: string) => salesEn(id),
  customer: (locationId: string, customerId: string) =>
    getLocationCustomerDetail(locationId, customerId, "en"),
  warehouse: (id: string) => locationMockVi.warehouse(id),
  inboundOrder: (orderId: string) => locationMockVi.inboundOrder(orderId),
};

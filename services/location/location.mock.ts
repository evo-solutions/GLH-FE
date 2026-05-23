import { buildCustomerCountChart } from "@/lib/customerCountChart";
import { buildRevenueChart } from "@/lib/dashboardRevenueChart";
import type { LocationOverview, LocationSales, LocationStaffCosts, LocationWarehouse } from "@/types/location";
import { buildSalesCustomersForLocation, getLocationCustomerDetail } from "@/lib/customerDetailData";
import { getInboundOrderDetail } from "@/lib/inboundOrderData";
import { locationListVi, locationMetaFromList } from "@/lib/locationList";
import { productDisplayCategory, productDisplayName } from "@/lib/productCatalog";
import { countUnitsAtLocation } from "@/lib/productInstanceCatalog";
import { LOCATION_IDS, locationIndex } from "@/lib/locationRegistry";
import { mockStockItem } from "@/lib/locationMockItems";

const listVi = locationListVi();

const metaVi = (id: string) => locationMetaFromList(listVi, id);

function overviewVi(locationId: string): LocationOverview {
  return {
    kpis: [
      { label: "Chi phí tháng", value: "₫186 tr", growth: "Cố định 42%", growthUp: false },
      { label: "Khách hạng Vàng", value: "312", growth: "+18 tháng này", growthUp: true },
      { label: "Đơn nhập đang xử lý", value: "5", growth: "2 đang vận chuyển", growthUp: true },
      { label: "Giá trị tồn kho", value: "₫1.2 tỷ", growth: "−4 SKU thấp", growthUp: false },
    ],
    charts: {
      staffCosts: {
        labels: ["Cố định", "Biến động", "Nhân sự"],
        values: [78, 32, 76],
      },
      sales: {
        labels: ["7h", "9h", "11h", "13h", "15h", "17h", "19h", "21h"],
        values: [5, 8, 14, 22, 12, 10, 20, 9],
      },
      warehouse: {
        labels: ["Chờ xác nhận", "Đang vận chuyển", "Đã nhận", "Hoàn trả"],
        values: [1, 2, 12, 2],
      },
    },
    revenue: buildRevenueChart("vi", locationId),
    customerCount: buildCustomerCountChart("vi", locationId),
  };
}

const staffCostsVi: LocationStaffCosts = {
  manager: {
    name: "Nguyễn Minh Anh",
    title: "Quản lý cơ sở",
    phone: "0903 111 222",
    email: "minh.anh@bongsen.com",
    since: "03/2022",
  },
  summary: { total: 18, onShift: 14, onLeave: 2 },
  staff: [
    { id: "s1", name: "Hoàng Lan", role: "Thu ngân trưởng", phone: "0901 222 333", shift: "Ca sáng", salary: "₫12 tr", status: "active" },
    { id: "s2", name: "Võ Kiên", role: "Tư vấn OTC", phone: "0902 333 444", shift: "Ca chiều", salary: "₫11 tr", status: "active" },
    { id: "s3", name: "Đỗ Mai", role: "Kho & nhập hàng", phone: "0903 444 555", shift: "Full-time", salary: "₫10.5 tr", status: "active" },
    { id: "s4", name: "Bùi Tâm", role: "Tư vấn", phone: "0904 555 666", shift: "Ca tối", salary: "₫10 tr", status: "leave" },
    { id: "s5", name: "Ngô Hà", role: "Ship nội bộ", phone: "0905 666 777", shift: "Ca tối", salary: "₫9.5 tr", status: "active" },
  ],
  costs: {
    summary: {
      fixedTotal: "₫78 tr",
      variableTotal: "₫32 tr",
      payrollTotal: "₫76 tr",
      monthlyTotal: "₫186 tr",
    },
    fixed: [
      { id: "f1", name: "Thuê mặt bằng", amount: "₫45 tr", note: "Hợp đồng 24 tháng" },
      { id: "f2", name: "Điện nước cố định", amount: "₫8 tr" },
      { id: "f3", name: "Bảo hiểm & phí quản lý", amount: "₫12 tr" },
      { id: "f4", name: "Hệ thống POS / phần mềm", amount: "₫13 tr" },
    ],
    variable: [
      { id: "v1", name: "Marketing địa phương", amount: "₫12 tr", note: "Theo chiến dịch" },
      { id: "v2", name: "Đóng gói & vật tư", amount: "₫8 tr" },
      { id: "v3", name: "Ship nội bộ / Grab", amount: "₫7 tr" },
      { id: "v4", name: "Chi phí phát sinh", amount: "₫5 tr" },
    ],
    chart: {
      labels: ["Cố định", "Biến động", "Nhân sự"],
      values: [78, 32, 76],
    },
  },
};

function salesVi(locationId: string): LocationSales {
  const idx = locationIndex(locationId);
  const bump = idx * 37;
  return {
    summary: {
      totalCustomers: 2840 + bump,
      goldCount: 312 + (idx % 5) * 8,
      silverCount: 890 + (idx % 4) * 12,
      bronzeCount: 1638 + (idx % 6) * 15,
      todayRevenue: `₫${286 + idx * 12} triệu`,
    },
    peakHours: {
      labels: ["7h", "9h", "11h", "13h", "15h", "17h", "19h", "21h"],
      values: [5, 8, 14, 22, 12, 10, 20, 9].map((v, i) => v + ((idx + i) % 3)),
      peakIndices: [3, 6],
    },
    tierChart: {
      labels: ["Hạng Vàng", "Hạng Bạc", "Hạng Đồng"],
      values: [312 + idx * 8, 890 + idx * 10, 1638 + idx * 14],
    },
    customers: buildSalesCustomersForLocation(locationId, "vi"),
  };
}

function warehouseVi(locationId: string): LocationWarehouse {
  const idx = locationIndex(locationId);
  const bump = idx * 11;

  const covStock = countUnitsAtLocation(locationId, "BSV-COV19");
  const omegaStock = countUnitsAtLocation(locationId, "BSV-4412");
  const vitStock = countUnitsAtLocation(locationId, "BSV-2281");
  const collagenStock = countUnitsAtLocation(locationId, "BSV-9033");
  const probioticStock = countUnitsAtLocation(locationId, "BSV-7710");
  const yogiStock = countUnitsAtLocation(locationId, "BSV-6108");
  const cafeStock = countUnitsAtLocation(locationId, "BSV-9302");
  return {
    summary: {
      skuCount: 128 + bump,
      lowStock: 3 + (idx % 6),
      stockValue: `₫${(1.1 + idx * 0.08).toFixed(1)} tỷ`,
      pendingOrders: idx % 3 === 0 ? 2 : 1,
      inTransit: idx % 4 < 2 ? 2 : 1,
    },
    items: [
      mockStockItem(
        locationId,
        "cov1",
        "BSV-COV19",
        productDisplayName("BSV-COV19", "vi"),
        productDisplayCategory("BSV-COV19", "vi"),
        "₫185,000",
        "₫142,000",
        covStock,
        20,
        covStock > 25 ? "ok" : covStock > 0 ? "low" : "out",
        covStock > 25 ? "Đủ hàng" : covStock > 0 ? "Sắp hết" : "Hết hàng"
      ),
      mockStockItem(
        locationId,
        "p1",
        "BSV-4412",
        productDisplayName("BSV-4412", "vi"),
        productDisplayCategory("BSV-4412", "vi"),
        "₫420,000",
        "₫268,000",
        omegaStock,
        40,
        omegaStock > 40 ? "ok" : omegaStock > 15 ? "low" : "out",
        omegaStock > 40 ? "Đủ hàng" : omegaStock > 15 ? "Sắp hết" : "Hết hàng"
      ),
      mockStockItem(
        locationId,
        "p2",
        "BSV-2281",
        productDisplayName("BSV-2281", "vi"),
        productDisplayCategory("BSV-2281", "vi"),
        "₫185,000",
        "₫92,000",
        vitStock,
        30,
        vitStock > 30 ? "ok" : vitStock > 10 ? "low" : "out",
        vitStock > 30 ? "Đủ hàng" : vitStock > 10 ? "Sắp hết" : "Hết hàng"
      ),
      mockStockItem(
        locationId,
        "p3",
        "BSV-9033",
        productDisplayName("BSV-9033", "vi"),
        productDisplayCategory("BSV-9033", "vi"),
        "₫560,000",
        "₫340,000",
        collagenStock,
        20,
        collagenStock > 15 ? "ok" : collagenStock > 0 ? "low" : "out",
        collagenStock > 15 ? "Đủ hàng" : collagenStock > 0 ? "Sắp hết" : "Hết hàng"
      ),
      mockStockItem(
        locationId,
        "p4",
        "BSV-7710",
        productDisplayName("BSV-7710", "vi"),
        productDisplayCategory("BSV-7710", "vi"),
        "₫295,000",
        "₫168,000",
        Math.max(probioticStock, 10),
        25,
        probioticStock > 15 ? "ok" : probioticStock > 0 ? "low" : "out",
        probioticStock > 15 ? "Đủ hàng" : probioticStock > 0 ? "Sắp hết" : "Hết hàng"
      ),
      mockStockItem(
        locationId,
        "p5",
        "BSV-6108",
        productDisplayName("BSV-6108", "vi"),
        productDisplayCategory("BSV-6108", "vi"),
        "₫380,000",
        "₫210,000",
        Math.max(yogiStock, 8),
        18,
        yogiStock > 12 ? "ok" : yogiStock > 0 ? "low" : "out",
        yogiStock > 12 ? "Đủ hàng" : yogiStock > 0 ? "Sắp hết" : "Hết hàng"
      ),
      mockStockItem(
        locationId,
        "p6",
        "BSV-9302",
        productDisplayName("BSV-9302", "vi"),
        productDisplayCategory("BSV-9302", "vi"),
        "₫156,000",
        "₫88,000",
        Math.max(cafeStock, 12),
        22,
        cafeStock > 14 ? "ok" : cafeStock > 0 ? "low" : "out",
        cafeStock > 14 ? "Đủ hàng" : cafeStock > 0 ? "Sắp hết" : "Hết hàng"
      ),
    ],
  };
}

export const locationMockVi = {
  list: () => listVi,
  meta: (id: string) => metaVi(id),
  overview: (id: string) => overviewVi(id),
  staffCosts: () => staffCostsVi,
  sales: (id: string) => salesVi(id),
  customer: (locationId: string, customerId: string) =>
    getLocationCustomerDetail(locationId, customerId, "vi"),
  warehouse: (id: string) => warehouseVi(id),
  inboundOrder: (orderId: string) => getInboundOrderDetail(orderId),
  ids: LOCATION_IDS,
};

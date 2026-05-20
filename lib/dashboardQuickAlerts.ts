import type { DashboardQuickAlert } from "@/types/dashboard";

type Locale = "vi" | "en" | "zh";

/** Số cảnh báo hiển thị cùng lúc trên dashboard. */
export const QUICK_ALERTS_VISIBLE = 8;

const ALERT_SEEDS: Array<{
  id: string;
  messageVi: string;
  messageEn: string;
  messageZh: string;
  severity?: DashboardQuickAlert["severity"];
}> = [
  {
    id: "1",
    messageVi: "Doanh thu vùng Hà Nội −18%",
    messageEn: "Hanoi region revenue −18%",
    messageZh: "河内区域营收 −18%",
    severity: "warning",
  },
  {
    id: "2",
    messageVi: "12 SKU tồn thấp",
    messageEn: "12 SKU low stock",
    messageZh: "12 个 SKU 库存偏低",
    severity: "warning",
  },
  {
    id: "3",
    messageVi: "Cửa hàng #21 doanh số bất thường thấp",
    messageEn: "Store #21 unusually low sales",
    messageZh: "21 号店销售额异常偏低",
    severity: "warning",
  },
  {
    id: "4",
    messageVi: "Biên lợi nhuận giảm 6%",
    messageEn: "Margin dropped 6%",
    messageZh: "毛利率下降 6%",
    severity: "warning",
  },
  {
    id: "5",
    messageVi: "Hết hàng SKU-4412 tại HN",
    messageEn: "Stock-out SKU-4412 in Hanoi",
    messageZh: "河内 SKU-4412 缺货",
    severity: "danger",
  },
  {
    id: "6",
    messageVi: "Đơn OTC tăng đột biến +18%",
    messageEn: "OTC orders spiked +18%",
    messageZh: "OTC 订单激增 +18%",
    severity: "warning",
  },
  {
    id: "7",
    messageVi: "Điểm nhà cung cấp Miền Bắc < 65",
    messageEn: "Northern vendor score < 65",
    messageZh: "北部供应商评分 < 65",
    severity: "warning",
  },
  {
    id: "8",
    messageVi: "TP.HCM vượt ngưỡng doanh thu ngày +12%",
    messageEn: "HCMC exceeded daily revenue target +12%",
    messageZh: "胡志明市日营收超目标 +12%",
    severity: "info",
  },
  {
    id: "9",
    messageVi: "4 cửa hàng chưa đồng bộ tồn kho",
    messageEn: "4 stores inventory sync pending",
    messageZh: "4 家门店库存未同步",
    severity: "warning",
  },
  {
    id: "10",
    messageVi: "Chi phí vận chuyển ĐBSCL +9% WoW",
    messageEn: "Mekong logistics cost +9% WoW",
    messageZh: "湄公河区域物流成本周环比 +9%",
    severity: "warning",
  },
  {
    id: "11",
    messageVi: "Nha Trang: tồn collagen < 7 ngày",
    messageEn: "Nha Trang: collagen stock < 7 days",
    messageZh: "芽庄：胶原蛋白库存 < 7 天",
    severity: "danger",
  },
  {
    id: "12",
    messageVi: "Hải Phòng: khách mới giảm 5% so với hôm qua",
    messageEn: "Hai Phong: new customers down 5% vs yesterday",
    messageZh: "海防：新客户较昨日 −5%",
    severity: "warning",
  },
  {
    id: "13",
    messageVi: "Đà Nẵng: doanh thu tuần vượt kế hoạch +7%",
    messageEn: "Da Nang: weekly revenue beat plan +7%",
    messageZh: "岘港：周营收超计划 +7%",
    severity: "info",
  },
  {
    id: "14",
    messageVi: "Cảnh báo hạn dùng lô L-882 tại kho HCM",
    messageEn: "Batch L-882 expiry alert at HCM warehouse",
    messageZh: "胡志明仓库批次 L-882 临期预警",
    severity: "danger",
  },
];

export function buildDashboardQuickAlerts(locale: Locale): DashboardQuickAlert[] {
  return ALERT_SEEDS.map((a) => ({
    id: a.id,
    severity: a.severity ?? "warning",
    message:
      locale === "zh" ? a.messageZh : locale === "en" ? a.messageEn : a.messageVi,
  }));
}

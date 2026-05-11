import type { LocationListItem, LocationMeta } from "@/types/location";
import { LOCATION_SEEDS } from "./locationRegistry";

export function locationMetaFromList(list: LocationListItem[], id: string): LocationMeta {
  const row = list.find((l) => l.id === id) ?? list[0];
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    type: row.type,
    typeLabel: row.typeLabel,
    address: row.address,
    city: row.city,
    phone: "1900 6688",
    status: row.status,
    statusLabel: row.statusLabel,
    openSince: row.openSince,
  };
}

function typeLabelVi(type: LocationListItem["type"]) {
  return type === "owned" ? "Tự mở" : "Nhượng quyền";
}

function statusLabelVi(status: LocationListItem["status"]) {
  if (status === "active") return "Đang hoạt động";
  if (status === "setup") return "Đang triển khai";
  return "Tạm dừng";
}

export function locationListVi(): LocationListItem[] {
  return LOCATION_SEEDS.map((s) => ({
    id: s.id,
    code: s.code,
    name: s.nameVi,
    type: s.type,
    typeLabel: typeLabelVi(s.type),
    address: s.addressVi,
    city: s.cityVi,
    managerName: s.managerVi,
    staffCount: s.staffCount,
    status: s.status,
    statusLabel: statusLabelVi(s.status),
    monthlyRevenueDisplay: s.monthlyRevenueVi,
    fillRatePct: s.fillRatePct,
    openSince: s.openSince,
  }));
}

export function locationListEn(): LocationListItem[] {
  return LOCATION_SEEDS.map((s) => ({
    id: s.id,
    code: s.code,
    name: s.nameEn,
    type: s.type,
    typeLabel: s.type === "owned" ? "Company-owned" : "Franchise",
    address: s.addressEn,
    city: s.cityEn,
    managerName: s.managerEn,
    staffCount: s.staffCount,
    status: s.status,
    statusLabel:
      s.status === "active" ? "Active" : s.status === "setup" ? "In rollout" : "Paused",
    monthlyRevenueDisplay: s.monthlyRevenueEn,
    fillRatePct: s.fillRatePct,
    openSince: s.openSince,
  }));
}

export function locationListZh(): LocationListItem[] {
  return LOCATION_SEEDS.map((s) => ({
    id: s.id,
    code: s.code,
    name: s.nameZh,
    type: s.type,
    typeLabel: s.type === "owned" ? "直营" : "加盟",
    address: s.addressZh,
    city: s.cityZh,
    managerName: s.managerZh,
    staffCount: s.staffCount,
    status: s.status,
    statusLabel:
      s.status === "active" ? "营业中" : s.status === "setup" ? "筹备中" : "暂停",
    monthlyRevenueDisplay: s.monthlyRevenueZh,
    fillRatePct: s.fillRatePct,
    openSince: s.openSince,
  }));
}

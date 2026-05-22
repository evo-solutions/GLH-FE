import { locationIndex } from "@/lib/locationRegistry";

export {
  formatJustInDelta,
  formatRevenueVnd as formatLiveRevenueVnd,
} from "@/lib/liveRevenueCounter";

/** Doanh thu ngày ban đầu (VND) theo cơ sở — seed cho ticker thời gian thực. */
export function locationLiveRevenueBase(locationId: string): number {
  const idx = locationIndex(locationId);
  const hour = new Date().getHours();
  const dayProgress = 0.35 + (hour / 24) * 0.45;
  return Math.round((6_500_000 + idx * 1_850_000) * dayProgress);
}

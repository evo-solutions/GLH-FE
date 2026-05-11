import { api } from "@/services/api/axios";
import type {
  LocationCustomerDetail,
  LocationInboundOrderDetail,
  LocationListItem,
  LocationMeta,
  LocationOverview,
  LocationSales,
  LocationStaffCosts,
  LocationWarehouse,
} from "@/types/location";
import { LOCATION_API } from "./location.api";
import { locationMockEn } from "./location-mock-en";
import { locationMockZh } from "./location-mock-zh";
import { locationMockVi } from "./location.mock";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

function mockFor(locale: string) {
  if (locale === "en") return locationMockEn;
  if (locale === "zh") return locationMockZh;
  return locationMockVi;
}

export async function fetchLocationList(locale = "vi"): Promise<LocationListItem[]> {
  if (USE_MOCK) {
    await delay(350);
    return mockFor(locale).list();
  }
  const { data } = await api.get<LocationListItem[]>(LOCATION_API.list);
  return data;
}

export async function fetchLocationMeta(
  id: string,
  locale = "vi"
): Promise<LocationMeta> {
  if (USE_MOCK) {
    await delay(200);
    return mockFor(locale).meta(id);
  }
  const { data } = await api.get<LocationMeta>(LOCATION_API.meta(id));
  return data;
}

export async function fetchLocationOverview(
  id: string,
  locale = "vi"
): Promise<LocationOverview> {
  if (USE_MOCK) {
    await delay(400);
    return mockFor(locale).overview(id);
  }
  const { data } = await api.get<LocationOverview>(LOCATION_API.overview(id));
  return data;
}

export async function fetchLocationStaffCosts(
  id: string,
  locale = "vi"
): Promise<LocationStaffCosts> {
  if (USE_MOCK) {
    await delay(350);
    return mockFor(locale).staffCosts();
  }
  const { data } = await api.get<LocationStaffCosts>(LOCATION_API.staffCosts(id));
  return data;
}

export async function fetchLocationSales(
  id: string,
  locale = "vi"
): Promise<LocationSales> {
  if (USE_MOCK) {
    await delay(350);
    return mockFor(locale).sales(id);
  }
  const { data } = await api.get<LocationSales>(LOCATION_API.sales(id));
  return data;
}

export async function fetchLocationCustomerDetail(
  locationId: string,
  customerId: string,
  locale = "vi"
): Promise<LocationCustomerDetail> {
  if (USE_MOCK) {
    await delay(250);
    return mockFor(locale).customer(locationId, customerId);
  }
  const { data } = await api.get<LocationCustomerDetail>(
    LOCATION_API.customer(locationId, customerId)
  );
  return data;
}

export async function fetchLocationWarehouse(
  id: string,
  locale = "vi"
): Promise<LocationWarehouse> {
  if (USE_MOCK) {
    await delay(350);
    return mockFor(locale).warehouse(id);
  }
  const { data } = await api.get<LocationWarehouse>(LOCATION_API.warehouse(id));
  return data;
}

export async function fetchLocationInboundOrderDetail(
  locationId: string,
  orderId: string,
  locale = "vi"
): Promise<LocationInboundOrderDetail> {
  if (USE_MOCK) {
    await delay(250);
    return mockFor(locale).inboundOrder(orderId);
  }
  const { data } = await api.get<LocationInboundOrderDetail>(
    LOCATION_API.inboundOrder(locationId, orderId)
  );
  return data;
}

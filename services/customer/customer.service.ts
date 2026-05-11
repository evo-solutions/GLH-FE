import { api } from "@/services/api/axios";
import { getLocationCustomerDetail } from "@/lib/customerDetailData";
import { getAllGlobalCustomers } from "@/lib/customerListData";
import { parseGlobalCustomerId } from "@/lib/customerRoutes";
import type { GlobalCustomerListItem } from "@/types/customer";
import type { LocationCustomerDetail } from "@/types/location";
import { CUSTOMER_API } from "./customer.api";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function fetchCustomerList(locale = "vi"): Promise<GlobalCustomerListItem[]> {
  if (USE_MOCK) {
    await delay(350);
    const loc = locale === "zh" ? "zh" : locale === "en" ? "en" : "vi";
    return getAllGlobalCustomers(loc);
  }
  const { data } = await api.get<GlobalCustomerListItem[]>(CUSTOMER_API.list);
  return data;
}

export async function fetchGlobalCustomerDetail(
  globalId: string,
  locale = "vi"
): Promise<LocationCustomerDetail> {
  if (USE_MOCK) {
    await delay(250);
    const parsed = parseGlobalCustomerId(globalId);
    if (!parsed) throw new Error("Invalid customer id");
    const loc = locale === "zh" ? "zh" : locale === "en" ? "en" : "vi";
    return getLocationCustomerDetail(parsed.locationId, parsed.customerId, loc);
  }
  const { data } = await api.get<LocationCustomerDetail>(CUSTOMER_API.detail(globalId));
  return data;
}

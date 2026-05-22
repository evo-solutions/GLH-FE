import { redirect } from "next/navigation";
import { DEFAULT_RETAIL_MODEL } from "@/libs/business-models/config";
import { modelCustomerListPath } from "@/lib/businessModelRoutes";

export default function LegacyCustomerPage() {
  redirect(modelCustomerListPath(DEFAULT_RETAIL_MODEL));
}

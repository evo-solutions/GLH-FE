import { redirect } from "next/navigation";
import { DEFAULT_RETAIL_MODEL } from "@/libs/business-models/config";
import { modelOrderListPath } from "@/lib/businessModelRoutes";

export default function LegacyOrderPage() {
  redirect(modelOrderListPath(DEFAULT_RETAIL_MODEL));
}

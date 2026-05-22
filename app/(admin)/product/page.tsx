import { redirect } from "next/navigation";
import { DEFAULT_RETAIL_MODEL } from "@/libs/business-models/config";
import { modelProductListPath } from "@/lib/businessModelRoutes";

export default function LegacyProductPage() {
  redirect(modelProductListPath(DEFAULT_RETAIL_MODEL));
}

import { redirect } from "next/navigation";
import { DEFAULT_RETAIL_MODEL } from "@/libs/business-models/config";
import { modelLocationListPath } from "@/lib/businessModelRoutes";

export default function LegacyLocationPage() {
  redirect(modelLocationListPath(DEFAULT_RETAIL_MODEL));
}

export function alertToneColor(status: string) {
  if (status === "danger") return "error";
  if (status === "warning") return "warning";
  if (status === "success") return "success";
  return "processing";
}

export function riskTagColor(k: string) {
  if (k === "high") return "error";
  if (k === "medium") return "warning";
  return "success";
}

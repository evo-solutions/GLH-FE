export function formatNumber(
  val: number,
  opts: { format?: string; prefix?: string; suffix?: string },
  numberLocale: string
) {
  const fmt = opts.format;
  const prefix = opts.prefix || "";
  const suffix = opts.suffix || "";
  if (fmt === "compact")
    return (
      prefix +
      (val >= 1e6
        ? (val / 1e6).toFixed(2) + "M"
        : (val / 1e3).toFixed(0) + "K") +
      suffix
    );
  if (fmt === "billions") return prefix + val.toFixed(1) + "B";
  return prefix + val.toLocaleString(numberLocale) + suffix;
}

export function animateValue(
  el: HTMLElement,
  target: number,
  duration: number,
  opts: { format?: string; prefix?: string; suffix?: string },
  numberLocale: string
) {
  const start = performance.now();
  const from = 0;
  function frame(now: number) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const cur = from + (target - from) * eased;
    const isFloat =
      String(target).includes(".") || opts.format === "billions";
    let disp: number = isFloat ? cur : Math.round(cur);
    if (opts.format === "billions") disp = cur;
    el.textContent = formatNumber(disp, opts, numberLocale);
    if (p < 1) requestAnimationFrame(frame);
    else el.textContent = formatNumber(target, opts, numberLocale);
  }
  requestAnimationFrame(frame);
}

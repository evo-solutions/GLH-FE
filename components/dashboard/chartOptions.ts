import type { Plugin } from "chart.js";
import { themeColors } from "@/libs/theme/fallbacks";

const fallback = themeColors("light");

const CSS_VAR_FALLBACK: Record<string, string> = {
  "--primary": fallback.primary,
  "--success": fallback.success,
  "--warning": fallback.warning,
  "--danger": fallback.danger,
  "--info": fallback.info,
  "--text": fallback.text,
  "--muted": fallback.textSecondary,
  "--text-secondary": fallback.textSecondary,
  "--text-muted": fallback.textMuted,
  "--border": fallback.border,
  "--background": fallback.bgPage,
  "--bg-page": fallback.bgPage,
  "--chart-1": fallback.chart1,
  "--chart-2": fallback.chart2,
  "--chart-3": fallback.chart3,
  "--chart-4": fallback.chart4,
  "--pharma": fallback.primary,
  "--leaf": fallback.success,
  "--gold": fallback.warning,
  "--bronze": fallback.chart3,
};

/** Chart dataset accent colors from CSS variables (theme-aware). */
export function readChartAccentColors() {
  const fb = fallback;
  return {
    primary: readThemeColor("--primary", fb.primary),
    success: readThemeColor("--success", fb.success),
    warning: readThemeColor("--warning", fb.warning),
    info: readThemeColor("--info", fb.info),
    danger: readThemeColor("--danger", fb.danger),
    chart2: readThemeColor("--chart-2", fb.chart2),
    chart3: readThemeColor("--chart-3", fb.chart3),
    chart4: readThemeColor("--chart-4", fb.chart4),
  };
}

export function readThemeColor(name: string, fallbackColor?: string) {
  const fb = fallbackColor ?? CSS_VAR_FALLBACK[name] ?? fallback.text;
  if (typeof document === "undefined") return fb;
  return (
    getComputedStyle(document.documentElement).getPropertyValue(name).trim() ||
    fb
  );
}

function parseColorToRgb(color: string): [number, number, number] | null {
  const hex = color.trim();
  if (hex.startsWith("#")) {
    const h = hex.slice(1);
    const full =
      h.length === 3
        ? h
            .split("")
            .map((c) => c + c)
            .join("")
        : h.length >= 6
          ? h.slice(0, 6)
          : null;
    if (!full) return null;
    return [
      parseInt(full.slice(0, 2), 16),
      parseInt(full.slice(2, 4), 16),
      parseInt(full.slice(4, 6), 16),
    ];
  }
  const rgb = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (rgb) return [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])];
  return null;
}

/** Giá trị đếm (khách hàng, tồn kho…) hiển thị theo nghìn — làm tròn, không thập phân. */
export function formatCountInThousands(value: number): string {
  return `${Math.round(value / 1000)}`;
}

const CUSTOMER_COUNT_Y_STEP_K = 10;
const CUSTOMER_COUNT_EXTRA_Y_LEVELS = 3;

/** Trục Y khách hàng (nghìn): thêm 3 mức trên đỉnh dữ liệu. */
export function customerCountYScale(values: number[]) {
  const step = CUSTOMER_COUNT_Y_STEP_K * 1000;
  if (values.length === 0) {
    return { suggestedMin: undefined as number | undefined, suggestedMax: undefined, stepSize: step };
  }
  const minK = Math.min(...values.map((v) => Math.round(v / 1000)));
  const maxK = Math.max(...values.map((v) => Math.round(v / 1000)));
  const stepK = CUSTOMER_COUNT_Y_STEP_K;
  const bottomK = Math.max(0, Math.floor(minK / stepK) * stepK - stepK);
  const topK =
    bottomK +
    Math.ceil((maxK - bottomK) / stepK) * stepK -
    stepK +
    CUSTOMER_COUNT_EXTRA_Y_LEVELS * stepK;
  return {
    suggestedMin: bottomK * 1000,
    suggestedMax: topK * 1000,
    stepSize: step,
  };
}

const thousandsLabelChartIds = new Set<string>();

export function markChartThousandsLabels(canvasId: string) {
  thousandsLabelChartIds.add(canvasId);
}

export function unmarkChartThousandsLabels(canvasId: string) {
  thousandsLabelChartIds.delete(canvasId);
}

function chartUsesThousandsLabels(chart: { canvas?: { id?: string } }) {
  const id = chart.canvas?.id;
  return id != null && thousandsLabelChartIds.has(id);
}

/** Nhãn trên line chart — đơn vị nghìn (3 chữ số). */
export const chartValueLabelsThousandsPlugin: Plugin = {
  id: "chartValueLabelsThousands",
  afterDatasetsDraw(chart) {
    const chartType = (chart.config as { type?: string }).type;
    if (chartType === "doughnut" || chartType === "pie") return;
    if (!chartUsesThousandsLabels(chart)) return;

    const { ctx } = chart;
    const labelColor = readThemeColor("--text", fallback.text);
    const pointCount = chart.data.datasets[0]?.data?.length ?? 0;

    chart.data.datasets.forEach((dataset, datasetIndex) => {
      const meta = chart.getDatasetMeta(datasetIndex);
      if (meta.hidden) return;

      meta.data.forEach((element, index) => {
        const raw = dataset.data[index];
        if (raw == null || typeof raw !== "number") return;

        const label = formatCountInThousands(raw);
        const pos = element.tooltipPosition(false);
        if (pos.x == null || pos.y == null) return;

        const stagger = index % 2 === 0 ? 12 : 22;
        const fontSize = pointCount > 10 ? 9 : 10;

        ctx.save();
        ctx.fillStyle = labelColor;
        ctx.font = `600 ${fontSize}px Inter, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.fillText(label, pos.x, pos.y - stagger);
        ctx.restore();
      });
    });
  },
};

/** Chữ sáng/tối theo độ sáng nền segment. */
export function contrastTextOnFill(fill: string): string {
  const rgb = parseColorToRgb(fill);
  if (!rgb) return readThemeColor("--text", fallback.text);
  const [r, g, b] = rgb.map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 0.45 ? readThemeColor("--text", fallback.text) : "#ffffff";
}

/** Hiển thị giá trị trên bar / điểm line (không dùng cho doughnut/pie). */
export const chartValueLabelsPlugin: Plugin = {
  id: "chartValueLabels",
  afterDatasetsDraw(chart) {
    const chartType = (chart.config as { type?: string }).type;
    if (chartType === "doughnut" || chartType === "pie") return;
    if (chartUsesThousandsLabels(chart)) return;

    const { ctx } = chart;
    const labelColor = readThemeColor("--text", fallback.text);

    chart.data.datasets.forEach((dataset, datasetIndex) => {
      const meta = chart.getDatasetMeta(datasetIndex);
      if (meta.hidden) return;

      meta.data.forEach((element, index) => {
        const raw = dataset.data[index];
        if (raw == null || typeof raw !== "number") return;

        const chartType = (chart.config as { type?: string }).type;
        const indexAxis = (chart.options as { indexAxis?: string }).indexAxis;

        const label =
          chartType === "line"
            ? raw.toFixed(0)
            : indexAxis === "y"
              ? raw.toFixed(1)
              : String(Math.round(raw));

        const pos = element.tooltipPosition(false);
        if (pos.x == null || pos.y == null) return;
        ctx.save();
        ctx.fillStyle = labelColor;
        ctx.font = "600 10px Inter, sans-serif";
        ctx.textAlign = indexAxis === "y" ? "left" : "center";
        ctx.textBaseline = "middle";

        if (indexAxis === "y") {
          ctx.fillText(label, pos.x + 6, pos.y);
        } else if (chartType === "line") {
          ctx.fillText(label, pos.x, pos.y - 10);
        } else {
          ctx.fillText(label, pos.x, pos.y - 6);
        }
        ctx.restore();
      });
    });
  },
};

/** Nhãn % bên trong doughnut — màu tương phản theo từng segment. */
export const chartDoughnutLabelsPlugin: Plugin = {
  id: "chartDoughnutLabels",
  afterDatasetsDraw(chart) {
    const chartType = (chart.config as { type?: string }).type;
    if (chartType !== "doughnut" && chartType !== "pie") return;

    const { ctx } = chart;
    const dataset = chart.data.datasets[0];
    if (!dataset) return;

    const bg = (dataset.backgroundColor as string[]) ?? [];
    const meta = chart.getDatasetMeta(0);

    meta.data.forEach((element, index) => {
      const raw = dataset.data[index];
      if (raw == null || typeof raw !== "number") return;

      const arc = element as { circumference?: number };
      if (arc.circumference != null && arc.circumference < 0.35) return;

      const pos = element.tooltipPosition(false);
      if (pos.x == null || pos.y == null) return;

      const fill = String(bg[index] ?? readThemeColor("--primary", fallback.primary));
      const label = String(Math.round(raw));

      ctx.save();
      ctx.fillStyle = contrastTextOnFill(fill);
      ctx.font = "700 11px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = contrastTextOnFill(fill) === "#ffffff"
        ? "rgba(0,0,0,0.35)"
        : "rgba(255,255,255,0.5)";
      ctx.shadowBlur = 2;
      ctx.fillText(label, pos.x, pos.y);
      ctx.restore();
    });
  },
};

export function compactChartOptions(
  type: "line" | "bar" | "barH" | "doughnut"
) {
  const muted = readThemeColor("--muted", fallback.textSecondary);
  const border = readThemeColor("--border", fallback.border);
  const text = readThemeColor("--text", fallback.text);
  const bg = readThemeColor("--background", fallback.bgPage);

  const tick = { color: muted, font: { size: 10 } as const };
  const grid = { color: border, drawBorder: false };

  const base = {
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: { top: 8, right: type === "barH" ? 28 : 4, bottom: 0 } },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: bg,
        titleColor: text,
        bodyColor: text,
        borderColor: border,
        borderWidth: 1,
        titleFont: { size: 11 },
        bodyFont: { size: 11 },
        padding: 8,
        callbacks: {
          label: (ctx: { parsed: { y?: number; x?: number }; dataset: { label?: string } }) => {
            const v =
              ctx.parsed.y ?? ctx.parsed.x ?? 0;
            return ` ${ctx.dataset.label ?? ""}: ${typeof v === "number" ? v.toLocaleString() : v}`;
          },
        },
      },
    },
  };

  if (type === "doughnut") {
    return {
      ...base,
      cutout: "58%",
      plugins: {
        ...base.plugins,
        legend: {
          display: true,
          position: "right" as const,
          labels: {
            boxWidth: 8,
            padding: 8,
            font: { size: 10, weight: 500 },
            color: text,
          },
        },
      },
    };
  }

  if (type === "barH") {
    return {
      ...base,
      indexAxis: "y" as const,
      datasets: {
        bar: {
          barThickness: 14,
          maxBarThickness: 16,
          categoryPercentage: 0.72,
          barPercentage: 0.85,
          borderRadius: 4,
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          grid,
          ticks: {
            ...tick,
            callback: (v: string | number) => `${v}`,
          },
        },
        y: {
          grid: { display: false },
          ticks: { ...tick, autoSkip: false },
        },
      },
    };
  }

  if (type === "bar") {
    return {
      ...base,
      datasets: {
        bar: {
          maxBarThickness: 28,
          categoryPercentage: 0.65,
          barPercentage: 0.75,
          borderRadius: 4,
        },
      },
      scales: {
        x: { grid: { display: false }, ticks: tick },
        y: { beginAtZero: true, grid, ticks: tick },
      },
    };
  }

  return {
    ...base,
    interaction: { mode: "index" as const, intersect: false },
    elements: {
      line: { borderWidth: 2, tension: 0.35 },
      point: { radius: 2, hoverRadius: 4 },
    },
    scales: {
      x: { grid: { display: false }, ticks: { ...tick, maxRotation: 0 } },
      y: { beginAtZero: false, grid, ticks: tick },
    },
  };
}

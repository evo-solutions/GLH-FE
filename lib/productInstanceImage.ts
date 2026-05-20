import { palette } from "@/libs/theme/colors";

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Ảnh placeholder SVG — không phụ thuộc CDN ngoài. */
export function productInstanceImageDataUrl(productCode: string, index: number): string {
  const colors = [
    palette.light.chart1,
    palette.light.success,
    palette.light.info,
    palette.light.chart3,
  ];
  const bg = colors[(hash(productCode) + index) % colors.length];
  const accent = "#ffffff";
  const short = productCode.replace(/^BSV-/i, "").slice(0, 6);
  const boxNo = String(index).padStart(3, "0");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96" role="img">
  <rect width="96" height="96" rx="12" fill="${bg}"/>
  <rect x="14" y="22" width="68" height="52" rx="6" fill="${accent}" fill-opacity="0.92"/>
  <text x="48" y="46" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" font-weight="700" fill="${bg}">${short}</text>
  <text x="48" y="62" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="${bg}" fill-opacity="0.85">#${boxNo}</text>
</svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

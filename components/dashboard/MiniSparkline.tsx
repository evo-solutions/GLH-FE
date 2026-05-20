"use client";

type MiniSparklineProps = {
  values: number[];
  width?: number;
  height?: number;
  className?: string;
};

export function MiniSparkline({
  values,
  width = 88,
  height = 32,
  className = "",
}: MiniSparklineProps) {
  if (values.length < 2) return null;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const pad = 2;
  const innerW = width - pad * 2;
  const innerH = height - pad * 2;

  const points = values
    .map((v, i) => {
      const x = pad + (i / (values.length - 1)) * innerW;
      const y = pad + innerH - ((v - min) / range) * innerH;
      return `${x},${y}`;
    })
    .join(" ");

  const last = values[values.length - 1];
  const prev = values[values.length - 2];
  const stroke = last >= prev ? "var(--success)" : "var(--danger)";

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={`dashboard-sparkline ${className}`.trim()}
      aria-hidden
    >
      <polyline
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
      <circle
        cx={pad + innerW}
        cy={pad + innerH - ((last - min) / range) * innerH}
        r="2.5"
        fill={stroke}
      />
    </svg>
  );
}

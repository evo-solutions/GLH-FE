"use client";

import Image from "next/image";
import Link from "next/link";
import { brandLogoForTheme } from "@/libs/brand/logo";
import { useThemeContext } from "@/libs/theme/ThemeProvider";

const LOGO_ASPECT = 1024 / 575;

const SIZE_CLASS = {
  sm: "h-7",
  md: "h-9",
  lg: "h-11",
} as const;

type LogoProps = {
  size?: keyof typeof SIZE_CLASS;
  href?: string | null;
  className?: string;
  priority?: boolean;
};

export function Logo({
  size = "md",
  href = "/",
  className = "",
  priority = false,
}: LogoProps) {
  const { theme } = useThemeContext();
  const src = brandLogoForTheme(theme);
  const heightPx = size === "sm" ? 28 : size === "lg" ? 44 : 36;
  const width = Math.round(heightPx * LOGO_ASPECT);

  const image = (
    <Image
      src={src}
      alt="Golden Lotus Herbals"
      width={width}
      height={heightPx}
      priority={priority}
      className={`block w-auto max-w-full object-contain object-lef rounded-lg ${SIZE_CLASS[size]} ${className}`.trim()}
    />
  );

  if (href) {
    return (
      <Link
        href={href}
        className="inline-flex shrink-0 items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
        aria-label="Golden Lotus Herbals"
      >
        {image}
      </Link>
    );
  }

  return <span className="inline-flex shrink-0 items-center">{image}</span>;
}

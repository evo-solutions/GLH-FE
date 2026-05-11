export type Locale = (typeof locales)[number];

export const locales = ["vi", "en", "zh"] as const;
export const defaultLocale: Locale = "vi";

import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';
import { defaultLocale, locales, type Locale } from "./config";

export default getRequestConfig(async () => {
  // Detect locale from cookies, headers, or use default
  const cookieStore = await cookies();
  const headersList = await headers();

  let raw =
    cookieStore.get("NEXT_LOCALE")?.value ||
    headersList.get("accept-language")?.split(",")[0]?.split("-")[0] ||
    defaultLocale;
  let locale = raw?.toLowerCase() === "zh-cn" || raw?.toLowerCase() === "zh-tw" ? "zh" : raw;

  if (!locales.includes(locale as Locale)) {
    locale = defaultLocale;
  }

  const root = (await import(`@/libs/i18n/messages/${locale}/root.json`)).default;
  const goldenLotus = (await import(`@/libs/i18n/messages/${locale}/golden-lotus.json`))
    .default;

  return {
    locale,
    messages: {
      ...root,
      GoldenLotus: goldenLotus,
    },
  };
});

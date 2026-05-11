"use client";

import { CheckOutlined } from "@ant-design/icons";
import { Button, Dropdown } from "antd";
import type { MenuProps } from "antd";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import type { Locale } from "@/libs/i18n/config";

const languageOptions: { locale: Locale; flag: string; label: string }[] = [
  { locale: "vi", flag: "🇻🇳", label: "Tiếng Việt" },
  { locale: "en", flag: "🇬🇧", label: "English" },
  { locale: "zh", flag: "🇨🇳", label: "中文" },
];

const languageFlags = Object.fromEntries(
  languageOptions.map((o) => [o.locale, o.flag])
) as Record<Locale, string>;

export function LanguageToggle() {
  const locale = useLocale() as Locale;
  const router = useRouter();

  const setLocale = (next: Locale) => {
    if (next === locale) return;
    document.cookie = `NEXT_LOCALE=${next};path=/;max-age=31536000`;
    router.refresh();
  };

  const items: MenuProps["items"] = languageOptions.map((opt) => ({
    key: opt.locale,
    label: (
      <span className="flex min-w-[8.5rem] items-center gap-2">
        <span className="text-base leading-none">{opt.flag}</span>
        <span className="flex-1">{opt.label}</span>
        {locale === opt.locale ? (
          <CheckOutlined className="text-pharma text-xs" />
        ) : null}
      </span>
    ),
  }));

  return (
    <Dropdown
      menu={{
        items,
        selectedKeys: [locale],
        onClick: ({ key }) => setLocale(key as Locale),
      }}
      trigger={["click"]}
      placement="bottomRight"
    >
      <Button
        type="text"
        size="large"
        className="!min-w-10"
        aria-label="Language"
        aria-haspopup="listbox"
      >
        {languageFlags[locale]}
      </Button>
    </Dropdown>
  );
}

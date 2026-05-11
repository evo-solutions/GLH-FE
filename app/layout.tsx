import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { ThemeProvider } from "@/libs/theme/ThemeProvider";
import { AntdProvider } from "@/libs/antd/AntdProvider";
import { ReactQueryProvider } from "@/libs/tanstack/ReactQueryProvider";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import "./globals.css";
import "antd/dist/reset.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const inter = Inter({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return { title: t("app_title"), description: t("app_description") };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const messages = await getMessages();
  const locale = await getLocale();

  return (
    <html lang={locale} className="light" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.classList.remove("light","dark");document.documentElement.classList.add(t)}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <ReactQueryProvider>
            <NextIntlClientProvider messages={messages}>
              <AntdProvider>{children}</AntdProvider>
            </NextIntlClientProvider>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin('./libs/i18n/request.ts');

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/m/y-thuc-tri-lieu/:path*",
        destination: "/m/yogi-food/:path*",
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);

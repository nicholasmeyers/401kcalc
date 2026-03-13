import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import type { ReactNode } from "react";
import { ThemeProvider } from "styled-components";

import { AnalyticsScript } from "@/components/analytics/analytics-script";
import { RouteAnalyticsTracker } from "@/components/analytics/route-analytics-tracker";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { StyledComponentsRegistry } from "@/lib/styled-components-registry";
import { GlobalStyle } from "@/styles/GlobalStyle";
import { theme } from "@/styles/theme";
import { siteConfig } from "@/lib/site";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "401(k) Calculator and Retirement Planning Guides",
    template: "%s | 401kcalc",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "401(k) calculator",
    "retirement calculator",
    "retirement planning",
    "401k projection",
    "retirement savings benchmark",
  ],
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: siteConfig.defaultSocialImagePath,
        width: 1200,
        height: 630,
        alt: "401kcalc retirement projection software",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.defaultSocialImagePath],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <AnalyticsScript />
      </head>
      <body className={manrope.variable}>
        <RouteAnalyticsTracker />
        <StyledComponentsRegistry>
          <ThemeProvider theme={theme}>
            <GlobalStyle />
            <Header />
            <main>{children}</main>
            <Footer />
          </ThemeProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import type { ReactNode } from "react";
import { ThemeProvider } from "styled-components";

import { AnalyticsScript } from "@/components/analytics/analytics-script";
import { RouteAnalyticsTracker } from "@/components/analytics/route-analytics-tracker";
import { ThemeModeProvider } from "@/contexts/theme-context";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { StyledComponentsRegistry } from "@/lib/styled-components-registry";
import { GlobalStyle } from "@/styles/GlobalStyle";
import { theme } from "@/styles/theme";
import { siteConfig } from "@/lib/site";

const themeInitScript = `(function(){try{var m=localStorage.getItem("theme-mode");var d;if(m==="dark")d=true;else if(m==="light")d=false;else{var h=new Date().getHours();d=h>=17||h<8}document.documentElement.setAttribute("data-theme",d?"dark":"light")}catch(e){}})();`;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2563eb",
};

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  icons: {
    icon: "/favicon.ico",
    apple: "/images/logo-icon-large.png",
  },
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

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  url: siteConfig.url,
  logo: `${siteConfig.url}/images/logo.png`,
  sameAs: [],
};

const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  publisher: { "@id": siteConfig.url },
  inLanguage: "en-US",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <AnalyticsScript />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }} />
      </head>
      <body className={manrope.variable}>
        <RouteAnalyticsTracker />
        <StyledComponentsRegistry>
          <ThemeProvider theme={theme}>
            <ThemeModeProvider>
              <GlobalStyle />
              <Header />
              <main>{children}</main>
              <Footer />
            </ThemeModeProvider>
          </ThemeProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}

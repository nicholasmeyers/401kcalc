import Script from "next/script";

import { siteConfig } from "@/lib/site";

const plausibleScriptPath = "/js/script.js";

function getPlausibleDomain(): string | undefined {
  const configuredDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN?.trim();

  if (configuredDomain) {
    return configuredDomain;
  }

  return undefined;
}

function getPlausibleScriptUrl(): string | undefined {
  const configuredBaseUrl = process.env.NEXT_PUBLIC_PLAUSIBLE_API_HOST?.trim();

  if (!configuredBaseUrl) {
    return undefined;
  }

  try {
    return new URL(plausibleScriptPath, configuredBaseUrl).toString();
  } catch {
    return undefined;
  }
}

export function AnalyticsScript() {
  const domain = getPlausibleDomain();

  if (!domain) {
    return null;
  }

  const scriptSrc = getPlausibleScriptUrl() ?? "https://plausible.io/js/script.js";

  return (
    <Script
      defer
      data-domain={domain}
      src={scriptSrc}
      data-api={
        process.env.NEXT_PUBLIC_PLAUSIBLE_API_HOST
          ? `${process.env.NEXT_PUBLIC_PLAUSIBLE_API_HOST.replace(/\/+$/, "")}/api/event`
          : undefined
      }
      strategy="afterInteractive"
      crossOrigin="anonymous"
    />
  );
}

export const analyticsConfig = {
  provider: "plausible",
  domainEnvVar: "NEXT_PUBLIC_PLAUSIBLE_DOMAIN",
  apiHostEnvVar: "NEXT_PUBLIC_PLAUSIBLE_API_HOST",
  defaultDomain: new URL(siteConfig.url).hostname,
} as const;

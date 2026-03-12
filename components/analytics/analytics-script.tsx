import Script from "next/script";

const PLAUSIBLE_SCRIPT_URL = "https://plausible.io/js/pa-vnxFw2Tj0I6sEZcvrats_.js";

const plausibleInitSnippet = `
  window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};
  plausible.init()
`;

export function AnalyticsScript() {
  return (
    <>
      <Script
        async
        src={PLAUSIBLE_SCRIPT_URL}
        strategy="afterInteractive"
      />
      <Script
        id="plausible-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: plausibleInitSnippet }}
      />
    </>
  );
}

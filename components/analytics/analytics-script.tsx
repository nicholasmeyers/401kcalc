const PLAUSIBLE_SCRIPT_URL = "https://plausible.io/js/pa-vnxFw2Tj0I6sEZcvrats_.js";

const plausibleInitSnippet =
  "window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init()";

export function AnalyticsScript() {
  return (
    <>
      <script async src={PLAUSIBLE_SCRIPT_URL} />
      <script dangerouslySetInnerHTML={{ __html: plausibleInitSnippet }} />
    </>
  );
}

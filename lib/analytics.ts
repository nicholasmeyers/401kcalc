export const analyticsEventNames = [
  "calculator_view",
  "calculator_input_change",
  "projection_updated",
  "retirement_marker_dragged",
  "target_spending_changed",
  "guide_view",
  "retirement_by_age_view",
  "methodology_view",
] as const;

export type AnalyticsEventName = (typeof analyticsEventNames)[number];
type AnalyticsPropValue = string | number | boolean;
export type AnalyticsProperties = Record<string, AnalyticsPropValue | null | undefined>;

declare global {
  interface Window {
    plausible?: (eventName: string, options?: { props?: Record<string, AnalyticsPropValue> }) => void;
  }
}

const sanitizeProperties = (properties?: AnalyticsProperties): Record<string, AnalyticsPropValue> | undefined => {
  if (!properties) {
    return undefined;
  }

  const entries = Object.entries(properties).filter(
    (entry): entry is [string, AnalyticsPropValue] =>
      typeof entry[1] === "string" || typeof entry[1] === "number" || typeof entry[1] === "boolean"
  );

  if (entries.length === 0) {
    return undefined;
  }

  return Object.fromEntries(entries);
};

export const trackEvent = (eventName: AnalyticsEventName, properties?: AnalyticsProperties): void => {
  if (typeof window === "undefined" || typeof window.plausible !== "function") {
    return;
  }

  const props = sanitizeProperties(properties);

  if (props) {
    window.plausible(eventName, { props });
    return;
  }

  window.plausible(eventName);
};

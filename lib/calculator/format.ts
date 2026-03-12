const DEFAULT_LOCALE = "en-US";
const DEFAULT_CURRENCY = "USD";

export const formatCurrency = (value: number, locale = DEFAULT_LOCALE, currency = DEFAULT_CURRENCY): string =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);

export const formatPercent = (percent: number, locale = DEFAULT_LOCALE, maximumFractionDigits = 1): string =>
  new Intl.NumberFormat(locale, {
    style: "percent",
    minimumFractionDigits: 0,
    maximumFractionDigits,
  }).format(percent / 100);

export const roundToCents = (value: number): number => Math.round(value * 100) / 100;

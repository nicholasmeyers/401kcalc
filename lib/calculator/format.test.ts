import { describe, expect, it } from "vitest";

import { formatCurrency, formatPercent, roundToCents } from "@/lib/calculator/format";

describe("format helpers", () => {
  it("formats USD currency with whole-dollar rounding", () => {
    expect(formatCurrency(1234.56)).toBe("$1,235");
  });

  it("formats percentages with one decimal by default", () => {
    expect(formatPercent(12.34)).toBe("12.3%");
  });

  it("rounds values to cents", () => {
    expect(roundToCents(10.235)).toBe(10.24);
    expect(roundToCents(10.234)).toBe(10.23);
  });
});

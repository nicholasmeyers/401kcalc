import { describe, expect, it } from "vitest";

import {
  formatMoneyInput,
  formatMoneyInputWithCursor,
  isAllowedMoneyInputCharacter,
  parseLooseNumber,
  sanitizeMoneyInput,
} from "@/lib/calculator/input";

describe("money input helpers", () => {
  it("formats plain digits with comma separators", () => {
    expect(formatMoneyInput("225000")).toBe("225,000");
    expect(formatMoneyInput("200000.5")).toBe("200,000.5");
    expect(formatMoneyInput("000200000.5")).toBe("200,000.5");
  });

  it("removes unsupported characters, keeps a single decimal point, and limits to cents precision", () => {
    expect(sanitizeMoneyInput("abc$12,3.4.5xyz")).toBe("123.45");
    expect(formatMoneyInput("abc$12,3.4.5xyz")).toBe("123.45");
    expect(sanitizeMoneyInput("$123.4567")).toBe("123.45");
    expect(formatMoneyInput(".7")).toBe("0.7");
  });

  it("keeps cursor stable around inserted commas", () => {
    const result = formatMoneyInputWithCursor("1234", 4);

    expect(result.nextValue).toBe("1,234");
    expect(result.nextCursor).toBe(5);
  });

  it("keeps decimal typing smooth with cursor mapping", () => {
    const result = formatMoneyInputWithCursor("200000.5", 8);

    expect(result.nextValue).toBe("200,000.5");
    expect(result.nextCursor).toBe(9);
  });

  it("keeps cursor at the end when typing a leading decimal", () => {
    const result = formatMoneyInputWithCursor(".", 1);

    expect(result.nextValue).toBe("0.");
    expect(result.nextCursor).toBe(2);
  });

  it("accepts only digits, commas, and decimal characters for money entry", () => {
    expect(isAllowedMoneyInputCharacter("7")).toBe(true);
    expect(isAllowedMoneyInputCharacter(",")).toBe(true);
    expect(isAllowedMoneyInputCharacter(".")).toBe(true);
    expect(isAllowedMoneyInputCharacter("$")).toBe(false);
    expect(isAllowedMoneyInputCharacter("a")).toBe(false);
  });

  it("parses loosely formatted numeric strings", () => {
    expect(parseLooseNumber(" 200,000.5 ")).toBe(200000.5);
    expect(parseLooseNumber("12.3%")).toBe(12.3);
    expect(parseLooseNumber(".")).toBe(0);
    expect(parseLooseNumber("")).toBe(0);
    expect(parseLooseNumber("  ")).toBe(0);
  });
});

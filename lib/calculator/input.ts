const MONEY_DECIMAL_SEPARATOR = ".";
const MAX_MONEY_FRACTION_DIGITS = 2;

const isDigit = (value: string): boolean => value >= "0" && value <= "9";

const isCanonicalMoneyCharacter = (value: string): boolean => isDigit(value) || value === MONEY_DECIMAL_SEPARATOR;

const addThousandsSeparators = (integerPart: string): string =>
  integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export const isAllowedMoneyInputCharacter = (value: string): boolean =>
  value.length === 1 && (isDigit(value) || value === "," || value === MONEY_DECIMAL_SEPARATOR);

export const sanitizeMoneyInput = (rawValue: string): string => {
  let nextValue = "";
  let hasDecimalSeparator = false;
  let fractionalDigits = 0;

  for (const character of rawValue) {
    if (isDigit(character)) {
      if (hasDecimalSeparator && fractionalDigits >= MAX_MONEY_FRACTION_DIGITS) {
        continue;
      }

      nextValue += character;
      if (hasDecimalSeparator) {
        fractionalDigits += 1;
      }
      continue;
    }

    if (character === MONEY_DECIMAL_SEPARATOR && !hasDecimalSeparator) {
      nextValue += character;
      hasDecimalSeparator = true;
      fractionalDigits = 0;
    }
  }

  return nextValue;
};

export const formatMoneyInput = (rawValue: string): string => {
  const sanitized = sanitizeMoneyInput(rawValue);

  if (sanitized === "") {
    return "";
  }

  const hasDecimalSeparator = sanitized.includes(MONEY_DECIMAL_SEPARATOR);
  const [integerPart, fractionalPart = ""] = sanitized.split(MONEY_DECIMAL_SEPARATOR);
  const normalizedIntegerPart =
    integerPart === "" ? (hasDecimalSeparator ? "0" : "") : integerPart.replace(/^0+(?=\d)/, "");
  const groupedIntegerPart = normalizedIntegerPart === "" ? "" : addThousandsSeparators(normalizedIntegerPart);

  if (!hasDecimalSeparator) {
    return groupedIntegerPart;
  }

  return `${groupedIntegerPart}${MONEY_DECIMAL_SEPARATOR}${fractionalPart}`;
};

const countCanonicalCharactersBeforeCursor = (rawValue: string, cursor: number): number => {
  const clampedCursor = Math.max(0, Math.min(cursor, rawValue.length));
  const sanitizedBeforeCursor = sanitizeMoneyInput(rawValue.slice(0, clampedCursor));

  if (sanitizedBeforeCursor.startsWith(MONEY_DECIMAL_SEPARATOR)) {
    return sanitizedBeforeCursor.length + 1;
  }

  return sanitizedBeforeCursor.length;
};

const mapCanonicalCharacterCountToCursor = (formattedValue: string, canonicalCharacterCount: number): number => {
  if (canonicalCharacterCount <= 0) {
    return 0;
  }

  let seenCanonicalCharacters = 0;

  for (let index = 0; index < formattedValue.length; index += 1) {
    if (!isCanonicalMoneyCharacter(formattedValue[index])) {
      continue;
    }

    seenCanonicalCharacters += 1;

    if (seenCanonicalCharacters >= canonicalCharacterCount) {
      return index + 1;
    }
  }

  return formattedValue.length;
};

export const formatMoneyInputWithCursor = (
  rawValue: string,
  cursor: number
): { nextValue: string; nextCursor: number } => {
  const canonicalCharactersBeforeCursor = countCanonicalCharactersBeforeCursor(rawValue, cursor);
  const nextValue = formatMoneyInput(rawValue);
  const nextCursor = mapCanonicalCharacterCountToCursor(nextValue, canonicalCharactersBeforeCursor);

  return { nextValue, nextCursor };
};

export const parseLooseNumber = (rawValue: string): number | null => {
  const trimmedValue = rawValue.trim();

  if (trimmedValue === "" || trimmedValue === "-" || trimmedValue === "." || trimmedValue === "-.") {
    return null;
  }

  const normalizedValue = trimmedValue.replace(/[\s,$%]/g, "");
  const parsed = Number(normalizedValue);

  return Number.isFinite(parsed) ? parsed : null;
};

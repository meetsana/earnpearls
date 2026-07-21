const INTEGER_STRING_RE = /^-?\d+$/;

export function toBigInt(value: string): bigint {
  if (!INTEGER_STRING_RE.test(value)) {
    throw new Error(`Not an exact integer string: ${JSON.stringify(value)}`);
  }
  return BigInt(value);
}

export function isIntegerString(value: unknown): value is string {
  return typeof value === "string" && INTEGER_STRING_RE.test(value);
}

export function isPositiveIntegerString(value: unknown): value is string {
  return typeof value === "string" && /^[1-9]\d*$/.test(value);
}

export function addIntegerStrings(...values: string[]): string {
  return values
    .reduce((total, value) => total + toBigInt(value), 0n)
    .toString();
}

export function compareIntegerStrings(a: string, b: string): -1 | 0 | 1 {
  const left = toBigInt(a);
  const right = toBigInt(b);
  return left < right ? -1 : left > right ? 1 : 0;
}

export function formatIntegerString(value: string, separator = ","): string {
  const parsed = toBigInt(value);
  const negative = parsed < 0n;
  const digits = (negative ? -parsed : parsed).toString();
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  return negative ? `-${grouped}` : grouped;
}

export function pointsToUsdParts(
  points: string,
  pointsPerUsd: string,
): { usdWhole: string; remainderPoints: string } {
  const pointValue = toBigInt(points);
  const ratio = toBigInt(pointsPerUsd);
  if (ratio <= 0n) throw new Error("pointsPerUsd must be positive");
  return {
    usdWhole: (pointValue / ratio).toString(),
    remainderPoints: (pointValue % ratio).toString(),
  };
}

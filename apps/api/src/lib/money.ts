import type { Money } from "@earnpearls/contracts";

export function formatUsdMicros(value: bigint): string {
  const negative = value < 0n;
  const absolute = negative ? -value : value;
  const units = absolute / 1_000_000n;
  const micros = (absolute % 1_000_000n).toString().padStart(6, "0");
  return `${negative ? "-" : ""}${units}.${micros}`;
}

export function toMoney(points: bigint, usdMicros: bigint): Money {
  return {
    points: points.toString(),
    usdMicros: usdMicros.toString(),
    usd: formatUsdMicros(usdMicros),
  };
}

export function pointsToUsdMicros(
  points: bigint,
  pointsPerUsd: bigint,
): bigint {
  if (pointsPerUsd <= 0n) throw new Error("pointsPerUsd must be positive");
  return (points * 1_000_000n) / pointsPerUsd;
}

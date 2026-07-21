import type { Money } from "../api/types";
import { formatIntegerString } from "../lib/money";

export function MoneyValue({
  value,
  compact = false,
}: {
  value: Money;
  compact?: boolean;
}) {
  return (
    <span className="money-value">
      <strong>${value.usd}</strong>
      {!compact ? (
        <small>{formatIntegerString(value.points)} points</small>
      ) : null}
    </span>
  );
}

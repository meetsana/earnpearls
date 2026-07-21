import type { Money } from "../api/types";
import {
  addIntegerStrings,
  compareIntegerStrings,
  formatIntegerString,
  isIntegerString,
  pointsToUsdParts,
} from "../lib/money";

export function displayUsd(value: Money): string {
  return `$${value.usd}`;
}

export function useMoney() {
  return {
    displayUsd,
    formatPoints: formatIntegerString,
    addPoints: addIntegerStrings,
    comparePoints: compareIntegerStrings,
    pointsToUsdParts,
    isIntegerString,
  };
}

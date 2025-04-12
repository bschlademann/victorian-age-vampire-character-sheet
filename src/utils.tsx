// src/utils.tsx
// Generic functions that can be reused in other codebases.

import { costMapping } from "./domain";

/**
 * Calculates the total cost to increase a trait from currentLevel to newLevel.
 * This function is somewhat domain-specific because it depends on costMapping,
 * but you could adapt it if you want it to be more generic.
 */
export function calculateCost(
  categoryKey: string,
  currentLevel: number,
  newLevel: number
): number {
  let cost = 0;
  for (let lvl = currentLevel + 1; lvl <= newLevel; lvl++) {
    cost += costMapping[categoryKey][lvl];
  }
  return cost;
}

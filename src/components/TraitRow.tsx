// src/components/TraitRow.tsx

import React from "react";
import { TraitRowProps } from "../types";
import { maxLevels, costMapping, disciplineHighlights } from "../domain";

export const TraitRow: React.FC<TraitRowProps> = ({
  trait,
  currentLevel,
  costCategory,
  onChange,
  max,
  onDotHover,
  onDotHoverLeave,
  isHighlighted,
}) => {
  const computedMax = max || (costCategory ? maxLevels[costCategory] : 5);

  const isDiscipline = Object.prototype.hasOwnProperty.call(
    disciplineHighlights,
    trait
  );

  // Renders the clickable dots
  const dots = [];
  for (let i = 1; i <= computedMax; i++) {
    const filled = i <= currentLevel;
    dots.push(
      <span
        key={i}
        onClick={() => {
          // Decrease to 0 if we click the same dot again and it's at 1
          if (currentLevel === 1 && i === 1 && filled) {
            onChange(trait, 0, costCategory, computedMax);
          } else {
            onChange(trait, i, costCategory, computedMax);
          }
        }}
        onMouseEnter={
          isDiscipline && onDotHover ? () => onDotHover(trait, i) : undefined
        }
        onMouseLeave={
          isDiscipline && onDotHoverLeave ? onDotHoverLeave : undefined
        }
        className="dot"
        style={{
          backgroundColor: filled ? "#000" : "#fff",
          color: filled ? "#fff" : "#000",
        }}
      />
    );
  }

  // Next cost displayed in parentheses
  const nextCost =
    costCategory && currentLevel < computedMax
      ? costMapping[costCategory][currentLevel + 1]
      : null;

  return (
    <div className={`trait-row${isHighlighted ? " highlight" : ""}`}>
      <span className="trait-name">{trait}</span>
      {dots}
      {nextCost !== null && <span className="dot-cost"> ({nextCost})</span>}
    </div>
  );
};

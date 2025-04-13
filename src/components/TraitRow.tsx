// src/components/TraitRow.tsx

import React from "react";
import { TraitRowProps } from "../types";
import { maxLevels, costMapping, disciplineHighlights, prefill } from "../domain";
// import "../styles/TraitRow.css"; // Import your component-specific styles

export const TraitRow: React.FC<TraitRowProps> = ({
  trait,
  currentLevel,
  costCategory,
  onChange,
  isHighlighted,
  onDotHover,
  onDotHoverLeave,
}) => {
  const computedMax = costCategory ? maxLevels[costCategory] : 5;
  const prefilledLevel = prefill[trait] || 0;

  const isDiscipline = Object.prototype.hasOwnProperty.call(
    disciplineHighlights,
    trait
  );

  const dots = [];
  for (let i = 1; i <= computedMax; i++) {
    const isPrefilled = i <= prefilledLevel;
    const isFilled = i <= currentLevel;
    const isFirstNonPrefilled = i === prefilledLevel + 1;
    dots.push(
      <span
        key={i}
        className={`dot ${isPrefilled ? "prefilled" : ""}`}
        onClick={() => {
          if (isPrefilled) return; // Don't allow changing prefilled dots
          if (isFirstNonPrefilled && isFilled) {
            // If this is the first non-prefilled dot and it's filled
            if (currentLevel > prefilledLevel + 1) {
              // If there are other dots selected, just deselect them
              onChange(trait, prefilledLevel + 1, costCategory);
            } else {
              // If this is the only selected dot, deselect it completely
              onChange(trait, prefilledLevel, costCategory);
            }
          } else {
            onChange(trait, i, costCategory);
          }
        }}
        onMouseEnter={
          isDiscipline && onDotHover ? () => onDotHover(trait, i) : undefined
        }
        onMouseLeave={
          isDiscipline && onDotHoverLeave ? onDotHoverLeave : undefined
        }
        style={{
          backgroundColor: isFilled ? (isPrefilled ? "#666666" : "#000") : "#fff",
          color: isFilled ? "#fff" : "#000",
          cursor: isPrefilled ? "not-allowed" : "pointer",
        }}
      />
    );
  }

  const nextCost =
    costCategory && currentLevel < computedMax
      ? costMapping[costCategory][currentLevel + 1]
      : null;

  return (
    <div className={`trait-row${isHighlighted ? " highlight" : ""}`}>
      <span className="trait-name">{trait}</span>
      <span className="dots-container">{dots}</span>
      <span className="cost-container">
        {nextCost !== null && <span className="dot-cost"> ({nextCost})</span>}
      </span>
    </div>
  );
};

// src/components/TraitRow.tsx

import React from "react";
import { TraitRowProps } from "../types";
import { maxLevels, costMapping, disciplineHighlights } from "../domain";
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

  const isDiscipline = Object.prototype.hasOwnProperty.call(
    disciplineHighlights,
    trait
  );

  const dots = [];
  for (let i = 1; i <= computedMax; i++) {
    const filled = i <= currentLevel;
    dots.push(
      <span
        key={i}
        className="dot"
        onClick={() => {
          if (currentLevel === 1 && i === 1 && filled) {
            onChange(trait, 0, costCategory);
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
          backgroundColor: filled ? "#000" : "#fff",
          color: filled ? "#fff" : "#000",
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

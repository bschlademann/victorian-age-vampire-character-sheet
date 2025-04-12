// src/components/CustomTraitRow.tsx

import React from "react";
import { CustomTraitRowProps } from "../types";
import { maxLevels, costMapping, disciplineHighlights } from "../domain";
import "../styles/CustomTraitRow.css";

export const CustomTraitRow: React.FC<CustomTraitRowProps> = ({
  traitKey,
  currentLevel,
  costCategory,
  onChange,
  value,
  onNameChange,
  isHighlighted,
  onDotHover,
  onDotHoverLeave,
}) => {
  const computedMax = costCategory ? maxLevels[costCategory] : 5;
  const isDiscipline = Object.prototype.hasOwnProperty.call(
    disciplineHighlights,
    traitKey
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
            onChange(traitKey, 0, costCategory);
          } else {
            onChange(traitKey, i, costCategory);
          }
        }}
        onMouseEnter={
          isDiscipline && onDotHover ? () => onDotHover(traitKey, i) : undefined
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
      <input
        type="text"
        className="custom-input"
        placeholder="Custom name"
        value={value}
        onChange={(e) => onNameChange(traitKey + "_name", e.target.value)}
      />
      {dots}
      {nextCost !== null && <span className="dot-cost"> ({nextCost})</span>}
    </div>
  );
};

// src/components/DisciplineRow.tsx

import React from "react";
import { disciplineHighlights, costMapping, allDisciplines } from "../domain";
// import "../styles/DisciplineRow.css";

interface DisciplineRowProps {
  index: number;
  disciplineName: string;
  currentLevel: number;
  isClan: boolean;
  ep: number;
  handleChange: (
    trait: string,
    newLevel: number,
    costCategory: string | null
  ) => void;
  handleNameChange: (key: string, newValue: string) => void;
  handleClanToggle: (disciplineKey: string) => void;
  handleDotHover: (discipline: string, level: number) => void;
  handleDotHoverLeave: () => void;
}

export const DisciplineRow: React.FC<DisciplineRowProps> = ({
  index,
  disciplineName,
  currentLevel,
  isClan,
  handleChange,
  handleNameChange,
  handleClanToggle,
  handleDotHover,
  handleDotHoverLeave,
}) => {
  const costCategory = isClan ? "disziplinenClan" : "disziplinNonClan";
  const disciplineSelected = Boolean(disciplineName);

  const dots = [];
  for (let i = 1; i <= 5; i++) {
    const filled = i <= currentLevel;
    dots.push(
      <span
        key={i}
        className={`dot${disciplineSelected ? "" : " disabled-dot"}`}
        onClick={
          disciplineSelected
            ? () => {
                if (currentLevel === 1 && i === 1 && filled) {
                  handleChange(`Discipline_${index}`, 0, costCategory);
                } else {
                  handleChange(`Discipline_${index}`, i, costCategory);
                }
              }
            : undefined
        }
        onMouseEnter={
          disciplineSelected && disciplineHighlights[disciplineName]
            ? () => handleDotHover(disciplineName, i)
            : undefined
        }
        onMouseLeave={
          disciplineSelected && disciplineHighlights[disciplineName]
            ? handleDotHoverLeave
            : undefined
        }
        style={{
          backgroundColor: filled ? "#000" : "#fff",
          color: filled ? "#fff" : "#000",
          cursor: disciplineSelected ? "pointer" : "not-allowed",
        }}
      />
    );
  }

  const nextCost =
    disciplineSelected && currentLevel < 5
      ? costMapping[costCategory][currentLevel + 1]
      : null;

  return (
    <div className="trait-row">
      <select
        value={disciplineName}
        onChange={(e) =>
          handleNameChange(`Discipline_${index}_name`, e.target.value)
        }
        className="discipline-select"
      >
        <option value="">Select Discipline</option>
        {allDisciplines.map(discipline => (<option key={`discipline-${discipline}`}>{discipline}</option>))}
      </select>

      <label className="clan-checkbox">
        <input
          type="checkbox"
          checked={isClan}
          onChange={() => handleClanToggle(`Discipline_${index}`)}
        />
        {/* Could label as "Clan" if you want */}
      </label>

      {dots}
      {nextCost !== null && <span className="dot-cost"> ({nextCost})</span>}
    </div>
  );
};

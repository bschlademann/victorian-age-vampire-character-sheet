import React from "react";
import { costMapping, allDisciplines, prefill } from "../domain";

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
  handleNameChange?: (key: string, newValue: string) => void;
  handleClanToggle?: (disciplineKey: string) => void;
  handleDotHover: (discipline: string, level: number) => void;
  handleDotHoverLeave: () => void;
  isReadOnly?: boolean;
}

export const DisciplineRow: React.FC<DisciplineRowProps> = ({
  index,
  disciplineName,
  currentLevel,
  isClan,
  handleChange,
  handleNameChange,
  handleDotHover,
  handleDotHoverLeave,
  isReadOnly = false,
}) => {
  const costCategory = isClan ? "disziplinenClan" : "disziplinNonClan";
  const nextCost = currentLevel < 5 ? costMapping[costCategory][currentLevel + 1] : null;
  const prefilledLevel = prefill[disciplineName] || 0;

  return (
    <div className="disciplines-row">
      <div className="trait-row">
        {isReadOnly ? (
          <input
            type="text"
            value={disciplineName}
            readOnly
            placeholder="select a clan"
            className="discipline-select"
          />
        ) : (
          <select
            value={disciplineName}
            onChange={(e) => handleNameChange?.(`Discipline_${index}_name`, e.target.value)}
            className="discipline-select"
          >
            <option value="">-</option>
            {allDisciplines.map((discipline) => (
              <option key={discipline} value={discipline}>
                {discipline}
              </option>
            ))}
          </select>
        )}
        <div className="dots-container">
          {Array.from({ length: 5 }).map((_, dotIndex) => {
            const isPrefilled = dotIndex < prefilledLevel;
            const isFilled = dotIndex < currentLevel;
            const isFirstNonPrefilled = dotIndex === prefilledLevel;
            return (
              <span
                key={dotIndex}
                className={`dot ${isPrefilled ? "prefilled" : ""}`}
                style={{
                  backgroundColor: isFilled ? (isPrefilled ? "#808080" : "#000") : "#fff",
                  color: isFilled ? "#fff" : "#000",
                  cursor: isPrefilled ? "not-allowed" : "pointer",
                }}
                onClick={() => {
                  if (isPrefilled) return; // Don't allow changing prefilled dots
                  if (isFirstNonPrefilled && isFilled) {
                    // If this is the first non-prefilled dot and it's filled
                    if (currentLevel > prefilledLevel + 1) {
                      // If there are other dots selected, just deselect them
                      handleChange(`Discipline_${index}`, prefilledLevel + 1, costCategory);
                    } else {
                      // If this is the only selected dot, deselect it completely
                      handleChange(`Discipline_${index}`, prefilledLevel, costCategory);
                    }
                  } else {
                    handleChange(`Discipline_${index}`, dotIndex + 1, costCategory);
                  }
                }}
                onMouseEnter={() => handleDotHover(disciplineName, dotIndex + 1)}
                onMouseLeave={handleDotHoverLeave}
              />
            );
          })}
        </div>
        {nextCost !== null && <span className="dot-cost">({nextCost})</span>}
      </div>
    </div>
  );
};

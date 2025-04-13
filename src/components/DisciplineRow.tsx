import React from "react";
import { costMapping, allDisciplines } from "../domain";

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
          {Array.from({ length: 5 }).map((_, dotIndex) => (
            <span
              key={dotIndex}
              className="dot"
              style={{
                backgroundColor: dotIndex < currentLevel ? "#000" : "#fff",
                color: dotIndex < currentLevel ? "#fff" : "#000",
              }}
              onClick={() => {
                if (currentLevel === 1 && dotIndex === 0) {
                  handleChange(`Discipline_${index}`, 0, costCategory);
                } else {
                  handleChange(`Discipline_${index}`, dotIndex + 1, costCategory);
                }
              }}
              onMouseEnter={() => handleDotHover(disciplineName, dotIndex + 1)}
              onMouseLeave={handleDotHoverLeave}
            />
          ))}
        </div>
        {nextCost !== null && <span className="dot-cost">({nextCost})</span>}
      </div>
    </div>
  );
};

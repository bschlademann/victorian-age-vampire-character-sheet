// src/App.tsx

import React, { useState } from "react";
import "./App.css";
import {
  categories,
  fixedHintergruende,
  fixedTugenden,
  initialDisciplines,
  prefill,
  disciplineHighlights,
} from "./domain";
import { TraitRow } from "./components/TraitRow";
import { CustomTraitRow } from "./components/CustomTraitRow";
import { DisciplineRow } from "./components/DisciplineRow";
import { calculateCost } from "./utils";
import { costMapping } from "./domain";

const App: React.FC = () => {
  // Prepare initial traits state
  const initialTraits: { [key: string]: number | string | boolean } = {};

  // Prefill attributes with 1 or from `prefill`
  Object.values(categories.attribute).forEach((group) => {
    group.forEach((trait) => {
      initialTraits[trait] = Object.prototype.hasOwnProperty.call(prefill, trait)
        ? prefill[trait]
        : 1;
    });
  });

  // Prefill Fähigkeiten with 0 or from `prefill`
  Object.entries(categories.fähigkeiten).forEach(([, traitList]) => {
    traitList.forEach((trait) => {
      initialTraits[trait] = Object.prototype.hasOwnProperty.call(prefill, trait)
        ? prefill[trait]
        : 0;
    });
  });

  // Fixed Vorteile
  [...fixedHintergruende, ...fixedTugenden].forEach((item) => {
    initialTraits[item.name] = item.prefill;
  });

  // Initialize 6 disciplines
  initialDisciplines.forEach((item, index) => {
    initialTraits[`Discipline_${index}`] = item.prefill;
    initialTraits[`Discipline_${index}_name`] = item.name;
    initialTraits[`Discipline_${index}_isClan`] = item.isClan;
  });

  // Custom Hintergründe
  for (let i = 1; i <= 5; i++) {
    initialTraits[`Hintergrund_custom_${i}`] = 0;
    initialTraits[`Hintergrund_custom_${i}_name`] = "";
  }

  const [traits, setTraits] = useState<{ [key: string]: number | string | boolean }>(
    initialTraits
  );
  const [ep, setEP] = useState<number>(350);
  const [highlightedTraits, setHighlightedTraits] = useState<string[]>([]);

  function handleChange(
    trait: string,
    newLevel: number,
    costCategory: string | null,
    max: number = 5
  ) {
    if (!costCategory) {
      // For backgrounds with no costCategory
      setTraits({ ...traits, [trait]: newLevel });
      return;
    }

    // For disciplines, check if clan
    if (trait.startsWith("Discipline_")) {
      const index = trait.split("_")[1];
      const isClan = traits[`Discipline_${index}_isClan`] as boolean;
      costCategory = isClan ? "disziplinenClan" : "disziplinNonClan";
    }

    const currentLevel = (traits[trait] as number) || 0;
    if (newLevel === currentLevel) return;

    if (newLevel > currentLevel) {
      const cost = calculateCost(costCategory, currentLevel, newLevel);
      if (cost > ep) {
        alert("Not enough EP");
        return;
      }
      setEP(ep - cost);
    } else {
      // Refund logic
      let refund = 0;
      for (let lvl = newLevel + 1; lvl <= currentLevel; lvl++) {
        refund += costMapping[costCategory][lvl];
      }
      setEP(ep + refund);
    }
    setTraits({ ...traits, [trait]: newLevel });
  }

  function handleNameChange(key: string, newValue: string) {
    setTraits({ ...traits, [key]: newValue });
  }

  function handleClanToggle(disciplineKey: string) {
    const index = disciplineKey.split("_")[1];
    const currentIsClan = traits[`Discipline_${index}_isClan`] as boolean;
    setTraits({
      ...traits,
      [`Discipline_${index}_isClan`]: !currentIsClan,
    });
  }

  const handleDotHover = (discipline: string, level: number) => {
    const highlights = disciplineHighlights[discipline]?.[level] || [];
    setHighlightedTraits(highlights);
  };

  const handleDotHoverLeave = () => {
    setHighlightedTraits([]);
  };

  return (
    <div className="sheet-container">
      <header>
        <h1>Vampire: The Masquerade Character Sheet</h1>
        <div className="ep-display">EP: {ep}</div>
      </header>

      {/* Row 1: Attributes */}
      <div className="section-row">
        <h2>Attributes</h2>
        <div className="row-container">
          <div className="column">
            <h3>Körperlich</h3>
            <div className="attribute column-content">
              {categories.attribute.körperlich.map((trait) => (
                <TraitRow
                  key={trait}
                  trait={trait}
                  currentLevel={traits[trait] as number}
                  costCategory="attribute"
                  max={5}
                  onChange={handleChange}
                  isHighlighted={highlightedTraits.includes(trait)}
                />
              ))}
            </div>
          </div>
          <div className="column">
            <h3>Sozial</h3>
            <div className="attribute column-content">
              {categories.attribute.sozial.map((trait) => (
                <TraitRow
                  key={trait}
                  trait={trait}
                  currentLevel={traits[trait] as number}
                  costCategory="attribute"
                  max={5}
                  onChange={handleChange}
                  isHighlighted={highlightedTraits.includes(trait)}
                />
              ))}
            </div>
          </div>
          <div className="column">
            <h3>Geistig</h3>
            <div className="attribute column-content">
              {categories.attribute.geistig.map((trait) => (
                <TraitRow
                  key={trait}
                  trait={trait}
                  currentLevel={traits[trait] as number}
                  costCategory="attribute"
                  max={5}
                  onChange={handleChange}
                  isHighlighted={highlightedTraits.includes(trait)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Fähigkeiten */}
      <div className="section-row">
        <h2>Fähigkeiten</h2>
        <div className="row-container">
          <div className="column">
            <h3>Talente</h3>
            <div className="column-content">
              {categories.fähigkeiten.talente.map((trait) => (
                <TraitRow
                  key={trait}
                  trait={trait}
                  currentLevel={traits[trait] as number}
                  costCategory="talente"
                  max={5}
                  onChange={handleChange}
                  isHighlighted={highlightedTraits.includes(trait)}
                />
              ))}
            </div>
          </div>
          <div className="column">
            <h3>Fertigkeiten</h3>
            <div className="column-content">
              {categories.fähigkeiten.fähigkeiten.map((trait) => (
                <TraitRow
                  key={trait}
                  trait={trait}
                  currentLevel={traits[trait] as number}
                  costCategory="fertigkeiten"
                  max={5}
                  onChange={handleChange}
                  isHighlighted={highlightedTraits.includes(trait)}
                />
              ))}
            </div>
          </div>
          <div className="column">
            <h3>Kenntnisse</h3>
            <div className="column-content">
              {categories.fähigkeiten.kenntnisse.map((trait) => (
                <TraitRow
                  key={trait}
                  trait={trait}
                  currentLevel={traits[trait] as number}
                  costCategory="kenntnisse"
                  max={5}
                  onChange={handleChange}
                  isHighlighted={highlightedTraits.includes(trait)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Vorteile */}
      <div className="section-row">
        <h2>Vorteile</h2>
        <div className="row-container">
          {/* Hintergründe Column */}
          <div className="column">
            <h3>Hintergründe</h3>
            <div className="column-content">
              {fixedHintergruende.map((item) => (
                <TraitRow
                  key={item.name}
                  trait={item.name}
                  currentLevel={traits[item.name] as number}
                  costCategory={item.costCategory}
                  max={item.max}
                  onChange={handleChange}
                  isHighlighted={highlightedTraits.includes(item.name)}
                />
              ))}
              <h4>Custom Hintergründe</h4>
              {Array.from({ length: 5 }, (_, i) => {
                const key = `Hintergrund_custom_${i + 1}`;
                return (
                  <CustomTraitRow
                    key={key}
                    traitKey={key}
                    currentLevel={traits[key] as number}
                    costCategory={null}
                    max={5}
                    value={traits[key + "_name"] as string}
                    onChange={handleChange}
                    onNameChange={handleNameChange}
                    isHighlighted={highlightedTraits.includes(key)}
                  />
                );
              })}
            </div>
          </div>

          {/* Disziplinen Column */}
          <div className="column">
            <h3>Disziplinen</h3>
            {/* 3 rows, 2 columns => 6 total disciplines */}
            <div className="disciplines-grid">
              {Array.from({ length: 3 }).map((_, rowIndex) => (
                <div className="disciplines-row" key={rowIndex}>
                  {Array.from({ length: 2 }).map((_, colIndex) => {
                    const i = rowIndex * 2 + colIndex;
                    return (
                      <DisciplineRow
                        key={`Discipline_${i}`}
                        index={i}
                        disciplineName={traits[`Discipline_${i}_name`] as string}
                        currentLevel={traits[`Discipline_${i}`] as number}
                        isClan={traits[`Discipline_${i}_isClan`] as boolean}
                        ep={ep}
                        handleChange={handleChange}
                        handleNameChange={handleNameChange}
                        handleClanToggle={handleClanToggle}
                        handleDotHover={handleDotHover}
                        handleDotHoverLeave={handleDotHoverLeave}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Tugenden Column */}
          <div className="column">
            <h3>Tugenden</h3>
            <div className="attribute column-content">
              {fixedTugenden.map((item) => (
                <TraitRow
                  key={item.name}
                  trait={item.name}
                  currentLevel={traits[item.name] as number}
                  costCategory={item.costCategory}
                  max={item.max}
                  onChange={handleChange}
                  isHighlighted={highlightedTraits.includes(item.name)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

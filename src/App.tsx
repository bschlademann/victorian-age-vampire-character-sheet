import React, { useState } from "react";
import "./styles/App.css";

import {
  categories,
  fixedHintergruende,
  fixedTugenden,
  initialDisciplines,
  prefill,
  disciplineHighlights,
  costMapping,
} from "./domain";

import { TraitRow } from "./components/TraitRow";
import { CustomTraitRow } from "./components/CustomTraitRow";
import { DisciplineRow } from "./components/DisciplineRow";
import { calculateCost } from "./utils";

const App: React.FC = () => {
  const initialTraits: { [key: string]: number | string | boolean } = {};

  // 1) Initialize Attributes
  Object.values(categories.attribute).forEach((group) => {
    group.forEach((trait) => {
      initialTraits[trait] = prefill[trait] ?? 1;
    });
  });

  // 2) Initialize Fähigkeiten
  Object.entries(categories.fähigkeiten).forEach(([, traitList]) => {
    traitList.forEach((trait) => {
      initialTraits[trait] = prefill[trait] ?? 0;
    });
  });

  // 3) Hintergründe/Tugenden
  [...fixedHintergruende, ...fixedTugenden].forEach((item) => {
    initialTraits[item.name] = item.prefill;
  });

  // 4) Disciplines
  initialDisciplines.forEach((item, index) => {
    initialTraits[`Discipline_${index}`] = item.prefill;
    initialTraits[`Discipline_${index}_name`] = item.name;
    // Ensure we never store undefined in the state
    initialTraits[`Discipline_${index}_isClan`] = item.isClan ?? false;
  });

  // 5) Custom Hintergründe
  for (let i = 1; i <= 5; i++) {
    initialTraits[`Hintergrund_custom_${i}`] = 0;
    initialTraits[`Hintergrund_custom_${i}_name`] = "";
  }

  const [traits, setTraits] = useState<{
    [key: string]: number | string | boolean;
  }>(initialTraits);
  const [ep, setEP] = useState<number>(350);
  const [highlightedTraits, setHighlightedTraits] = useState<string[]>([]);

  function handleChange(
    trait: string,
    newLevel: number,
    costCategory: string | null
  ) {
    if (!costCategory) {
      setTraits({ ...traits, [trait]: newLevel });
      return;
    }

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
      // refund logic
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
    setTraits({ ...traits, [`Discipline_${index}_isClan`]: !currentIsClan });
  }

  function handleDotHover(discipline: string, level: number) {
    const highlights = disciplineHighlights[discipline]?.[level] || [];
    setHighlightedTraits(highlights);
  }

  function handleDotHoverLeave() {
    setHighlightedTraits([]);
  }

  return (
    <div className="sheet-container">
      <header>
        <h1>Vampire: The Masquerade Character Sheet</h1>
        <div className="ep-display">EP: {ep}</div>
      </header>
      <div className="section-row-container">
        {/* === ROW 1: Attributes (3 columns) === */}
        <section className="section-row">
          <h2>Attributes</h2>
          <div className="row-container">
            {/* Körperlich */}
            <div className="column">
              <h3>Körperlich</h3>
              {categories.attribute.körperlich.map((trait) => (
                <TraitRow
                  key={trait}
                  trait={trait}
                  currentLevel={traits[trait] as number}
                  costCategory="attribute"
                  onChange={handleChange}
                  isHighlighted={highlightedTraits.includes(trait)}
                />
              ))}
            </div>

            {/* Sozial */}
            <div className="column">
              <h3>Sozial</h3>
              {categories.attribute.sozial.map((trait) => (
                <TraitRow
                  key={trait}
                  trait={trait}
                  currentLevel={traits[trait] as number}
                  costCategory="attribute"
                  onChange={handleChange}
                  isHighlighted={highlightedTraits.includes(trait)}
                />
              ))}
            </div>

            {/* Geistig */}
            <div className="column">
              <h3>Geistig</h3>
              {categories.attribute.geistig.map((trait) => (
                <TraitRow
                  key={trait}
                  trait={trait}
                  currentLevel={traits[trait] as number}
                  costCategory="attribute"
                  onChange={handleChange}
                  isHighlighted={highlightedTraits.includes(trait)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* === ROW 2: Fähigkeiten (3 columns: Talente, Fertigkeiten, Kenntnisse) === */}
        <section className="section-row">
          <h2>Fähigkeiten</h2>
          <div className="row-container">
            {/* Talente */}
            <div className="column">
                <h3>Talente</h3>
              <div className="faehigkeiten-container">
                {categories.fähigkeiten.talente.map((trait) => (
                  <TraitRow
                    key={trait}
                    trait={trait}
                    currentLevel={traits[trait] as number}
                    costCategory="talente"
                    onChange={handleChange}
                    isHighlighted={highlightedTraits.includes(trait)}
                  />
                ))}
              </div>
            </div>

            {/* Fertigkeiten */}
            <div className="column">
              <h3>Fertigkeiten</h3>
              <div className="faehigkeiten-container">
              {categories.fähigkeiten.fähigkeiten.map((trait) => (
                <TraitRow
                  key={trait}
                  trait={trait}
                  currentLevel={traits[trait] as number}
                  costCategory="fertigkeiten"
                  onChange={handleChange}
                  isHighlighted={highlightedTraits.includes(trait)}
                />
              ))}
            </div>
            </div>

            {/* Kenntnisse */}
            <div className="column">
              <h3>Kenntnisse</h3>
              <div className="faehigkeiten-container">
              {categories.fähigkeiten.kenntnisse.map((trait) => (
                <TraitRow
                  key={trait}
                  trait={trait}
                  currentLevel={traits[trait] as number}
                  costCategory="kenntnisse"
                  onChange={handleChange}
                  isHighlighted={highlightedTraits.includes(trait)}
                />
              ))}
            </div>
            </div>
          </div>
        </section>

        {/* === ROW 3: Vorteile (3 columns: Hintergründe, Disziplinen, Tugenden) === */}
        <section className="section-row">
          <h2>Vorteile</h2>
          <div className="row-container">
            {/* Hintergründe */}
            <div className="column">
              <h3>Hintergründe</h3>
              {fixedHintergruende.map((item) => (
                <TraitRow
                  key={item.name}
                  trait={item.name}
                  currentLevel={traits[item.name] as number}
                  costCategory={item.costCategory}
                  onChange={handleChange}
                  isHighlighted={highlightedTraits.includes(item.name)}
                />
              ))}
              {Array.from({ length: 2 }, (_, i) => {
                const key = `Hintergrund_custom_${i + 1}`;
                return (
                  <CustomTraitRow
                    key={key}
                    traitKey={key}
                    currentLevel={traits[key] as number}
                    costCategory={null}
                    value={traits[key + "_name"] as string}
                    onChange={handleChange}
                    onNameChange={handleNameChange}
                    isHighlighted={highlightedTraits.includes(key)}
                  />
                );
              })}
            </div>

            {/* Disziplinen */}
            <div className="column">
              <h3>Disziplinen</h3>
              <div className="disciplines-container">
                {Array.from({ length: 3 }).map((_, rowIndex) => (
                  <div className="disciplines-row" key={rowIndex}>
                    {Array.from({ length: 2 }).map((_, colIndex) => {
                      const i = rowIndex * 2 + colIndex;
                      return (
                        <DisciplineRow
                          key={`Discipline_${i}`}
                          index={i}
                          disciplineName={
                            traits[`Discipline_${i}_name`] as string
                          }
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

            {/* Tugenden */}
            <div className="column">
              <h3>Tugenden</h3>
              {fixedTugenden.map((item) => (
                <TraitRow
                  key={item.name}
                  trait={item.name}
                  currentLevel={traits[item.name] as number}
                  costCategory={item.costCategory}
                  onChange={handleChange}
                  isHighlighted={highlightedTraits.includes(item.name)}
                />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default App;

import React, { useState, useRef } from "react";
import "./styles/App.css";

import {
  categories,
  fixedHintergruende,
  fixedTugenden,
  initialDisciplines,
  prefill,
  disciplineHighlights,
  costMapping,
  clanDisciplines,
} from "./domain";

import { TraitRow } from "./components/TraitRow";
import { CustomTraitRow } from "./components/CustomTraitRow";
import { DisciplineRow } from "./components/DisciplineRow";
import { calculateCost } from "./utils";
import { ClanSelector } from "./components/ClanSelector";

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
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  function handleClanSelect(clan: string) {
    const clanDisciplineList = clanDisciplines[clan];
    if (!clanDisciplineList) return;

    const newTraits = { ...traits };
    
    // Update first three disciplines with clan disciplines
    for (let i = 0; i < 3; i++) {
      newTraits[`Discipline_${i}_name`] = clanDisciplineList[i];
      newTraits[`Discipline_${i}_isClan`] = true;
    }
    
    setTraits(newTraits);
  }

  const handleSave = () => {
    const characterData = {
      traits,
      ep,
      highlightedTraits,
    };
    const jsonString = JSON.stringify(characterData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'character-sheet.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleLoad = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          setTraits(data.traits);
          setEP(data.ep || 0);
          setHighlightedTraits(data.highlightedTraits || []);
        } catch (error) {
          console.error('Error loading character sheet:', error);
          alert('Error loading character sheet. Please make sure the file is valid.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="sheet-container">
      <header>
        <h1>Vampire: The Masquerade Character Sheet</h1>
        <div className="header-controls">
          <div className="ep-display">EP: {ep}</div>
          <div className="save-load-buttons">
            <button onClick={handleSave}>Save Character</button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleLoad}
              accept=".json"
              style={{ display: 'none' }}
            />
            <button onClick={() => fileInputRef.current?.click()}>Load Character</button>
          </div>
        </div>
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
                <ClanSelector onClanSelect={handleClanSelect} />
                {/* All six disciplines */}
                {Array.from({ length: 6 }).map((_, i) => {
                  const isClanDiscipline = i < 3;
                  const disciplineName = traits[`Discipline_${i}_name`] as string;
                  const currentLevel = traits[`Discipline_${i}`] as number;
                  const isClan = traits[`Discipline_${i}_isClan`] as boolean;
                  
                  return (
                    <DisciplineRow
                      key={`Discipline_${i}`}
                      index={i}
                      disciplineName={disciplineName}
                      currentLevel={currentLevel}
                      isClan={isClan}
                      ep={ep}
                      handleChange={handleChange}
                      handleNameChange={isClanDiscipline ? undefined : handleNameChange}
                      handleClanToggle={isClanDiscipline ? undefined : handleClanToggle}
                      handleDotHover={handleDotHover}
                      handleDotHoverLeave={handleDotHoverLeave}
                      isReadOnly={isClanDiscipline}
                    />
                  );
                })}
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

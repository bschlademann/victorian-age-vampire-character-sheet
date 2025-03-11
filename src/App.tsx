import React, { useState } from "react";
import "./App.css";

//––– Types for fixed trait definitions –––
interface FixedTrait {
  name: string;
  prefill: number;
  costCategory: string | null;
  max: number;
}

//––– Types for categories –––
interface Categories {
  attribute: {
    [group: string]: string[];
  };
  fähigkeiten: {
    [group: string]: string[];
  };
}

const categories: Categories = {
  attribute: {
    körperlich: ["körperkraft", "geschick", "widerstand"],
    sozial: ["charisma", "manipulation", "erscheinung"],
    geistig: ["wahrnehmung", "intelligenz", "geistesschärfe"],
  },
  fähigkeiten: {
    talente: [
      "alertness",
      "athletics",
      "brawl",
      "dodge",
      "empathy",
      "expression",
      "intimidation",
      "leadership",
      "streetwise",
      "subterfuge",
    ],
    fähigkeiten: [
      "animal ken",
      "crafts",
      "etiquette",
      "firearms",
      "melee",
      "performance",
      "ride",
      "security",
      "stealth",
      "survival",
    ],
    kenntnisse: [
      "academics",
      "enigma",
      "finance",
      "investigation",
      "law",
      "linguistics",
      "medicine",
      "occult",
      "politics",
      "science",
    ],
  },
};

//––– Fixed Advantages –––
const fixedHintergruende: FixedTrait[] = [
  { name: "Ally", prefill: 1, costCategory: null, max: 5 },
  { name: "Generation", prefill: 5, costCategory: null, max: 5 },
  { name: "Status", prefill: 1, costCategory: null, max: 5 },
];
const fixedDisziplinen: FixedTrait[] = [
  { name: "Auspex", prefill: 0, costCategory: "disziplinenClan", max: 5 },
  { name: "Celerity", prefill: 0, costCategory: "disziplinenClan", max: 5 },
  { name: "Presence", prefill: 0, costCategory: "disziplinenClan", max: 5 },
];
const fixedTugenden: FixedTrait[] = [
  { name: "Gewissen", prefill: 1, costCategory: "tugenden", max: 5 },
  { name: "Selbstbeherrschung", prefill: 1, costCategory: "tugenden", max: 5 },
  { name: "Mut", prefill: 1, costCategory: "tugenden", max: 5 },
  {
    name: "Menschlichkeit",
    prefill: 1,
    costCategory: "menschlichkeit",
    max: 10,
  },
  { name: "Willenskraft", prefill: 1, costCategory: "willenskraft", max: 10 },
];

//––– Prefill Object –––
const prefill: { [key: string]: number } = {
  körperkraft: 1,
  geschick: 1,
  widerstand: 1,
  charisma: 1,
  manipulation: 1,
  erscheinung: 1,
  wahrnehmung: 1,
  intelligenz: 1,
  alertness: 1,
  brawl: 1,
  dodge: 2,
  firearms: 1,
  melee: 1,
  ride: 1,
  linguistics: 3,
  ally: 1,
  generation: 5,
  status: 1,
  gewissen: 1,
  selbstbeherrschung: 1,
  mut: 1,
};

//––– Cost Mapping –––
const costMapping: { [key: string]: { [key: number]: number } } = {
  attribute: { 1: 0, 2: 4, 3: 8, 4: 12, 5: 16 },
  talente: { 1: 3, 2: 2, 3: 4, 4: 6, 5: 8 },
  fertigkeiten: { 1: 3, 2: 2, 3: 4, 4: 6, 5: 8 },
  kenntnisse: { 1: 3, 2: 2, 3: 4, 4: 6, 5: 8 },
  disziplinenClan: { 1: 10, 2: 5, 3: 15, 4: 15, 5: 20 },
  disziplinNonClan: { 1: 10, 2: 7, 3: 14, 4: 21, 5: 28 },
  tugenden: { 1: 0, 2: 2, 3: 4, 4: 6, 5: 8 },
  menschlichkeit: {
    1: 0,
    2: 2,
    3: 4,
    4: 6,
    5: 8,
    6: 10,
    7: 12,
    8: 14,
    9: 16,
    10: 18,
  },
  willenskraft: {
    1: 0,
    2: 1,
    3: 2,
    4: 3,
    5: 4,
    6: 5,
    7: 6,
    8: 7,
    9: 8,
    10: 9,
  },
};

const maxLevels: { [key: string]: number } = {
  attribute: 5,
  talente: 5,
  fertigkeiten: 5,
  kenntnisse: 5,
  disziplinenClan: 5,
  disziplinNonClan: 5,
  tugenden: 5,
  menschlichkeit: 10,
  willenskraft: 10,
};

function calculateCost(
  categoryKey: string,
  currentLevel: number,
  newLevel: number
): number {
  let cost = 0;
  for (let lvl = currentLevel + 1; lvl <= newLevel; lvl++) {
    cost += costMapping[categoryKey][lvl];
  }
  return cost;
}

//––– TraitRow Props Interface –––
interface TraitRowProps {
  trait: string;
  currentLevel: number;
  costCategory: string | null;
  onChange: (
    trait: string,
    newLevel: number,
    costCategory: string | null,
    max: number
  ) => void;
  max?: number;
}

function TraitRow({
  trait,
  currentLevel,
  costCategory,
  onChange,
  max,
}: TraitRowProps) {
  const computedMax = max || (costCategory ? maxLevels[costCategory] : 5);
  const dots = [];
  for (let i = 1; i <= computedMax; i++) {
    const filled = i <= currentLevel;
    dots.push(
      <span
        key={i}
        onClick={() => {
          if (currentLevel === 1 && i === 1 && filled) {
            onChange(trait, 0, costCategory, computedMax);
          } else {
            onChange(trait, i, costCategory, computedMax);
          }
        }}
        className="dot"
        style={{
          backgroundColor: filled ? "#000" : "#fff",
          color: filled ? "#fff" : "#000",
        }}
      />
    );
  }

  // Show the cost for the next dot if applicable
  const nextCost =
    costCategory && currentLevel < computedMax
      ? costMapping[costCategory][currentLevel + 1]
      : null;

  return (
    <div className="trait-row">
      <span className="trait-name">{trait}</span>
      {dots}
      {nextCost !== null && <span className="dot-cost"> ({nextCost})</span>}
    </div>
  );
}

//––– CustomTraitRow Props Interface –––
interface CustomTraitRowProps {
  traitKey: string;
  currentLevel: number;
  costCategory: string | null;
  onChange: (
    traitKey: string,
    newLevel: number,
    costCategory: string | null,
    max: number
  ) => void;
  max?: number;
  value: string;
  onNameChange: (key: string, newValue: string) => void;
}

function CustomTraitRow({
  traitKey,
  currentLevel,
  costCategory,
  onChange,
  max,
  value,
  onNameChange,
}: CustomTraitRowProps) {
  const computedMax = max || (costCategory ? maxLevels[costCategory] : 5);
  const dots = [];
  for (let i = 1; i <= computedMax; i++) {
    const filled = i <= currentLevel;
    dots.push(
      <span
        key={i}
        onClick={() => {
          if (currentLevel === 1 && i === 1 && filled) {
            onChange(traitKey, 0, costCategory, computedMax);
          } else {
            onChange(traitKey, i, costCategory, computedMax);
          }
        }}
        className="dot"
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
    <div className="trait-row">
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
}

const App: React.FC = () => {
  const initialTraits: { [key: string]: number | string } = {};

  // Initialize Attributes (default to prefill value or 1)
  Object.values(categories.attribute).forEach((group) => {
    group.forEach((trait) => {
      initialTraits[trait] = Object.prototype.hasOwnProperty.call(
        prefill,
        trait
      )
        ? prefill[trait]
        : 1;
    });
  });
  // Initialize Fähigkeiten (default to prefill value or 0)
  Object.entries(categories.fähigkeiten).forEach(([, traitList]) => {
    traitList.forEach((trait) => {
      initialTraits[trait] = Object.prototype.hasOwnProperty.call(
        prefill,
        trait
      )
        ? prefill[trait]
        : 0;
    });
  });
  // Fixed Vorteile
  [...fixedHintergruende, ...fixedDisziplinen, ...fixedTugenden].forEach(
    (item) => {
      initialTraits[item.name] = item.prefill;
    }
  );
  // Custom Hintergründe: 5 rows (dot count and custom name)
  for (let i = 1; i <= 5; i++) {
    initialTraits[`Hintergrund_custom_${i}`] = 0;
    initialTraits[`Hintergrund_custom_${i}_name`] = "";
  }
  // Custom Disziplinen: 5 rows (dot count and custom name)
  for (let i = 1; i <= 5; i++) {
    initialTraits[`Disziplin_custom_${i}`] = 0;
    initialTraits[`Disziplin_custom_${i}_name`] = "";
  }

  const [traits, setTraits] = useState<{ [key: string]: number | string }>(
    initialTraits
  );
  const [ep, setEP] = useState<number>(350);

  function handleChange(
    trait: string,
    newLevel: number,
    costCategory: string | null
  ) {
    if (!costCategory) {
      setTraits({ ...traits, [trait]: newLevel });
      return;
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
                  />
                );
              })}
            </div>
          </div>

          {/* Disziplinen Column */}
          <div className="column">
            <h3>Disziplinen</h3>
            <div className="column-content">
              {fixedDisziplinen.map((item) => (
                <TraitRow
                  key={item.name}
                  trait={item.name}
                  currentLevel={traits[item.name] as number}
                  costCategory={item.costCategory}
                  max={item.max}
                  onChange={handleChange}
                />
              ))}
              <h4>Custom Disziplinen</h4>
              {Array.from({ length: 5 }, (_, i) => {
                const key = `Disziplin_custom_${i + 1}`;
                return (
                  <CustomTraitRow
                    key={key}
                    traitKey={key}
                    currentLevel={traits[key] as number}
                    costCategory="disziplinNonClan"
                    max={5}
                    value={traits[key + "_name"] as string}
                    onChange={handleChange}
                    onNameChange={handleNameChange}
                  />
                );
              })}
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

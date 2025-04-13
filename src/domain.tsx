// src/domain.tsx
// Domain-specific data & functions that are not generic enough to reuse in other apps.

import { Categories, FixedTrait } from "./types";

export const categories: Categories = {
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

export const fixedHintergruende: FixedTrait[] = [
  { name: "Ally", prefill: 1, costCategory: null, max: 5 },
  { name: "Generation", prefill: 5, costCategory: null, max: 5 },
  { name: "Status", prefill: 1, costCategory: null, max: 5 },
];

export const allDisciplines = [
  "Animalism",
  "Auspex",
  "Celerity",
  "Chimerstry",
  "Dementation",
  "Dominate",
  "Fortitude",
  "Obfuscate",
  "Obtenebration",
  "Potence",
  "Presence",
  "Protean",
  "Quietus",
  "Serpentis",
  // "Thaumaturgy",
  // "Vicissitude"
];

// 6 total disciplines
export const initialDisciplines: FixedTrait[] = [
  { name: "", prefill: 0, costCategory: "disziplinNonClan", max: 5, isClan: false },
  { name: "", prefill: 0, costCategory: "disziplinNonClan", max: 5, isClan: false },
  { name: "", prefill: 0, costCategory: "disziplinNonClan", max: 5, isClan: false },
  { name: "", prefill: 0, costCategory: "disziplinNonClan", max: 5, isClan: false },
  { name: "", prefill: 0, costCategory: "disziplinNonClan", max: 5, isClan: false },
  { name: "", prefill: 0, costCategory: "disziplinNonClan", max: 5, isClan: false },
];

export const fixedTugenden: FixedTrait[] = [
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

// Prefills for certain traits
export const prefill: { [key: string]: number } = {
  körperkraft: 1,
  geschick: 1,
  widerstand: 1,
  charisma: 1,
  manipulation: 1,
  erscheinung: 1,
  wahrnehmung: 1,
  intelligenz: 1,
  geistesschärfe: 1,
  alertness: 1,
  brawl: 1,
  dodge: 2,
  firearms: 1,
  melee: 1,
  ride: 1,
  linguistics: 3,
  Ally: 1,
  Generation: 5,
  Status: 1,
  Gewissen: 1,
  Selbstbeherrschung: 1,
  Mut: 1,
  Menschlichkeit: 1,
  Willenskraft: 1,
};

// For cost lookups
export const costMapping: { [key: string]: { [key: number]: number } } = {
  attribute: { 1: 0, 2: 4, 3: 8, 4: 12, 5: 16 },
  talente: { 1: 3, 2: 2, 3: 4, 4: 6, 5: 8 },
  fertigkeiten: { 1: 3, 2: 2, 3: 4, 4: 6, 5: 8 },
  kenntnisse: { 1: 3, 2: 2, 3: 4, 4: 6, 5: 8 },
  disziplinenClan: { 1: 10, 2: 5, 3: 10, 4: 15, 5: 20 },
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

// Maximum level allowed for certain cost categories
export const maxLevels: { [key: string]: number } = {
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

// Discipline highlights
export const disciplineHighlights: {
  [discipline: string]: { [level: number]: string[] };
} = {
  Auspex: {
    1: ["wahrnehmung"],
    2: ["wahrnehmung", "empathy"],
    3: ["wahrnehmung", "empathy"],
    4: ["intelligenz", "subterfuge"],
    5: ["wahrnehmung", "occult"],
  },
  Dominate: {
    1: ["manipulation", "intimidation"],
    2: ["manipulation", "leadership"],
    3: ["geistesschärfe", "subterfuge"],
    4: ["charisma", "leadership"],
    5: ["charisma", "intimidation"],
  },
  Obfuscate: {
    1: [],
    2: ["geistesschärfe", "stealth"],
    3: ["manipulation", "performance"],
    4: ["charisma", "stealth"],
    5: [],
  },
  Presence: {
    1: ["charisma", "performance"],
    2: ["charisma", "intimidation"],
    3: ["erscheinung", "empathy"],
    4: ["charisma", "subterfuge"],
    5: ["willenskraft"],
  },
};

export const clanDisciplines: Record<string, string[]> = {
  Assamite: ["Celerity", "Obfuscate", "Quietus"],
  Brujah: ["Celerity", "Potence", "Presence"],
  Gangrel: ["Animalism", "Fortitude", "Protean"],
  Giovanni: ["Dominate", "Necromancy", "Potence"],
  Lasombra: ["Dominate", "Obtenebration", "Potence"],
  Malkavian: ["Auspex", "Dementation", "Obfuscate"],
  Nosferatu: ["Animalism", "Obfuscate", "Potence"],
  Ravnos: ["Animalism", "Chimerstry", "Fortitude"],
  Toreador: ["Auspex", "Celerity", "Presence"],
  Tremere: ["Auspex", "Dominate", "Thaumaturgy"],
  Tzimisce: ["Animalism", "Auspex", "Vicissitude"],
  Ventrue: ["Dominate", "Fortitude", "Presence"],
};

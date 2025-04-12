// src/types.tsx

export interface FixedTrait {
    name: string;
    prefill: number;
    costCategory: string | null;
    max: number;
    isClan?: boolean;
  }
  
  export interface Categories {
    attribute: {
      [group: string]: string[];
    };
    fähigkeiten: {
      [group: string]: string[];
    };
  }
  
  export interface TraitRowProps {
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
    onDotHover?: (discipline: string, level: number) => void;
    onDotHoverLeave?: () => void;
    isHighlighted?: boolean;
  }
  
  export interface CustomTraitRowProps {
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
    onDotHover?: (discipline: string, level: number) => void;
    onDotHoverLeave?: () => void;
    isHighlighted?: boolean;
  }
  
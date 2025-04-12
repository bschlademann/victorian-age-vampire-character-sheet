import { useState } from "react";

type DotValues = 1 | 2 | 3 | 4 | 5;

export type DotRatingProps = {
  category:
    | "attribute"
    // | "fähigkeiten"
    | "talente"
    | "fertigkeiten"
    | "kenntnisse"
    | "disziplinenClan"
    | "disziplinNonClan"
    | "hintergründe"
    | "tugenden";

  increaseXp: (value: number) => void;
  decreaseXp: (value: number) => void;
};

const DotRating = ({ category, increaseXp, decreaseXp }: DotRatingProps) => {
  const dotValues: DotValues[] = [1, 2, 3, 4, 5];
  const pointsCost: Record<
    DotRatingProps["category"],
    { [key in DotValues]: number }
  > = {
    attribute: { 1: 0, 2: 4, 3: 8, 4: 12, 5: 16 },
    talente: { 1: 3, 2: 2, 3: 4, 4: 6, 5: 8 },
    fertigkeiten: { 1: 3, 2: 2, 3: 4, 4: 6, 5: 8 },
    kenntnisse: { 1: 3, 2: 2, 3: 4, 4: 6, 5: 8 },
    disziplinenClan: { 1: 10, 2: 5, 3: 15, 4: 15, 5: 20 },
    disziplinNonClan: { 1: 10, 2: 7, 3: 14, 4: 21, 5: 28 },
    hintergründe: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    tugenden: { 1: 0, 2: 2, 3: 4, 4: 6, 5: 8 },
  };

  const [checkedDots, setCheckedDots] = useState<{
    [key in DotValues]: boolean;
  }>({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
  });

  const handleDotChange =
    (dot: DotValues, cost: number) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newChecked = e.target.checked;
      setCheckedDots((prev) => ({ ...prev, [dot]: newChecked }));
      if (newChecked) {
        decreaseXp(cost);
      } else {
        increaseXp(cost);
      }
    };

  return (
    <>
      {dotValues.map((value: DotValues) => {
        const dot = value;
        const cost = pointsCost[category][dot];
        return (
          <input
            key={`${category}-${dot}`}
            type="checkbox"
            checked={checkedDots[dot]}
            onChange={handleDotChange(dot, cost)}
          />
        );
      })}
    </>
  );
};

export default DotRating;

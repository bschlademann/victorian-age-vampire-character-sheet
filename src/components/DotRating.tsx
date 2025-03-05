import { useState } from "react";

type DotValues = 1 | 2 | 3 | 4 | 5;

export type DotRatingProps = {
  type:
    | "attribute"
    | "skill"
    | "disciplineClan"
    | "disciplineNonClan"
    | "virtue";
  increaseXp: (value: number) => void;
  decreaseXp: (value: number) => void;
  preChecked?: DotValues;
};

const DotRating = ({ type, increaseXp, decreaseXp }: DotRatingProps) => {
  const dotValues: DotValues[] = [1, 2, 3, 4, 5];
  const pointsCost: Record<
    DotRatingProps["type"],
    { [key in DotValues]: number }
  > = {
    attribute: { 1: 0, 2: 8, 3: 12, 4: 16, 5: 20 },
    skill: { 1: 3, 2: 4, 3: 6, 4: 8, 5: 10 },
    disciplineClan: { 1: 10, 2: 10, 3: 15, 4: 20, 5: 25 },
    disciplineNonClan: { 1: 10, 2: 14, 3: 21, 4: 28, 5: 35 },
    virtue: { 1: 2, 2: 4, 3: 6, 4: 8, 5: 10 },
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
        const cost = pointsCost[type][dot];
        return (
          <input
            key={`${type}-${dot}`}
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

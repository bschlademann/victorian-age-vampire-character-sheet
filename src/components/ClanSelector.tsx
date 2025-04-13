import { clanDisciplines } from "../domain";

interface ClanSelectorProps {
  onClanSelect: (clan: string) => void;
}

export const ClanSelector = ({ onClanSelect }: ClanSelectorProps) => (
  <div className="clan-selector">
    <select 
      onChange={(e) => onClanSelect(e.target.value)}
      defaultValue=""
    >
      <option value="" disabled>Select Clan</option>
      {Object.keys(clanDisciplines).map((clan) => (
        <option key={clan} value={clan}>{clan}</option>
      ))}
    </select>
  </div>
); 
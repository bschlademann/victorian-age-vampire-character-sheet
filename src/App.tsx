import { useState } from "react";
import DotRating from "./components/DotRating";

function App() {
  const [xp, setXp] = useState(350);

  const increaseXp = (value: number) => setXp((prev) => prev + value);
  const decreaseXp = (value: number) => setXp((prev) => prev - value);

  return (
    <>
      <div>
        <label>XP: {xp}</label>
      </div>
      <DotRating type="skill" increaseXp={increaseXp} decreaseXp={decreaseXp}/>
    </>
  );
}

export default App;

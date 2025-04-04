import { useState } from "react";
import "../App.css";
import checkIcon from "/Check_round_fill.svg";
import closeIcon from "/Close_round_fill.svg";

type Props = {
  answer: string;
  isCorrect: boolean;
  correctAnswer: (correct: string) => void;
};
function Answer({ answer, isCorrect, correctAnswer }: Props) {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    correctAnswer(answer);
  };
  return (
    <div
      className={isClicked ? "answer clicked" : "answer"}
      onClick={handleClick}
    >
      <p>{answer}</p>{" "}
      {isClicked && <img src={isCorrect ? checkIcon : closeIcon} />}
    </div>
  );
}

export default Answer;

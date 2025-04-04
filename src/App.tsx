import { useEffect, useState } from "react";
import "./App.css";
import Answer from "./Components/Answer";
import NumberList from "./Components/NumberList";

type Country = {
  name: {
    common: string;
    official: string;
  };
  capital?: string[];
  flags: {
    png: string;
    svg: string;
  };
  population: number;
  languages: {
    [key: string]: string;
  };
};

function App() {
  const [questionNumber, setQuestionNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [flagUrl, setFlagUrl] = useState<string | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [countries, setCountries] = useState([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    fetch("https://restcountries.com/v3.1/all")
      .then((response) => response.json())
      .then((data) => {
        setCountries(data);
        setIsLoading(false);
      });
  }, [questionNumber]);

  useEffect(() => {
    if (countries.length > 0 && questionNumber < 10) {
      handleRandomQuestion();
    }
  }, [countries, questionNumber]);

  const generateQuestion = (data: Country[]): [Country[], Country] => {
    const shuffled = [...data].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 4);

    const correct = selected[Math.floor(Math.random() * 4)];

    return [selected, correct];
  };

  const handleCapitalQuestion = (data: Country[]) => {
    const valid = data.filter((c) => c.capital && c.capital.length > 0);
    const [selected, correct] = generateQuestion(valid);

    setQuestion(`What is the capital of ${correct.name.common}?`);
    setAnswers(
      selected.map((country: Country) => country.capital?.[0] || "No Capital")
    );
    setCorrectAnswer(correct.capital?.[0] || "No Capital");
  };

  const handleCountryFlagQuestion = (data: Country[]) => {
    const [selected, correct] = generateQuestion(data);

    setQuestion(`Which country has the flag`);
    setFlagUrl(correct.flags.png);
    setAnswers(selected.map((country: Country) => country.name.common));
    setCorrectAnswer(correct.name.common);
  };

  const handleLanguageCountry = (data: Country[]) => {
    const valid = data.filter(
      (c) => c.languages && Object.keys(c.languages).length > 0
    );
    const [selected, correct] = generateQuestion(valid);

    const languageValues = Object.values(correct.languages);
    const randomLang =
      languageValues[Math.floor(Math.random() * languageValues.length)];

    setQuestion(`Which country speaks ${randomLang}?`);
    setAnswers(selected.map((country: Country) => country.name.common));
    setCorrectAnswer(correct.name.common);
  };

  const handleRandomQuestion = () => {
    const random = Math.floor(Math.random() * 3);

    if (random === 0) {
      handleCapitalQuestion(countries);
    } else if (random === 1) {
      handleCountryFlagQuestion(countries);
    } else {
      handleLanguageCountry(countries);
    }
  };

  const handleAnswer = (answer: string) => {
    if (answer === correctAnswer) {
      setScore(score + 1);
    } 
    setQuestion("");
    setAnswers([]);
    setCorrectAnswer("");
    setFlagUrl(null);
    setQuestionNumber(questionNumber + 1);
  };

  return (
    <div className="App">
      {isLoading && <p>Loading...</p>}
      {questionNumber < 10 ? (
        <>
          <div className="header">
            <h1>Country Quiz</h1>
            <p>
              🏆
              <span>{score}</span>/10 Points
            </p>
          </div>
          <div className="quiz-container">
            <div className="index-list">
              {[...Array(10)].map((_, i) => (
                <NumberList
                  key={i + 1}
                  number={i + 1}
                  passed={i + 1 <= questionNumber}
                />
              ))}
            </div>
            <p className="question">
              {question}
              {flagUrl && (
                <>
                  <img src={flagUrl} alt={question} className="flag" />
                  <span>?</span>
                </>
              )}
            </p>
            <div className="answer-list">
              {answers.map((answer) => (
                <Answer
                  key={answer}
                  answer={answer}
                  isCorrect={answer === correctAnswer}
                  correctAnswer={handleAnswer}
                />
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="result">
          <h2>Your score: {score}</h2>
          <button onClick={() => setQuestionNumber(0)}>Play Again</button>
        </div>
      )}
    </div>
  );
}

export default App;

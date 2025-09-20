import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db, auth } from "../firebase";
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { FaCheck, FaTimes } from "react-icons/fa";
import { LoadingSpinner } from "../components/loadSpinner";
import ResultScreen from "../components/resultScreen.jsx";
import { loadWords } from "../components/loadWords";


const Quiz = () => {
  const { id } = useParams();
  const [words, setWords] = useState([]);
  const [current, setCurrent] = useState(null);
  const [displayTransl, setDisplayTransl] = useState("");
  const [feedback, setFeedback] = useState("");
  const [source, setSource] = useState("");
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0); // ✅ 答對數
  const [total, setTotal] = useState(0); // ✅ 總題數
  const userLang = localStorage.getItem("language") || "transl";
  const [finished, setFinished] = useState(false);
  const [wrongWords, setWrongWords] = useState([]);

  useEffect(() => {
    const fetchWords = async () => {
      setLoading(true);
      const wordList = await loadWords(id, { random: true, limitNum: 15 });
      setWords(wordList);

      if (wordList.length > 0) {
        generateQuestion(wordList);
      }

      setLoading(false);
    };

    fetchWords();
  }, [id]);


  const getRandomWord = (list, excludeId = null) => {
    const filtered = excludeId ? list.filter((w) => w.id !== excludeId) : list;
    return filtered[Math.floor(Math.random() * filtered.length)];
  };

  const generateQuestion = (list) => {
    const correctWord = getRandomWord(list);
    let showCorrect = Math.random() > 0.5;
    let chosenTransl;

    if (showCorrect) {
      chosenTransl = correctWord[userLang];
    } else {
      const wrongWord = getRandomWord(list, correctWord.id);
      chosenTransl = wrongWord[userLang];
    }

    setCurrent({ ...correctWord, isAnswerCorrect: showCorrect });
    setDisplayTransl(chosenTransl);
  };

  const checkAnswer = (userChoice) => {
    if (!current) return;

    const isCorrect =
      (userChoice === "same" && current.isAnswerCorrect) ||
      (userChoice === "different" && !current.isAnswerCorrect);

    // ✅ 更新計分
    setTotal((prev) => prev + 1);
    if (isCorrect) {
      setScore((prev) => prev + 1);
    } else {
      setWrongWords((prev) => [...prev, current]);
    }

    setFeedback(isCorrect ? "✅" : "❌");

    setTimeout(() => {
      if (total + 1 >= words.length) {
        setFinished(true);
      } else {
        generateQuestion(words);
        setFeedback("");
      }
    }, 500);
  };

  if (loading) return <LoadingSpinner></LoadingSpinner>;

  if (finished) {
    return (
      <ResultScreen
        score={score}
        total={words.length}
        wrongWords={wrongWords}
        onRetryWrong={() => {
          setWords(wrongWords);
          setTotal(0);
          setScore(0);
          setFinished(false);
          setWrongWords([]);
          if (wrongWords.length > 0) generateQuestion(wrongWords);
        }}
      />
    );
  }

  return (
    <div className="p-2 flex flex-col items-center gap-3 text-sm min-h-screen">
      {/* 回饋 */}
      <div className="h-6 flex items-center">
        <p className={`text-sm transition-opacity duration-500 ${feedback ? "opacity-100" : "opacity-0"}`}>
          {feedback}
        </p>
      </div>

      {/* Score */}
      <p className="text-sm text-gray-800">
        <span className="font-bold">{total}</span> / {words.length}
      </p>

      {/* 上方方框：英文 */}
      <div className="w-40 p-2 border rounded text-center text-lg font-bold bg-white">
        {current.en}
      </div>

      {/* 下方方框：翻譯 */}
      <div className="w-40 p-2 border rounded text-center text-base bg-gray-100">
        {displayTransl}
      </div>

      {/* ✅ Icon 按鈕 */}
      <div className="flex gap-3 mt-2">
        <button
          onClick={() => checkAnswer("same")}
          className="w-10 h-10 flex items-center justify-center bg-green-500 text-white rounded"
        >
          <FaCheck size={18} />
        </button>
        <button
          onClick={() => checkAnswer("different")}
          className="w-10 h-10 flex items-center justify-center bg-red-500 text-white rounded"
        >
          <FaTimes size={18} />
        </button>
      </div>

    </div>
  );
}

export default Quiz;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaCheck, FaTimes } from "react-icons/fa";
import { LoadingSpinner } from "../components/loadSpinner";
import ResultScreen from "../components/resultScreen.jsx";
//translate
import { useTranslation } from "react-i18next";
import { updateWordStats } from "../components/updateWordStats.jsx";


const Quiz = () => {
  const { id } = useParams();
  const [words, setWords] = useState([]);
  const [current, setCurrent] = useState(null);
  const [displayTransl, setDisplayTransl] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0); // ✅ 答對數
  const userLang = localStorage.getItem("language") || "transl";
  const [finished, setFinished] = useState(false);
  const [wrongWords, setWrongWords] = useState([]);

  const { t } = useTranslation();

  useEffect(() => {
    const cacheKey = `selectedWords-${id}`;
    const saved = localStorage.getItem(cacheKey);
    if (saved) {
      const parsed = JSON.parse(saved);
      setWords(parsed);
      if (parsed.length > 0) {
        generateQuestion(parsed);
      }
    }
    setLoading(false);
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

  const checkAnswer = async (userChoice) => {
    if (!current) return;

    const isCorrect =
      (userChoice === "same" && current.isAnswerCorrect) ||
      (userChoice === "different" && !current.isAnswerCorrect);

    setCurrentIndex((prev) => prev + 1);

    if (isCorrect) {
      setScore((prev) => prev + 1);
      // ✅ 更新 stats
      const updatedWord = await updateWordStats(id, current, true);
      setWords((prev) => {
        const updated = prev.map((w) => (w.id === current.id ? updatedWord : w));
        localStorage.setItem(`selectedWords-${id}`, JSON.stringify(updated)); // 🔥 加這行
        return updated;
      });

    } else {
      setWrongWords((prev) =>
        prev.some((w) => w.en === current.en) ? prev : [...prev, current]
      );

      // ✅ 更新 stats
      const updatedWord = await updateWordStats(id, current, false);
      setWords((prev) =>
        prev.map((w) => (w.id === current.id ? updatedWord : w))
      );
    }

    setFeedback(isCorrect ? "✅" : "❌");

    setTimeout(() => {
      if (currentIndex + 1 >= words.length) {
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
          setScore(0);
          setCurrentIndex(0);
          setFinished(false);
          setWrongWords([]);
          setFeedback("");
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
        {currentIndex} / {words.length}
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

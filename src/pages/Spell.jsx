import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db, auth } from "../firebase";
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { LoadingSpinner } from "../components/loadSpinner";
import { loadWords } from "../components/loadWords";
import ResultScreen from "../components/resultScreen.jsx";
import speak from "../components/Speek.jsx";
//translate
import { useTranslation } from "react-i18next";
import { updateWordStats } from "../components/updateWordStats.jsx";

const Spell = () => {
  const { id } = useParams();
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0); // ✅ 修改：用 index 控制題目順序
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);
  const [firstTryScore, setFirstTryScore] = useState(0);
  const [finished, setFinished] = useState(false); // ✅ 修改：是否結束
  const [wrongWords, setWrongWords] = useState([]); // ✅ 新增：答錯單字收集
  const userLang = localStorage.getItem("language") || "transl";
  const { t } = useTranslation();



  useEffect(() => {
    const cacheKey = `selectedWords-${id}`;
    const saved = localStorage.getItem(cacheKey);
    if (saved) {
      setWords(JSON.parse(saved)); // 或 setCards()
    }
    setLoading(false);
  }, [id]);

  const current = words[currentIndex]; // ✅ 修改：取得目前題目

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!current) return;

    const isCorrect = input.trim().toLowerCase() === current.en.toLowerCase();

    if (isCorrect) {
      setFeedback("✅");

      if (!wrongWords.some((item) => item.en === current.en)) {
        setFirstTryScore((prev) => prev + 1);
        const updatedWord = await updateWordStats(id, current, true);
        setWords((prev) => {
          const updated = prev.map((w, idx) => (idx === currentIndex ? updatedWord : w));
          localStorage.setItem(`selectedWords-${id}`, JSON.stringify(updated)); // 🔥 加這行
          return updated;
        });
      }


      setTimeout(() => {
        setInput("");
        setFeedback("");
        if (currentIndex + 1 >= words.length) {
          setFinished(true);
        } else {
          setCurrentIndex(currentIndex + 1);
        }
      }, 500);
    } else {
      setFeedback(`❌ ${current.en}`);

      // ✅ 更新 Firestore & 本地
      const updatedWord = await updateWordStats(id, current, false);
      setWords((prev) =>
        prev.map((w, idx) => (idx === currentIndex ? updatedWord : w))
      );

      setWrongWords((prev) =>
        prev.some((item) => item.en === current.en) ? prev : [...prev, current]
      );
    }
  };



  const handleChange = (e) => {
    setInput(e.target.value);
    // 答錯提示保留直到答對
  };

  if (loading) return <LoadingSpinner />;

  if (finished) { //結算畫面
    return (
      <ResultScreen
        score={firstTryScore}
        total={words.length}
        wrongWords={wrongWords}
        onRetryWrong={() => {
          setWords(wrongWords); // 只重做答錯的單字
          setCurrentIndex(0); // 重新從第一題開始
          setFinished(false);
          setFirstTryScore(0);
          setWrongWords([]);
        }}
      />
    );
  }

  if (!current) return <p>No words available</p>;


  return (
    <div className="flex flex-col items-center justify-start min-h-screen mt-0 space-y-3">

      {/* 正確答案 / 回饋（固定高度，避免跳動） */}
      <div className="h-6 flex items-center justify-center">
        <p
          className={`text-sm font-semibold ${feedback.startsWith("❌") ? "text-red-500" : "text-green-600"
            }`}
        >
          {feedback}
        </p>
      </div>

      {/* 題數 */}
      <div className="h-6 flex items-center justify-center m-0">
        <p className="text-sm text-gray-600">
          {currentIndex} / {words.length}
        </p>
      </div>

      {/* 題目提示 */}
      <div className="text-lg font-bold flex items-center gap-2">
        <span>
          {current.en[0]} {Array(current.en.length - 1).fill("_").join(" ")}
        </span>
        <button
          onClick={() => speak(current.en, "en")}
          className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
        >
          🔊
        </button>
      </div>

      {/* 翻譯 */}
      <p className="text-gray-600 flex items-center gap-2">
        {current[userLang]}
      </p>

      {/* 答題區 */}
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-2 mt-2">
        <input
          type="text"
          value={input}
          onChange={handleChange}
          className="border rounded p-2 w-40 text-center"
          placeholder={t("placeholder")}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {t("submit")}
        </button>
      </form>
    </div>
  );
};

export default Spell;

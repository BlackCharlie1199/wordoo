import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db, auth } from "../firebase";
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { LoadingSpinner } from "../components/loadSpinner";
import { loadWords } from "../components/loadWords";
import ResultScreen from "../components/resultScreen.jsx";

const Spell = () => {
  const { id } = useParams();
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0); // ✅ 修改：用 index 控制題目順序
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0); // ✅ 修改：答對數
  const [total, setTotal] = useState(0); // ✅ 修改：總題數
  const [finished, setFinished] = useState(false); // ✅ 修改：是否結束
  const [wrongWords, setWrongWords] = useState([]); // ✅ 新增：答錯單字收集
  const userLang = localStorage.getItem("language") || "transl";

  useEffect(() => {
    const fetchWords = async () => {
      setLoading(true);
      const wordList = await loadWords(id, { random: true, limitNum: 15 }); // ✅ 修改：隨機取 15 個
      setWords(wordList);
      setLoading(false);
    };
    fetchWords();
  }, [id]);

  const current = words[currentIndex]; // ✅ 修改：取得目前題目

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!current) return;

    if (input.trim().toLowerCase() === current.en.toLowerCase()) {
      setScore((prev) => prev + 1);
      setTotal((prev) => prev + 1);
      setFeedback("✅ Correct!");
      setTimeout(() => {
        setInput("");
        setFeedback("");

        if (currentIndex + 1 >= words.length) { // ✅ 修改：超過 15 題 → 結算
          setFinished(true);
        } else {
          setCurrentIndex(currentIndex + 1); // ✅ 修改：跳到下一題
        }
      }, 500);
    } else {
      setFeedback(`❌ ${current.en}`); // ✅ 修改：答錯時停留，顯示正確答案
      setWrongWords((prev) => 
        prev.some(item => item.en === current.en) ? prev :[ ...prev, current]
      ); // 加入錯誤單字列表
    }
  };

  console.log(wrongWords);

  const handleChange = (e) => {
    setInput(e.target.value);
    // ✅ 修改：答錯提示保留直到答對
  };

  if (loading) return <LoadingSpinner />;

  if (finished) { // ✅ 修改：結算畫面
    return (
      <ResultScreen
        score={score}
        total={words.length}
        wrongWords={wrongWords}
        onRetryWrong={() => {
          setWords(wrongWords); // ✅ 修改：只重做答錯的單字
          setCurrentIndex(0); // ✅ 修改：重新從第一題開始
          setTotal(0);
          setScore(0);
          setFinished(false);
          setWrongWords([]);
        }}
      />
    );
  }

  if (!current) return <p>No words available</p>;

  return (
    <div className="flex flex-col items-center mt-2 space-y-3">

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
      <div className="h-6 flex items-center justify-center">
        <p className="text-sm text-gray-600">
          {total} / {words.length}
        </p>
      </div>

      {/* 題目提示 */}
      <div className="text-lg font-bold">
        {current.en[0]} {Array(current.en.length - 1).fill("_").join(" ")}
      </div>

      {/* 翻譯 */}
      <p className="text-gray-600">{current[userLang]}</p>

      {/* 答題區 */}
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-2 mt-2">
        <input
          type="text"
          value={input}
          onChange={handleChange}
          className="border rounded p-2 w-40 text-center"
          placeholder="Type your answer"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Spell;

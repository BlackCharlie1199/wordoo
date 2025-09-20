import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db, auth } from "../firebase";
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { LoadingSpinner } from "../components/loadSpinner";
import { loadWords } from "../components/loadWords";

const Spell = () => {
  const { id } = useParams();
  const [words, setWords] = useState([]);
  const [current, setCurrent] = useState(null);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0); // 已作答題數
  const [score, setScore] = useState(0); // 答對數
  const [finished, setFinished] = useState(false);
  const userLang = localStorage.getItem("language") || "transl";

  // add a helper function to pick the problem randomly
  const generateQuestion = (wordList) => {
    const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
    setCurrent(randomWord);
  };

  useEffect(() => {
    const fetchWords = async () => {
      try {
        setLoading(true);
        const wordList = await loadWords(id, { random: true, limitNum: 15 });
        setWords(wordList);

        if (wordList.length > 0) {
          generateQuestion(wordList); // use the generateQuestion func. dedfned above.
        }
      } catch (e) {
        console.error("Error in fetchWords:", e); //output ERROR
      } finally {
        setLoading(false); // ✅ 放到 finally，避免出錯時 loading 卡死
      }
    };

    fetchWords();
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!current) return;

    if (input.trim().toLowerCase() === current.en.toLowerCase()) {
      // ✅ 答對才算一題
      setScore((prev) => prev + 1);
      setTotal((prev) => prev + 1);

      setFeedback("✅ Correct!");
      setTimeout(() => {
        setInput("");
        setFeedback("");
        setCurrent(words[Math.floor(Math.random() * words.length)]);
      }, 800);
    } else {
      // ❌ 答錯先顯示正確答案，但不加 total
      setFeedback(`❌ ${current.en}`);
    }
  };

  const handleChange = (e) => {
    setInput(e.target.value);
    // 一旦使用者重新輸入 → 清掉提示
    if (feedback.startsWith("❌")) {
      setFeedback("");
    }
  };

  if (loading) return <LoadingSpinner />;

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

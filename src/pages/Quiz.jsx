import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db, auth } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const Quiz = () => {
  const { id } = useParams();
  const [words, setWords] = useState([]);
  const [current, setCurrent] = useState(null);
  const [displayTransl, setDisplayTransl] = useState("");
  const [feedback, setFeedback] = useState("");
  const [source, setSource] = useState("");
  const [score, setScore] = useState(0); // ✅ 答對數
  const [total, setTotal] = useState(0); // ✅ 總題數
  const userLang = localStorage.getItem("language") || "transl";

  useEffect(() => {
    const loadWords = async () => {
      try {
        const user = auth.currentUser;
        let wordsRef;
        let snap;

        if (user) {
          wordsRef = collection(db, "users", user.uid, "wordbanks", id, "words");
          snap = await getDocs(wordsRef);
          if (!snap.empty) setSource("My WordBank");
        }

        if (!snap || snap.empty) {
          wordsRef = collection(db, "wordbanks", id, "words");
          snap = await getDocs(wordsRef);
          if (!snap.empty) setSource("Default WordBank");
        }

        const wordList = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setWords(wordList);

        if (wordList.length > 0) {
          generateQuestion(wordList);
        }
      } catch (e) {
        console.error("Error loading words:", e);
      }
    };

    loadWords();
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
    if (isCorrect) setScore((prev) => prev + 1);

    setFeedback(isCorrect ? "✅ Correct!" : "❌ Wrong!");

    setTimeout(() => {
      generateQuestion(words);
      setFeedback("");
    }, 1000);
  };

  if (!current) return <p className="text-center mt-10">Loading quiz...</p>;

  return (
    <div className="p-6 flex flex-col items-center gap-6">
      <h2 className="text-lg text-gray-600">{source}</h2>

      {/* 計分區 */}
      <p className="text-md text-gray-800">
        Score: <span className="font-bold">{score}</span> / {total}
        {total > 0 && (
          <span className="ml-2 text-sm text-gray-500">
            ({Math.round((score / total) * 100)}%)
          </span>
        )}
      </p>

      {/* 上方方框：英文 */}
      <div className="w-80 p-6 border rounded-lg shadow text-center text-2xl font-bold bg-white">
        {current.en}
      </div>

      {/* 下方方框：翻譯 */}
      <div className="w-80 p-6 border rounded-lg shadow text-center text-xl bg-gray-100">
        {displayTransl}
      </div>

      {/* 答案按鈕 */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={() => checkAnswer("same")}
          className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Same
        </button>
        <button
          onClick={() => checkAnswer("different")}
          className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Different
        </button>
      </div>

      {/* 回饋 */}
      {feedback && <p className="mt-4 text-lg">{feedback}</p>}
    </div>
  );
};

export default Quiz;

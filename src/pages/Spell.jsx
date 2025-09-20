import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db, auth } from "../firebase";
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { LoadingSpinner } from "../components/loadSpinner";

const Spell = () => {
  const { id } = useParams();
  const [words, setWords] = useState([]);
  const [current, setCurrent] = useState(null);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);
  const userLang = localStorage.getItem("language") || "transl";

  useEffect(() => {

    const r = Math.random();

    const loadWords = async () => {
      try {
        const user = auth.currentUser;
        let wordsRef, snap;

        if (user) {
          wordsRef = collection(db, "users", user.uid, "wordbanks", id, "words");
          const q = query(wordsRef, where("rand", ">=", r), limit(15));
          snap = await getDocs(q);

          if (snap.size < 15) {
            const q2 = query(wordsRef, where("rand", "<", r), limit(15 - snap.size));
            const snap2 = await getDocs(q2);
            snap = { docs: [...snap.docs, ...snap2.docs] };
          }
        }

        if (!snap || snap.empty) {
          wordsRef = collection(db, "wordbanks", id, "words");
          const q = query(wordsRef, where("rand", ">=", r), limit(15));
          snap = await getDocs(q);

          if (snap.size < 15) {
            const q2 = query(wordsRef, where("rand", "<", r), limit(15 - snap.size));
            const snap2 = await getDocs(q2);
            snap = { docs: [...snap.docs, ...snap2.docs] };
          }
        }

        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setWords(list);

        if (list.length > 0) {
          setCurrent(list[Math.floor(Math.random() * list.length)]);
        }
      } catch (e) {
        console.error("Error loading spell words:", e);
      } finally {
        setLoading(false);
      }
    };

    loadWords();
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!current) return;

    if (input.trim().toLowerCase() === current.en.toLowerCase()) {
      setFeedback("✅ Correct!");
      setTimeout(() => {
        setInput("");
        setFeedback("");
        // 下一題
        setCurrent(words[Math.floor(Math.random() * words.length)]);
      }, 800);
    } else {
      setFeedback(`❌ ${current.en}`); // 顯示正確答案
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
    <div className="flex flex-col items-center mt-2 gap-2">

      {/* 回饋 */}
      <div className="h-6 flex items-center">
        <p
          className={`transition-opacity duration-300 font-semibold ${feedback ? "opacity-100" : "opacity-0"
            } ${feedback.startsWith("❌") ? "text-red-500" : "text-green-600"}`}
        >
          {feedback}
        </p>
      </div>
      {/* 題目提示 */}
      <div className="text-lg font-bold">
        {current.en[0]} {Array(current.en.length - 1).fill("_").join(" ")}
      </div>

      {/* 翻譯 */}
      <p className="text-gray-600">{current[userLang]}</p>

      {/* 答題區 */}
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-3">
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

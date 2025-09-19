// src/pages/Learn.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db ,auth } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";
import "../styles/Learn.css"; 

const Learn = () => {
  const { id } = useParams(); // wordbank id
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [source, setSource] = useState("");
  const userLang = localStorage.getItem("language") || "transl";

  useEffect(() => {
    const loadCards = async () => {
      try {
        const user = auth.currentUser;
        let snap;

        if (user) {
          // 先找使用者的 wordbank/words
          const userWordsRef = collection(db, "users", user.uid, "wordbanks", id, "words");
          snap = await getDocs(userWordsRef);
          if (!snap.empty) setSource("My WordBank");
        }

        if (!snap || snap.empty) {
          // 如果使用者沒有 → 撈 default wordbanks/words
          const defaultWordsRef = collection(db, "wordbanks", id, "words");
          snap = await getDocs(defaultWordsRef);
          if (!snap.empty) setSource("Default WordBank");
        }

        const wordList = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setCards(wordList);
      } catch (err) {
        console.error("Error loading cards:", err);
      }
    };

    loadCards();
  }, [id]);

  // 鍵盤左右切換
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (cards.length === 0) return;

      if (e.key === "ArrowRight") {
        setFlipped(false);
        setCurrentIndex((prev) => (prev + 1) % cards.length);
      }
      if (e.key === "ArrowLeft") {
        setFlipped(false);
        setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cards]);

  if (cards.length === 0) {
    return <p className="p-4">Loading cards...</p>;
  }

  const currentCard = cards[currentIndex];

  return (
    <div className="flex flex-col items-center mt-3">
      <h2 className="text-gray-600 mb-2">{source}</h2>

      <p className="text-gray-600 mb-6">
        {currentIndex + 1} / {cards.length}
      </p>

      <div
        className="flip-card"
        onClick={() => setFlipped(!flipped)}
      >
        <div className={`flip-card-inner ${flipped ? "flipped" : ""}`}>
          <div className="flip-card-front">
            {currentCard.en}
          </div>
          <div className="flip-card-back">
            {currentCard[userLang]}  {/* ✅ 改這裡 */}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Learn;

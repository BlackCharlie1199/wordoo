import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
//import { db ,auth } from "../firebase";
//import { collection, getDocs, query, where, limit } from "firebase/firestore";
import "../styles/Learn.css";
import { loadWords } from "../components/loadWords";
import { LoadingSpinner } from "../components/loadSpinner";


const Learn = () => {
  const { id } = useParams(); // wordbank id
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [source, setSource] = useState("");
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);
  const userLang = localStorage.getItem("language") || "transl";

  useEffect(() => {
    const cacheKey = `selectedWords-${id}`;
    const saved = localStorage.getItem(cacheKey);
    if (saved) {
      setCards(JSON.parse(saved)); // 或 setCards()
    }
    setLoading(false);
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


  if (loading) return <LoadingSpinner></LoadingSpinner>;
  console.log(cards);
  console.log(userLang);

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
            {currentCard[userLang]}  {/* ✅ 使用語言偏好 */}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Learn;

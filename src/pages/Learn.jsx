// src/pages/Learn.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db ,auth } from "../firebase";
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import "../styles/Learn.css"; 

const Learn = () => {
  const { id } = useParams(); // wordbank id
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [source, setSource] = useState("");
  const [loading, setLoading] = useState(true);
  const userLang = localStorage.getItem("language") || "transl";

  useEffect(() => {
    const r = Math.random();
    const loadCards = async () => {

      try {
        const user = auth.currentUser;
        let wordsRef;
        let snap;

        const r = Math.random();

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

        const wordList = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setCards(wordList);

      } catch (e) {
        console.error("Error loading words:", e);
      } finally {
        setLoading(false);
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
  if (loading) return <LoadingSpinner></LoadingSpinner>;

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

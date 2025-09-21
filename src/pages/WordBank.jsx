import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db, auth } from "../firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { LoadingSpinner } from "../components/loadSpinner";
//translate
import { useTranslation } from "react-i18next";
import { loadWords } from "../components/loadWords";
import { FiRefreshCw } from "react-icons/fi";


const WordBank = () => {
  const { id } = useParams();
  const [bankInfo, setBankInfo] = useState(null);
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showTranslation, setShowTranslation] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showAddWordModal, setShowAddWordModal] = useState(false);
  const [showAnim, setShowAnim] = useState(false);
  const [enWord, setEnWord] = useState("");
  const [translWord, setTranslWord] = useState("");
  const userLang = localStorage.getItem("language") || "transl";
  const navigate = useNavigate();

  const { t } = useTranslation();

  useEffect(() => {
    const load = async (user) => {
      try {
        const cacheKey = `selectedWords-${id}`;
        const cached = localStorage.getItem(cacheKey);

        if (cached) {
          // 已經選過，直接用這批
          



          console.log(cached);





          setWords(JSON.parse(cached));
          return;
        }
        if (id === "default") {
          setBankInfo({
            name: "Default Word Bank",
            description: "Basic 1200 words",
          });

        } else {
          if (user) {
            bankRef = doc(db, "users", user.uid, "wordbanks", id);
            bankSnap = await getDoc(bankRef);
          }
          if (!bankSnap || !bankSnap.exists()) {
            bankRef = doc(db, "wordbanks", id);
            bankSnap = await getDoc(bankRef);
          }
          if (bankSnap.exists()) setBankInfo(bankSnap.data());
        }

        const words = await loadWords(id, { random: true, limitNum: 30 });
        setWords(words.map((w, i) => ({ id: i.toString(), ...w })));

        localStorage.setItem(cacheKey, JSON.stringify(words));

        return;
      } catch (e) {
        console.error("Error loading word bank: ", e);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      load(user);
    });

    const addWordEvent = () => {
      setShowModal(true);
    }

    const openReview = () => setShowReviewModal(true);

    window.addEventListener("add", addWordEvent);
    window.addEventListener("review", openReview);

    return () => {
      window.removeEventListener("add", addWordEvent);
      window.removeEventListener("review", openReview);
      unsubscribe();
    }
  }, [id]);

  useEffect(() => {
    if (showModal) {
      setTimeout(() => setShowAnim(true), 10);
    } else {
      setShowAnim(false);
    }
  }, [showModal]);

  const addWord = async () => {
    if (!enWord.trim()) {
      alert("Please enter an English word!");
      return;
    }

    try {
      const user = auth.currentUser;
      let wordsColRef;

      if (user) {
        wordsColRef = collection(db, "users", user.uid, "wordbanks", id, "words");
      }

      await addDoc(wordsColRef, {
        en: enWord,
        transl: translWord,
        createdAt: serverTimestamp(),
      });

      setEnWord("");
      setTranslWord("");
      setShowModal(false);

      alert("Word added successfully!");
    } catch (e) {
      console.error("Error adding word: ", e);
      alert("Failed to add word, please try again.");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="px-4 pt-2">
      {bankInfo && (
        <>
          <h1 className="text-xl font-bold mb-1">{bankInfo.name}</h1>
          <p className="text-gray-600 mb-3">{bankInfo.description}</p>
        </>
      )}
      <button
        onClick={async () => {
          const words = await loadWords(id, { random: true, limitNum: 30 });
          setWords(words.map((w, i) => ({ id: i.toString(), ...w })));
          localStorage.setItem(`selectedWords-${id}`, JSON.stringify(words));
        }}
        className="p-2 rounded-full hover:bg-gray-200 transition"
        title="Reset"
      >
        <FiRefreshCw size={20} />
      </button>

      <ul className="space-y-3">
        {words.map((word) => (
          <li
            key={`${word.id}-${word.en}`}
            className="w-full sm:w-[250px] md:w-[300px] p-4 border rounded-lg shadow bg-white flex flex-col items-center"
          >
            {/* 英文字 */}
            <p className="font-semibold text-center">{word.en}</p>

            {/* 翻譯 */}
            <p className="text-gray-700 text-center">{word[userLang]}</p>

            {/* ✅ 重要性 Progress Bar */}
            <div className="mt-2 w-full">
              <div className="w-full bg-gray-200 rounded h-2">
                <div
                  className="bg-red-500 h-2 rounded"
                  style={{ width: `${Math.min(100, (word.importance ?? 0) * 20)}%` }}
                ></div>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {/* Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="w-72 bg-white rounded-lg p-4 shadow-lg">
            <h2 className="text-lg font-bold mb-4 text-center">{t("reviewSettings")}</h2>

            <div className="flex flex-col gap-2 mb-4">
              <button className="p-2 border rounded hover:bg-gray-100" onClick={() => { navigate(`/learn/${id}`) }}>{t("flip")}</button>
              <button className="p-2 border rounded hover:bg-gray-100" onClick={() => { navigate(`/spell/${id}`) }}>{t("spelling")}</button>
              <button className="p-2 border rounded hover:bg-gray-100" onClick={() => { navigate(`/quiz/${id}`) }}>{t("trueOrFalse")}</button>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowReviewModal(false)}
                className="px-3 py-1 border rounded hover:bg-gray-100"
              >
                {t("cancel")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WordBank;
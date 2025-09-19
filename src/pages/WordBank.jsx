import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db, auth } from "../firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { LoadingSpinner } from "../components/loadSpinner";

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

  useEffect(() => {
    const load = async (user) => {
      try {
        let bankRef, bankSnap, wordsRef, wordsSnap;

        if (user) {
          bankRef = doc(db, "users", user.uid, "wordbanks", id);
          bankSnap = await getDoc(bankRef);
          wordsRef = collection(db, "users", user.uid, "wordbanks", id, "words");
          wordsSnap = await getDocs(wordsRef);
        }

        if (!bankSnap || !bankSnap.exists()) {
          bankRef = doc(db, "wordbanks", id);
          bankSnap = await getDoc(bankRef);
          wordsRef = collection(db, "wordbanks", id, "words");
          wordsSnap = await getDocs(wordsRef);
        }

        if (bankSnap.exists()) setBankInfo(bankSnap.data());
        if (!wordsSnap.empty) {
          setWords(wordsSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
        }
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

      <ul className="space-y-3">
        {words.map((word) => (
          <li
            key={`${word.id}-${word.en}`}
            className="w-full max-w-[200px] p-2 border rounded bg-white flex flex-col justify-center items-center mx-auto"
          >
            <p className="font-semibold text-center">{word.en}</p>
            <p className="text-gray-700 text-center">{word[userLang]}</p>
          </li>
        ))}
      </ul>
      {/* Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="w-72 bg-white rounded-lg p-4 shadow-lg">
            <h2 className="text-lg font-bold mb-4 text-center">Review settings</h2>

            <div className="flex flex-col gap-2 mb-4">
              <button className="p-2 border rounded hover:bg-gray-100" onClick={() => { navigate(`/learn/${id}`) }}>Flip</button>
              <button className="p-2 border rounded hover:bg-gray-100" onClick={() => { navigate(`/spell/${id}`) }}>Spelling</button>
              <button className="p-2 border rounded hover:bg-gray-100" onClick={() => { navigate(`/quiz/${id}`) }}>True or False</button>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowReviewModal(false)}
                className="px-3 py-1 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WordBank;
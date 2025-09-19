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

      userLang = localStorage.getItem("language");

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
    <div className="p-6">
      {bankInfo && (
        <>
          <h1 className="text-2xl font-bold mb-2">{bankInfo.name}</h1>
          <p className="text-gray-600 mb-6">{bankInfo.description}</p>
        </>
      )}

      <ul className="space-y-3">
        {words.map((word) => (
          <li
            key={`${word.id}-${word.en}`}
            className="w-60 p-3 border rounded shadow-sm bg-white flex flex-col justify-center" 
          >
            <p className="font-semibold text-center">{word.en}</p>
            <p className="text-gray-700 text-center">{word[userLang]}</p>
          </li>
        ))}
      </ul>
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add a New Word</h2>

            <input
              type="text"
              placeholder="en"
              value={enWord}
              onChange={(e) => setEnWord(e.target.value)}
              className="w-full p-2 border rounded mb-3"
            />

            <textarea
              placeholder={localStorage.getItem("language")}
              value={translWord}
              onChange={(e) => setTranslWord(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={addWord}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Review settings</h2>

            {/* 模式選擇 */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button className="p-3 border rounded hover:bg-gray-100" onClick={() => navigate(`/quiz/${id}`)}>Flip</button>
              <button className="p-3 border rounded hover:bg-gray-100" >Spelling</button>
              <button className="p-3 border rounded hover:bg-gray-100" onClick={() => navigate(`/learn/${id}`)}>True or False</button>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowReviewModal(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  navigate("/review"); // TODO: 這裡可以依照選的模式導去不同頁
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Start practice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WordBank;
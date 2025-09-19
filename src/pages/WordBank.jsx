import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db, auth } from "../firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { LoadingSpinner } from "../components/loadSpinner";

const WordBank = () => {
  const { id } = useParams();
  const [bankInfo, setBankInfo] = useState(null);
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTranslation, setShowTranslation] = useState(null);
  const userLang = localStorage.getItem("language") || "transl";

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
    return () => unsubscribe();
  }, [id]);

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
            key={word.id}
            className="p-3 border rounded shadow-sm hover:bg-gray-50 cursor-pointer"
            onClick={() =>
              setShowTranslation(showTranslation === word.id ? null : word.id)
            }
          >
            <p className="font-semibold">{word.en}</p>
            {showTranslation === word.id && (
              <p className="text-gray-700 mt-1">{word[userLang]}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WordBank;
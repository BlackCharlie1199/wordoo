import React, { useEffect, useState } from "react";
import Button from "../components/Button";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";  
import { doc, getDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth } from "../firebase";
import { LoadingSpinner } from "../components/loadSpinner";
import { onAuthStateChanged } from "firebase/auth";

const WordBank = () => {
  const { id } = useParams(); // e.g. "default"
  const navigate = useNavigate();
  const [bankInfo, setBankInfo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enWord, setEnWord] = useState("");
  const [translWord, setTranslWord] = useState("");

  useEffect(() => {
      const load = async (user) => {
        try {
          
          let bankRef;
          let bankSnap;
          if (user) {
            // get the data from user
            bankRef = doc(db, "users", user.uid, "wordbanks", id);
            bankSnap = await getDoc(bankRef);
          }

          if (!bankSnap || !bankSnap.exists()) {
            // get the data in default
            bankRef = doc(db, "wordbanks", id);
            bankSnap = await getDoc(bankRef);
          }

          if (bankSnap.exists()) {
            setBankInfo(bankSnap.data());
          } else {
            setBankInfo(null);
          }
          
          } catch (e) {
            console.error("Error loading word bank: ", e);
          } finally {
            setLoading(false);
          }

        };

      const unsubscribe = onAuthStateChanged(auth, (user) => {
        load(user)
      });

      const addWordEvent = () => {
        setShowModal(true);
      }

      window.addEventListener("add", addWordEvent);

      return () => {
        window.removeEventListener("add", addWordEvent);
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
        transl : translWord,
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

  if (loading) return <LoadingSpinner></LoadingSpinner>;

  return (
    <div className="p-4 text-center">
      <h1 className="text-2xl font-bold mb-2">{bankInfo.name}</h1>
      <p className="text-gray-600 mb-6">{bankInfo.description}</p>

      <div className="flex flex-col items-center gap-4">
        <Button 
          onClick={() => navigate(`/quiz/${id}`)}
          cssClass={"btn btn-green"} 
        >
          Quiz
        </Button>

        <Button
          onClick={() => navigate(`/learn/${id}`)} 
          cssClass = {"btn btn-blue"}
        >
          Learn
        </Button>
      </div>
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
    </div>
  );
};

export default WordBank;
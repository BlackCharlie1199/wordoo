import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { db } from "../firebase";
import { collection, getDocs, serverTimestamp, addDoc } from "firebase/firestore";
import { auth } from '../firebase.js';
import { onAuthStateChanged } from "firebase/auth";

const MyWord = () => {
  const navigate = useNavigate();
  const [wordBanks, setWordBanks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");

  useEffect(() => {

    const load = async (user) => {
      try {
        let data = [];

        const defaultSnap = await getDocs(collection(db, "wordbanks"));
        const defaultData = defaultSnap.docs.map(d => ({ id: d.id, ...d.data(), isDefault: true }));

        data = [...defaultData];

        if (user) {
          const userSnap = await getDocs(collection(db, "users", user.uid, "wordbanks"));
          const userData = userSnap.docs.map(d => ({ id: d.id, ...d.data(), isDefault: false }));
          data = [...data, ...userData];
        }
        setWordBanks(data);
      } catch (e) {
        console.error("Error loading word banks:", e);
      }
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      load(user)
    });

    const addWordbankEvent = () => {
      setShowModal(true);
    }

    window.addEventListener("add", addWordbankEvent);

    return () => {
      window.removeEventListener("add", addWordbankEvent);
      unsubscribe();
    }
  }, []);


  const addWordBank = async () => {
    if (!newName.trim()) {
      alert("Please enter a word bank name!");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in to create a word bank.");
      return;
    }

    const path = `users/${user.uid}/wordbanks`;
    console.log("Writing to:", path);

    try {
      const colRef = collection(db, "users", user.uid, "wordbanks");
      const docRef = await addDoc(colRef, {
        name: newName,
        description: newDescription,
        createdAt: serverTimestamp(),
      });

      setWordBanks(prev => [
        ...prev,
        { id: docRef.id, name: newName, description: newDescription }
      ]);

      setNewName("");
      setNewDescription("");
      setShowModal(false);
    } catch (e) {
      console.error("Failed to add word bank:", e.code, e.message);
      alert("Failed to add word bank. Please check your permissions.");
    }
  };

  

  return (
    <div className="p-4">
      <ul className="space-y-2">
        {wordBanks.map((bank) => (
          <button
            key={bank.id}
            onClick={() => navigate(`/myword/wordbank/${bank.id}`)}
            className="w-full p-3 border rounded shadow-sm text-left hover:bg-gray-100 transition"
          >
            <p className="font-semibold text-lg">{bank.name}</p>
            <p className="text-gray-600">{bank.description}</p>
          </button>
        ))}
      </ul>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add a New Word Bank</h2>
            
            <input
              type="text"
              placeholder="Word bank name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full p-2 border rounded mb-3"
            />
            
            <textarea
              placeholder="Word bank description (optional)"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
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
                onClick={addWordBank}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
};

export default MyWord;

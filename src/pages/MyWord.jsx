import React, { useEffect, useState } from "react";
import { loadUserLanguage } from "./helper";
import { useNavigate } from 'react-router-dom';
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";


const MyWord = () => {
  const navigate = useNavigate();
  const [wordBanks, setWordBanks] = useState([]);

  useEffect(() => {
    const fetchWordBank = async () => {
      try {
        // read the data stored in the firebase -> wordbanks collection
        const querySnapshot = await getDocs(collection(db, "wordbanks"));
        const data = querySnapshot.docs.map((doc) => ({
          id : doc.id,
          ...doc.data(),
        }));
        setWordBanks(data);
      } catch (e) {
        console.error("Error loading word banks: ", e);
      }
    };

    fetchWordBank();
  }, []);

  
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
    </div>
  )
};

export default MyWord;
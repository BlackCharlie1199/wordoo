import React, { useEffect, useState } from "react";
import Button from "../components/Button";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";  
import { doc, getDoc } from "firebase/firestore";

const WordBank = () => {
  const { id } = useParams(); // e.g. "default"
  const navigate = useNavigate();
  const [bankInfo, setBankInfo] = useState(null);

  useEffect(() => {
    const fetchWordBank = async () => {
      try {
        // 只抓 bank 的 metadata (name, description)
        const bankRef = doc(db, "wordbanks", id);
        const bankSnap = await getDoc(bankRef);
        if (bankSnap.exists()) {
          setBankInfo(bankSnap.data());
        }
      } catch (e) {
        console.error("Error loading word bank: ", e);
      }
    };

    fetchWordBank();
  }, [id]);

  if (!bankInfo) return <p>Your wordbank is empty, please add some words.</p>;

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
    </div>
  );
};

export default WordBank;
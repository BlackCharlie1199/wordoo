import React from "react";
import { loadUserLanguage } from "./helper";
import { useNavigate } from 'react-router-dom';
import wordBanks from "../../dictionary/wordBanks.json";

const MyWord = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">MyWord Page</h1>
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
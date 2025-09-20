// src/components/ResultScreen.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const ResultScreen = ({ score, total, wrongWords, onRetryWrong }) => {
  const navigate = useNavigate();
  const accuracy = Math.round((score / total) * 100);

  return (
    <div className="p-4 flex flex-col items-center gap-4">
      <h2 className="text-xl font-bold">Session Finished!</h2>
      <p className="text-gray-700">
        You got {score} / {total} correct ({accuracy}%)
      </p>

      <div className="flex gap-4 mt-4">
        {wrongWords && wrongWords.length > 0 && (
          <button
            onClick={onRetryWrong}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Review Wrong Words
          </button>
        )}
        <button
          onClick={() => navigate("/myword")}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Back to WordBanks
        </button>
      </div>
    </div>
  );
};

export default ResultScreen;
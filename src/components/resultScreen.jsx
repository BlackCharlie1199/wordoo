import React from "react";
import { useNavigate } from "react-router-dom";
//translate
import { useTranslation } from "react-i18next";
import { FiRefreshCw, FiArrowLeft } from "react-icons/fi";

const ResultScreen = ({ score, total, wrongWords, onRetryWrong }) => {
  const navigate = useNavigate();
  const accuracy = Math.round((score / total) * 100);
  const { t } = useTranslation();

  return (
    <div className="p-4 flex flex-col items-center gap-4">
      <h2 className="text-xl font-bold">{t("sessionFinished")}</h2>
      <p className="text-gray-700">
        {score} / {total} ({accuracy}%)
      </p>

      <div className="flex flex-col gap-3 mt-4 w-full items-center">
        {wrongWords && wrongWords.length > 0 && (
          <button
            onClick={onRetryWrong}
            className="flex flex-col items-center p-3 bg-blue-500 text-white rounded w-24"
          >
            <FiRefreshCw size={20} />
            <span className="text-xs mt-1"></span>
          </button>
        )}

        <button
          onClick={() => navigate("/myword")}
          className="flex flex-col items-center p-3 bg-gray-300 rounded w-24"
        >
          <FiArrowLeft size={20} />
          <span className="text-xs mt-1"></span>
        </button>
      </div>
    </div>
  );
};

export default ResultScreen;
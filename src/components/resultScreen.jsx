import React from "react";
import { useNavigate } from "react-router-dom";
//translate
import { useTranslation } from "react-i18next";

const ResultScreen = ({ score, total, wrongWords, onRetryWrong }) => {
  const navigate = useNavigate();
  const accuracy = Math.round((score / total) * 100);
  const { t } = useTranslation();

  return (
    <div className="p-4 flex flex-col items-center gap-4">
      <h2 className="text-xl font-bold">{t("sessionFinished")}</h2>
      <p className="text-gray-700">
        You got {score} / {total} correct ({accuracy}%)
      </p>

      <div className="flex gap-4 mt-4">
        {wrongWords && wrongWords.length > 0 && (
          <button
            onClick={onRetryWrong}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            {t("reviewWrongWords")}
          </button>
        )}
        <button
          onClick={() => navigate("/myword")}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          {t("backToWordBanks")}
        </button>
      </div>
    </div>
  );
};

export default ResultScreen;
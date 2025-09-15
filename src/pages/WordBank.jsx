import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const WordBank = () => {
  const { id } = useParams(); // for example test, basic
  const [bank, setBank] = useState(null);

  useEffect(() => {
    // load the vocabulary dynamically
    import(`../../dictionary/word/${id}.json`)
      .then((data) => setBank(data.default))
      .catch((err) => console.error("cannot load dictionary", err));
  }, [id]);

  if (!bank) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{bank.title}</h1>

      <div className="space-x-4 mb-6">
        <button className="px-4 py-2 bg-blue-500 text-white rounded">
          Quiz
        </button>
        <button className="px-4 py-2 bg-green-500 text-white rounded">
          Learn
        </button>
      </div>

      <ul className="space-y-2">
        {bank.words.map((w, i) => (
          <li key={i} className="p-2 border rounded">
            <b>{w.term}</b>: {w.definition}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WordBank;

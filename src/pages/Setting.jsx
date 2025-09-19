// Setting.jsx
import React, { useState, useEffect } from "react";
import { saveUserLanguage } from "./helper";

const Setting = () => {
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("language");
    if (savedLang) {
      setLanguage(savedLang);
    }
  }, []);

  const handleChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    localStorage.setItem("language", newLang);
    saveUserLanguage(newLang);
  };

  return (
    <div className="p-4">
      <h1 className="text-[14pt] font-bold">Setting Page</h1>
      <label className="block mt-4 text-[12pt]">
        Choose Language:
        <select value={language} onChange={handleChange} className="ml-2 p-1 border">
          <option value="vi">Tiếng Việt</option>
          <option value="th">ไทย</option>
          <option value="id">Bahasa Indonesia</option>
        </select>
      </label>
    </div>
  );
};

export default Setting;
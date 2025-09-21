// Setting.jsx
import React, { useState, useEffect } from "react";
import { saveUserLanguage } from "./helper";

//translate
import { useTranslation } from "react-i18next";

const Setting = () => {
  const [language, setLanguage] = useState("vi");
  const { i18n } = useTranslation();
  const { t } = useTranslation();
  

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
    i18n.changeLanguage(newLang);       
    saveUserLanguage(newLang);
  };

  return (
    <div className="p-4">
      <h1 className="text-[14pt] font-bold">{t("settingPage")}:</h1>
      <label className="block mt-4 text-[12pt]">
        {t("selectLanguage")}:
        <select value={language} onChange={handleChange} className="ml-2 p-1 border">
          <option value="hi">हिन्दी</option>
          <option value="bn">বাংলা</option>
          <option value="te">తెలుగు</option>
          <option value="mr">मराठी</option>
          <option value="ta">தமிழ்</option>
          <option value="ur">اُردُو</option>
          <option value="vi">Tiếng Việt</option>
          <option value="en">English</option>
        </select>
      </label>
    </div>
  );
};

export default Setting;
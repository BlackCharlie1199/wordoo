import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./assets/en.json";
import hi from "./assets/hi.json";
import bn from "./assets/bn.json";
import vi from "./assets/vi.json";
import mr from "./assets/mr.json";
import ta from "./assets/ta.json";
import te from "./assets/te.json";
import ur from "./assets/ur.json";



i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    hi: { translation: hi },
    bn: { translation: bn },
    vi: { translation: vi },
    mr: { translation: mr },
    ta: { translation: ta },
    te: { translation: te },
    ur: { translation: ur },
  },
  lng: localStorage.getItem("language") || "en", // 預設語言
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;

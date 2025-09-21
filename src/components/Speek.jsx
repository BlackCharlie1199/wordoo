const langMap = {
  hi: "hi-IN",  // Hindi
  bn: "bn-BD",  // Bengali
  te: "te-IN",  // Telugu
  mr: "mr-IN",  // Marathi
  ta: "ta-IN",  // Tamil
  ur: "ur-PK",  // Urdu
  vi: "vi-VN",  // Vietnamese
  en: "en-US",  // English (預設)
};

const speak = (text, lang = "en") => {
  if (!text) return;

  const utterance = new SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis.getVoices(); // 🔑 取得所有可用 voice
  console.log(voices);
  const langCode = langMap[lang] || "en-US";

  // 嘗試找對應的 voice
  const voice = voices.find(v => v.lang === langCode);
  if (voice) {
    utterance.voice = voice;
  } else {
    utterance.lang = langCode; // 找不到就至少指定 lang
  }

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
};

export default speak;

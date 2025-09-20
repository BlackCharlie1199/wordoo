import { doc, updateDoc, increment } from "firebase/firestore";
import { db, auth } from "../firebase";

/**
 * 更新單字統計資訊（重要性 / 熟練度 / 答題次數）
 * @param {string} bankId - 單字庫 ID
 * @param {string} word - 單字物件（包含 id, importance, proficiency 等）
 * @param {boolean} isCorrect - 是否答對
 * @returns {object} 更新後的單字物件
 */
export const updateWordStats = async (bankId, word, isCorrect) => {
  const user = auth.currentUser;
  let newWord = { ...word };
  const cacheKey = `selectedWords-${bankId}`;

  if (isCorrect) {
    newWord.correctCount = (newWord.correctCount || 0) + 1;
    newWord.importance = Math.max(1, (newWord.importance || 3) - 1);
    newWord.proficiency = (newWord.proficiency || 0) + 1;
  } else {
    newWord.wrongCount = (newWord.wrongCount || 0) + 1;
    newWord.importance = Math.min(5, (newWord.importance || 3) + 1);
    newWord.proficiency = (newWord.proficiency || 0) - 1;
  }

  newWord.lastReviewed = Date.now();


  if (bankId === "default") {
    /*
    const savedStats = JSON.parse(localStorage.getItem(cacheKey) || "{}");
    savedStats[newWord.en] = {
      importance: newWord.importance,
      proficiency: newWord.proficiency
    };
    localStorage.setItem(cacheKey, JSON.stringify(savedStats));
    */
  }
  // ✅ 更新 Firestore (只有非 default 才需要)
  if (bankId !== "default" && user) {
    const wordRef = doc(db, "users", user.uid, "wordbanks", bankId, "words", word.id);
    await updateDoc(wordRef, {
      correctCount: isCorrect ? increment(1) : undefined,
      wrongCount: !isCorrect ? increment(1) : undefined,
      importance: isCorrect ? increment(-1) : increment(1),
      proficiency: isCorrect ? increment(1) : increment(-1),
      lastReviewed: Date.now()
    });
  }

  return newWord;
};

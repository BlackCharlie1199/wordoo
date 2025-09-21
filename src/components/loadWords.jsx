import { db, auth } from "../firebase";
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import defaultWords from "../assets/words.json";

/** 
 * 讀取單字資料
 * @param {string} bankId - 單字庫 ID
 * @param {Object} options - 可選項
 * @param {boolean} options.random - 是否隨機 (預設 false)
 * @param {number} options.limitNum - 最多抓幾筆 (隨機才用到)
 */

export const loadWords = async (
  bankId,
  { random = false, limitNum = 0 } = {}
) => {
  try {
    // default wordbank：直接讀本地 JSON
    if (bankId === "default") {
      let words = defaultWords.map((w, idx) => {
        // 從 localStorage 抓設定
        const savedStats = JSON.parse(localStorage.getItem("defaultWordStats") || "{}");
        const stats = savedStats[w.en] || {};

        return {
          id: (idx + 1).toString(),
          ...w,
          importance: stats.importance ?? 3,   // 預設 3
          proficiency: stats.proficiency ?? 0, // 預設 0
          rand: Math.random()
        };
      });

      if (random) {
        words = words.sort(() => Math.random() - 0.5);
      }
      if (limitNum > 0) {
        words = words.slice(0, limitNum);
      }

      return words;
    }

    // 非 default 的情況：去 Firestore
    const user = auth.currentUser;
    let wordsRef;
    let snap;

    if (random) {
      const r = Math.random();

      if (user) {
        wordsRef = collection(db, "users", user.uid, "wordbanks", bankId, "words");
        const q = query(wordsRef, where("rand", ">=", r), limit(limitNum));
        snap = await getDocs(q);

        if (snap.size < limitNum) {
          const q2 = query(wordsRef, where("rand", "<", r), limit(limitNum - snap.size));
          const snap2 = await getDocs(q2);
          snap = { docs: [...snap.docs, ...snap2.docs] };
        }
      }

      if (!snap || snap.empty) {
        wordsRef = collection(db, "wordbanks", bankId, "words");
        const q = query(wordsRef, where("rand", ">=", r), limit(limitNum));
        snap = await getDocs(q);

        if (snap.size < limitNum) {
          const q2 = query(wordsRef, where("rand", "<", r), limit(limitNum - snap.size));
          const snap2 = await getDocs(q2);
          snap = { docs: [...snap.docs, ...snap2.docs] };
        }
      }
    } else {
      if (user) {
        wordsRef = collection(db, "users", user.uid, "wordbanks", bankId, "words");
        snap = await getDocs(wordsRef);
      }

      if (!snap || snap.empty) {
        wordsRef = collection(db, "wordbanks", bankId, "words");
        snap = await getDocs(wordsRef);
      }
    }

    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (e) {
    console.error("Error loading words:", e);
    return [];
  }
};
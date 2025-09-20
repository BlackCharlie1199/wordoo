import { db, auth } from "../firebase";
import { collection, getDocs, query, where, limit } from "firebase/firestore";

/** 
 * 讀取單字資料
 * @param {string} bankId - 單字庫 ID
 * @param {Object} options - 可選項
 * @param {boolean} options.random - 是否隨機 (預設 false)
 * @param {number} options.limitNum - 最多抓幾筆 (隨機才用到)
 */
export const loadWords = async (bankId, { random = false, limitNum = 0 } = {}) => {
  try {
    const user = auth.currentUser;
    let wordsRef;
    let snap;

    if (random) {
      // fot Quiz
      const r = Math.random();

      // If there exist the wordbank user made, pick it in priority
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
      // for MyWord & Learn
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
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase";

export const saveUserLanguage = async (lang) => {
  if (!auth.currentUser) return;
  const uid = auth.currentUser.uid;

  // store the data into data base
  await setDoc(doc(db, "users", uid), {
    language: lang
  }, { merge: true });  // merge: true means that we only update the language  
};

export const loadUserLanguage = async () => {

  // if the user hasn't logged in we just use the lang in the local storage
  let user_lang = localStorage.getItem("language") || "vi";
  if (!auth.currentUser) return user_lang;  

  // get uid of current user
  const uid = auth.currentUser.uid;

  try {
    const snap = await getDoc(doc(db, "users", uid));
    if (snap.exists()) {
      user_lang = snap.data().language || "vi";
    } else {
      saveUserLanguage(user_lang);
    }
    localStorage.setItem("language", user_lang);
  } catch (e) {
    console.error("Error loading language: ", e);
  }

  return user_lang;
};

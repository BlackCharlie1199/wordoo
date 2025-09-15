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
  const user_lang = localStorage.getItem("language");
  if (!auth.currentUser) return user_lang;  

  // get uid of current user
  const uid = auth.currentUser.uid;

  const snap = await getDoc(doc(db, "users", uid));
  if (snap.exists()) {
    const lang = snap.data().language || "en";
    localStorage.setItem("language", lang);
    return lang;
  } else {
    saveUserLanguage(user_lang);
    return user_lang;
  }
};
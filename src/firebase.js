// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {

  apiKey: "AIzaSyCH4kZjBgscCKF_qLpoNUfiud4LGqN8inI",

  authDomain: "wordoo-fdf60.firebaseapp.com",

  projectId: "wordoo-fdf60",

  storageBucket: "wordoo-fdf60.firebasestorage.app",

  messagingSenderId: "35025423999",

  appId: "1:35025423999:web:8f0e0817f613b47a0a394a",

  measurementId: "G-D5S5NYPL36"

};



// Initialize Firebase

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);
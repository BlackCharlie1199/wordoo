// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {

  apiKey: "AIzaSyDN0V2I8xXcVZRiwqyi6LZGxXROvUqgtoI",

  authDomain: "wordoo-5eacd.firebaseapp.com",

  projectId: "wordoo-5eacd",

  storageBucket: "wordoo-5eacd.firebasestorage.app",

  messagingSenderId: "279553040079",

  appId: "1:279553040079:web:0fdfe5b78754025cafe1ba",

  measurementId: "G-YF54XDVDW4"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);
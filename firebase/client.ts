// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAli4YqK6lUaM2-TBxYMQwSbKqfUutH1Ec",
  authDomain: "prepwise-5a56c.firebaseapp.com",
  projectId: "prepwise-5a56c",
  storageBucket: "prepwise-5a56c.firebasestorage.app",
  messagingSenderId: "39318669138",
  appId: "1:39318669138:web:24f888f3e9089c92aa5c8b",
  measurementId: "G-G7PDYNSXVV",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);

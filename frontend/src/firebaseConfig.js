// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCp4aMF8nor1qOElfLdiLrnIBW0FTCgKf0",
  authDomain: "dejac-new.firebaseapp.com",
  projectId: "dejac-new",
  storageBucket: "dejac-new.firebasestorage.app",
  messagingSenderId: "1076609780414",
  appId: "1:1076609780414:web:192c81c349482aa066ecef",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

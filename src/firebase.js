import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAG5Law5Fez6EkfegAIcTyvSYFI4kCnjr4",
  authDomain: "rincon-fredy.firebaseapp.com",
  databaseURL: "https://rincon-fredy-default-rtdb.firebaseio.com",
  projectId: "rincon-fredy",
  storageBucket: "rincon-fredy.firebasestorage.app",
  messagingSenderId: "844451568209",
  appId: "1:844451568209:web:777841919b60f71007b670",
  measurementId: "G-W19RTH1R1X"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);


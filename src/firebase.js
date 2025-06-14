import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBvQ4bhnMK0lFQo9Yvf85jtSq1h7F0u_Y0",
  authDomain: "ekspertiza-forensic.firebaseapp.com",
  projectId: "ekspertiza-forensic",
  storageBucket: "ekspertiza-forensic.firebasestorage.app",
  messagingSenderId: "296413781486",
  appId: "1:296413781486:web:5a755de661795fe82c82ff"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
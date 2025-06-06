// firebase.js - Updated Firebase configuration
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
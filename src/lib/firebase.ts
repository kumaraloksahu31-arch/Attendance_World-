
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "studio-4899358888-9bd13.firebaseapp.com",
  projectId: "studio-4899358888-9bd13",
  storageBucket: "studio-4899358888-9bd13.appspot.com",
  messagingSenderId: "549477142818",
  appId: "1:549477142818:web:ba8adff74b42da70cf957b"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };

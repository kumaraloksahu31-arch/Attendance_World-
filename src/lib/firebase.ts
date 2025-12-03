
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "studio-4899358888-9bd13.firebaseapp.com",
  projectId: "studio-4899358888-9bd13",
  storageBucket: "studio-4899358888-9bd13.firebasestorage.app",
  messagingSenderId: "549477142818",
  appId: "1:549477142818:web:ba8adff74b42da70cf957b"
};

function createFirebaseApp() {
  if (getApps().length > 0) {
    return getApp();
  }
  return initializeApp(firebaseConfig);
}

export const firebaseApp = createFirebaseApp();
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);

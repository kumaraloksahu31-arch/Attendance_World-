// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "studio-4899358888-9bd13.firebaseapp.com",
  projectId: "studio-4899358888-9bd13",
  storageBucket: "studio-4899358888-9bd13.firebasestorage.app",
  messagingSenderId: "549477142818",
  appId: "1:549477142818:web:ba8adff74b42da70cf957b"
};

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (typeof window !== 'undefined' && firebaseConfig.apiKey) {
  // Only initialize on the client side
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} else {
  // Provide dummy instances for server-side rendering or build process
  app = {} as FirebaseApp;
  auth = {} as Auth;
  db = {} as Firestore;
}

const analytics = typeof window !== 'undefined' && firebaseConfig.apiKey ? isSupported().then(yes => yes ? getAnalytics(app) : null) : Promise.resolve(null);

export { app, auth, db, analytics };

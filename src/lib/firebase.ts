
import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
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

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let analytics: any = null;

function initializeFirebase() {
  if (typeof window !== 'undefined' && firebaseConfig.apiKey) {
    if (!app) {
      app = getApps().length ? getApp() : initializeApp(firebaseConfig);
      auth = getAuth(app);
      db = getFirestore(app);
      isSupported().then(yes => {
        if (yes) {
          analytics = getAnalytics(app as FirebaseApp);
        }
      });
    }
  }
}

// Call initialization
initializeFirebase();

export function getFirebaseApp(): FirebaseApp | null {
  if (!app) initializeFirebase();
  return app;
}

export function getFirebaseAuth(): Auth | null {
  if (!auth) initializeFirebase();
  return auth;
}

export function getFirebaseDb(): Firestore | null {
  if (!db) initializeFirebase();
  return db;
}

export function getFirebaseAnalytics() {
  if (!analytics) initializeFirebase();
  return analytics;
}

// Legacy exports for any other parts of the app that might still use them directly
// Although they should be updated to use the getter functions.
export { app, auth, db, analytics };

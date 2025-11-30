// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCdLiVExZPQmQn2wTgP2FqBxISVWqd2WHs",
  authDomain: "attendee-world.firebaseapp.com",
  projectId: "attendee-world",
  storageBucket: "attendee-world.firebasestorage.app",
  messagingSenderId: "645780365118",
  appId: "1:645780365118:web:996c6c725ac8fcc74cd66f",
  measurementId: "G-65P0B0Z9GZ"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const analytics = isSupported().then(yes => yes ? getAnalytics(app) : null);

export { app, analytics };

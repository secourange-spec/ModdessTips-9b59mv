import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

// Configuration Firebase avec variables d'environnement
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDiV6Wft0AEByYh1z14Q3niTiTCRMwrdrc",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "modess-68d0d.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://modess-68d0d-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "modess-68d0d",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "modess-68d0d.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "596193001452",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:596193001452:web:c9214b990dfc5e13320ac9",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-1DMCJFCJWJ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);

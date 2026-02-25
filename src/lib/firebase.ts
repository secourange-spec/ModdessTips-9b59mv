import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDiV6Wft0AEByYh1z14Q3niTiTCRMwrdrc",
  authDomain: "modess-68d0d.firebaseapp.com",
  databaseURL: "https://modess-68d0d-default-rtdb.firebaseio.com",
  projectId: "modess-68d0d",
  storageBucket: "modess-68d0d.firebasestorage.app",
  messagingSenderId: "596193001452",
  appId: "1:596193001452:web:c9214b990dfc5e13320ac9",
  measurementId: "G-1DMCJFCJWJ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);

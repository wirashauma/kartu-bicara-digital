import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyCt7EIlSAXz1PIEYe0nIonx1pb_Vfyo9bM",
  authDomain: "kartu-bicara-digital.firebaseapp.com",
  projectId: "kartu-bicara-digital",
  storageBucket: "kartu-bicara-digital.firebasestorage.app",
  messagingSenderId: "459346102485",
  appId: "1:459346102485:web:c56a866244e676230cfa5c",
};

export const firebaseApp: FirebaseApp =
  getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const firebaseAuth: Auth = getAuth(firebaseApp);
export const firestoreDb: Firestore = getFirestore(firebaseApp);

export default firebaseApp;


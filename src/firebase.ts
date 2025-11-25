// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// --------------
// IMPORTANT:
// Replace the firebaseConfig values below with your project's config
// You will find it: Firebase Console → Project Settings → Web App → Config
// --------------

const firebaseConfig = {
  apiKey: "AIzaSyBTsD5NrwgjBRjTm7VltadWzDnpHwV5hkk",
  authDomain: "hastilong-b3837.firebaseapp.com",
  projectId: "hastilong-b3837",
  storageBucket: "hastilong-b3837.firebasestorage.app",
  messagingSenderId: "34336938872",
  appId: "1:34336938872:web:19fddbad7bc357227d868d",
  measurementId: "G-Q5368J1970"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Helper function for Google Login
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Google Sign-in error", error);
    throw error;
  }
};


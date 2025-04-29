import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  // measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID // Optional
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);

// You can optionally connect to the emulators during development
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
    // Check if running in the browser before connecting emulators
    // import { connectAuthEmulator } from 'firebase/auth';
    // import { connectFirestoreEmulator } from 'firebase/firestore';
    // import { connectFunctionsEmulator } from 'firebase/functions';
    // try {
    //     connectAuthEmulator(auth, 'http://localhost:9099');
    //     connectFirestoreEmulator(db, 'localhost', 8080);
    //     connectFunctionsEmulator(functions, 'localhost', 5001);
    //     console.log("Connected to Firebase Emulators");
    // } catch (error) {
    //     console.error("Error connecting to Firebase Emulators:", error);
    // }
}


export { app, auth, db, functions };

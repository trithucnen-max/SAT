import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

// Validate essential environment variables
const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

if (!apiKey || !authDomain || !projectId) {
    const missingVars = [
        !apiKey && "NEXT_PUBLIC_FIREBASE_API_KEY",
        !authDomain && "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
        !projectId && "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
    ].filter(Boolean).join(', ');
  throw new Error(`Missing Firebase configuration. Please set the following environment variables: ${missingVars}. Check your .env file.`);
}


const firebaseConfig = {
  apiKey: apiKey,
  authDomain: authDomain,
  projectId: projectId,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  // measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID // Optional
};

// Initialize Firebase
let app: ReturnType<typeof initializeApp>;
try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
} catch (error: any) {
     console.error("Firebase initialization error:", error);
     // Re-throw a more specific error if it's an invalid config issue
     if (error.code === 'auth/invalid-api-key' || error.message.includes('invalid-api-key')) {
         throw new Error(`Firebase initialization failed: Invalid API Key. Please check the NEXT_PUBLIC_FIREBASE_API_KEY environment variable.`);
     }
     throw new Error(`Firebase initialization failed: ${error.message}. Please check your Firebase config environment variables.`);
}

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
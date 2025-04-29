'use client';

import type React from 'react';
import { createContext, useContext } from 'react';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import { GoogleAuthProvider } from 'firebase/auth'; // Import GoogleAuthProvider
import type { Firestore } from 'firebase/firestore';
import type { Functions } from 'firebase/functions';
import { app, auth, db, functions } from '@/config/firebase'; // Adjust the import path as necessary

interface FirebaseContextType {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
  functions: Functions;
  googleAuthProvider: typeof GoogleAuthProvider; // Add GoogleAuthProvider type
}

const FirebaseContext = createContext<FirebaseContextType | null>(null);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <FirebaseContext.Provider value={{ app, auth, db, functions, googleAuthProvider: GoogleAuthProvider }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

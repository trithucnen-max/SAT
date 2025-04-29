'use client';

import type React from 'react';
import { createContext, useState, useEffect, useContext } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { useFirebase } from './FirebaseContext';

// Define subscription tiers
export type SubscriptionTier = 'free' | 'premium' | 'high-end';

// Extend Firebase User type with custom claims if needed, e.g., subscription tier
export interface AppUser extends User {
  subscriptionTier?: SubscriptionTier;
  // Add other custom user properties if needed
}

interface AuthContextType {
  currentUser: AppUser | null;
  loading: boolean;
  isGuest: boolean; // Flag to identify guest users
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  isGuest: true, // Default to guest until proven otherwise
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { auth, db } = useFirebase();
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsGuest(false);
        const userDocRef = doc(db, 'users', user.uid);
        const unsubscribeSnapshot = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setCurrentUser({
              ...user,
              subscriptionTier: userData.subscriptionTier || 'free',
            });
          } else {
            // Handle case where user document might not exist immediately after creation
            // We might want to create it here if it's missing, but for now, assume 'free' tier
            setCurrentUser({ ...user, subscriptionTier: 'free' });
            // Consider creating the doc here: setDoc(userDocRef, { /* initial data */ });
             console.warn(`User document for ${user.uid} not found, defaulting to free tier.`);
          }
          setLoading(false);
        }, (error) => {
           console.error("Error listening to user document:", error);
           // Fallback if snapshot fails
           setCurrentUser({ ...user, subscriptionTier: 'free' });
           setLoading(false);
        });

        // Return the snapshot listener cleanup function
        return () => unsubscribeSnapshot();
      } else {
        // User is signed out (Guest)
        setCurrentUser(null);
        setIsGuest(true);
        setLoading(false);
      }
    }, (error) => {
        // Handle potential errors during initial auth state check
        console.error("Auth state change error:", error);
        setCurrentUser(null);
        setIsGuest(true);
        setLoading(false);
    });

    // Cleanup auth subscription on unmount
    return () => unsubscribeAuth();
  }, [auth, db]);

  return (
    <AuthContext.Provider value={{ currentUser, loading, isGuest }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
     throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

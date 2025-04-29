'use client';

import type React from 'react';
import { createContext, useState, useEffect, useContext } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { useFirebase } from './FirebaseContext';
import { Skeleton } from '@/components/ui/skeleton'; // For loading state

// Define subscription tiers
export type SubscriptionTier = 'free' | 'premium' | 'high-end';

// Extend Firebase User type with custom claims if needed, e.g., subscription tier
interface AppUser extends User {
  subscriptionTier?: SubscriptionTier;
  // Add other custom user properties if needed
}

interface AuthContextType {
  currentUser: AppUser | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { auth, db } = useFirebase();
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, now fetch custom data like subscription tier
        const userDocRef = doc(db, 'users', user.uid);
        try {
           // Use onSnapshot for real-time updates to user data (e.g., subscription changes)
          const unsubscribeSnapshot = onSnapshot(userDocRef, (docSnap) => {
             if (docSnap.exists()) {
                const userData = docSnap.data();
                setCurrentUser({
                ...user,
                subscriptionTier: userData.subscriptionTier || 'free', // Default to 'free' if not set
                // Add other custom properties here
                });
            } else {
                // Handle case where user document doesn't exist (might happen on first login)
                setCurrentUser({ ...user, subscriptionTier: 'free' });
            }
            setLoading(false);
          });

          // Return the snapshot listener cleanup function
          return () => unsubscribeSnapshot();

        } catch (error) {
          console.error("Error fetching user data:", error);
          // Fallback: Set user without custom data
          setCurrentUser({ ...user, subscriptionTier: 'free' });
          setLoading(false);
        }
      } else {
        // User is signed out
        setCurrentUser(null);
        setLoading(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribeAuth();
  }, [auth, db]);

  // Display loading state while checking auth status
  if (loading) {
     return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="flex flex-col space-y-3 items-center">
                <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                </div>
                 <Skeleton className="h-10 w-[100px] mt-4" />
            </div>
        </div>
    );
  }

  return (
    <AuthContext.Provider value={{ currentUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

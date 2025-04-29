'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useFirebase } from '@/context/FirebaseContext';
import type { SubscriptionTier } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function SignupPage() {
  const { auth, db } = useFirebase();
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    if (!auth || !db) {
        setError("Firebase services are not initialized.");
        setLoading(false);
        return;
    }


    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create a user document in Firestore with default 'free' tier
      const userDocRef = doc(db, 'users', user.uid);
      const initialSubscriptionTier: SubscriptionTier = 'free';
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        createdAt: new Date(),
        subscriptionTier: initialSubscriptionTier,
        // Add any other initial user data here
      });


      toast({
        title: 'Signup Successful',
        description: 'Your account has been created.',
      });
      router.push('/dashboard'); // Redirect to dashboard after signup
    } catch (err: any) {
       console.error("Signup error:", err);
       // Provide more specific error messages
       let errorMessage = 'Failed to create account. Please try again.';
       if (err.code === 'auth/email-already-in-use') {
           errorMessage = 'This email address is already in use.';
       } else if (err.code === 'auth/weak-password') {
           errorMessage = 'Password should be at least 6 characters.';
       }
       setError(errorMessage);
       toast({
           title: 'Signup Failed',
           description: errorMessage,
           variant: 'destructive',
       });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
          <CardDescription>Enter your email and password to sign up for SPAT</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                 disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6} // Basic check
                 disabled={loading}
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
            </div>
             {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
               {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline text-primary">
              Login
            </Link>
          </div>
           <div className="mt-2 text-center text-sm">
            <Link href="/" className="underline text-muted-foreground">
             Back to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

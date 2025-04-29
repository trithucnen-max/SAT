'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useFirebase } from '@/context/FirebaseContext';
import { updateProfile, updateEmail, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from 'lucide-react';


export default function ProfilePage() {
  const { currentUser, loading: authLoading } = useAuth();
  const { auth, db } = useFirebase();
  const { toast } = useToast();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
   // Add state for password if allowing email change requires re-authentication
  const [currentPassword, setCurrentPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsReauth, setNeedsReauth] = useState(false);


  useEffect(() => {
    if (currentUser) {
      setDisplayName(currentUser.displayName || '');
      setEmail(currentUser.email || '');
    }
  }, [currentUser]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !auth || !db) {
        setError("User not logged in or Firebase not initialized.");
        return;
    };

    setLoading(true);
    setError(null);
    setNeedsReauth(false); // Reset re-auth flag

    let profileUpdated = false;
    let emailUpdated = false;

    try {
      // Update Display Name if changed
      if (displayName !== currentUser.displayName) {
        await updateProfile(currentUser, { displayName });
         // Update Firestore as well if you store display name there
         const userDocRef = doc(db, 'users', currentUser.uid);
         await updateDoc(userDocRef, { displayName: displayName });
        profileUpdated = true;
      }

      // --- Update Email if changed (Requires Re-authentication) ---
        if (email !== currentUser.email) {
            if (!currentPassword) {
                setNeedsReauth(true);
                setError("Changing email requires you to re-enter your current password for security.");
                setLoading(false);
                return; // Stop execution until password is provided
            }

            try {
                // Re-authenticate user
                 const credential = EmailAuthProvider.credential(currentUser.email!, currentPassword);
                 await reauthenticateWithCredential(currentUser, credential);

                 // If re-authentication is successful, update email
                 await updateEmail(currentUser, email);

                 // Update Firestore email if stored there (optional but recommended)
                 const userDocRef = doc(db, 'users', currentUser.uid);
                 await updateDoc(userDocRef, { email: email });

                 emailUpdated = true;
                 setCurrentPassword(''); // Clear password field after successful use
            } catch (reauthError: any) {
                 console.error("Re-authentication failed:", reauthError);
                 if (reauthError.code === 'auth/wrong-password') {
                     setError("Incorrect password. Please try again.");
                 } else {
                     setError("Failed to re-authenticate. Please try logging out and back in.");
                 }
                 setLoading(false);
                 return; // Stop execution
            }
        }
      // --- End Email Update ---


       if (profileUpdated || emailUpdated) {
            toast({
                title: 'Profile Updated',
                description: 'Your profile information has been saved.',
            });
        } else {
             toast({
                title: 'No Changes',
                description: 'No changes were detected in your profile information.',
                variant: "default" // Use a different variant or just info
            });
        }

    } catch (err: any) {
      console.error("Profile update error:", err);
      setError(err.message || 'Failed to update profile.');
       toast({
        title: 'Update Failed',
        description: err.message || 'Could not update your profile.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };


   if (authLoading) {
     return (
        <div className="container mx-auto py-8">
             <Skeleton className="h-8 w-1/4 mb-2" />
             <Skeleton className="h-5 w-1/2 mb-8" />
             <Card>
                 <CardHeader>
                     <Skeleton className="h-6 w-1/3 mb-2" />
                     <Skeleton className="h-4 w-2/3" />
                 </CardHeader>
                 <CardContent className="space-y-4">
                     <Skeleton className="h-10 w-full" />
                     <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                     <Skeleton className="h-10 w-24 ml-auto" />
                 </CardContent>
             </Card>
         </div>
     );
   }

  if (!currentUser) {
    return <div className="container mx-auto py-8 text-center">Please log in to view your profile.</div>;
  }


  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your account information.</p>
      </div>

      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
          <CardDescription>Update your display name and email address.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                type="text"
                placeholder="Your Name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
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

              {/* Conditionally show password input for re-authentication */}
              {needsReauth && (
                  <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password (for email change)</Label>
                      <Input
                          id="currentPassword"
                          type="password"
                          required
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          disabled={loading}
                          placeholder="Enter current password to confirm"
                      />
                     <p className="text-xs text-muted-foreground">Required to change your email address for security.</p>
                  </div>
               )}


             {error && (
                 <Alert variant="destructive">
                     <Terminal className="h-4 w-4" />
                     <AlertTitle>Error</AlertTitle>
                     <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <Button type="submit" className="w-full sm:w-auto" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Add sections for password change, subscription management link, etc. later */}
      <Card className="w-full max-w-2xl mx-auto mt-6">
         <CardHeader>
             <CardTitle>Subscription</CardTitle>
            <CardDescription>Manage your SPAT plan.</CardDescription>
         </CardHeader>
          <CardContent className="flex justify-between items-center">
             <p>Your current plan: <span className="font-semibold capitalize">{currentUser.subscriptionTier}</span></p>
             <Link href="/billing" passHref legacyBehavior>
                <Button variant="outline">Manage Billing</Button>
            </Link>
          </CardContent>
      </Card>

       {/* Potential section for password change - Requires careful implementation */}
       {/* <Card className="w-full max-w-2xl mx-auto mt-6">...</Card> */}
    </div>
  );
}

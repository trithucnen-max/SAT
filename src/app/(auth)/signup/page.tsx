'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, UserCredential, AuthError } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { useFirebase } from '@/context/FirebaseContext';
import type { SubscriptionTier } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

// Basic i18n strings
const translations = {
  en: {
    signupTitle: 'Create an Account',
    signupDescription: 'Enter your email and password to sign up for SPAT',
    emailLabel: 'Email',
    emailPlaceholder: 'm@example.com',
    passwordLabel: 'Password',
    confirmPasswordLabel: 'Confirm Password',
    signupButton: 'Sign Up',
    signingUpButton: 'Creating Account...',
    googleSignupButton: 'Sign up with Google',
    googleSigningUpButton: 'Signing up...',
    orSeparator: 'OR',
    loginPrompt: 'Already have an account?',
    loginLink: 'Login',
    backToHome: 'Back to Home',
    passwordMismatch: 'Passwords do not match.',
    firebaseInitError: 'Firebase services are not initialized.',
    signupSuccessTitle: 'Signup Successful',
    signupSuccessDesc: 'Your account has been created.',
    signupFailTitle: 'Signup Failed',
    googleFailTitle: 'Google Sign-Up Failed',
    googleFailDescDefault: 'Google Sign-Up failed. Please try again.',
    googleFailDescCancelled: 'Sign-up cancelled.',
    googleFailDescExists: 'An account already exists with this email. Try logging in.',
    googleFailDescPopupBlocked: "Pop-up blocked by browser. Please allow pop-ups for this site.",
    defaultError: 'Failed to create account. Please try again.',
    emailInUseError: 'This email address is already in use.',
    weakPasswordError: 'Password should be at least 6 characters.',
    welcomeToSPAT: 'Welcome to SPAT!',
  },
  vi: {
    signupTitle: 'Tạo tài khoản',
    signupDescription: 'Nhập email và mật khẩu để đăng ký SPAT',
    emailLabel: 'Email',
    emailPlaceholder: 'm@example.com',
    passwordLabel: 'Mật khẩu',
    confirmPasswordLabel: 'Xác nhận mật khẩu',
    signupButton: 'Đăng ký',
    signingUpButton: 'Đang tạo tài khoản...',
    googleSignupButton: 'Đăng ký với Google',
    googleSigningUpButton: 'Đang đăng ký...',
    orSeparator: 'HOẶC',
    loginPrompt: 'Đã có tài khoản?',
    loginLink: 'Đăng nhập',
    backToHome: 'Quay lại trang chủ',
    passwordMismatch: 'Mật khẩu không khớp.',
    firebaseInitError: 'Dịch vụ Firebase chưa được khởi tạo.',
    signupSuccessTitle: 'Đăng ký thành công',
    signupSuccessDesc: 'Tài khoản của bạn đã được tạo.',
    signupFailTitle: 'Đăng ký thất bại',
    googleFailTitle: 'Đăng ký Google thất bại',
    googleFailDescDefault: 'Đăng ký bằng Google thất bại. Vui lòng thử lại.',
    googleFailDescCancelled: 'Đã hủy đăng ký.',
    googleFailDescExists: 'Tài khoản đã tồn tại với email này. Hãy thử đăng nhập.',
     googleFailDescPopupBlocked: "Cửa sổ bật lên bị chặn bởi trình duyệt. Vui lòng cho phép cửa sổ bật lên cho trang web này.",
    defaultError: 'Không thể tạo tài khoản. Vui lòng thử lại.',
    emailInUseError: 'Địa chỉ email này đã được sử dụng.',
    weakPasswordError: 'Mật khẩu phải có ít nhất 6 ký tự.',
     welcomeToSPAT: 'Chào mừng đến với SPAT!',
  },
};


export default function SignupPage() {
  const firebaseContext = useFirebase();
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<'en' | 'vi'>('en');

  const strings = translations[language];

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError(strings.passwordMismatch);
      return;
    }
    if (password.length < 6) {
         setError(strings.weakPasswordError);
         return;
     }


    setLoadingEmail(true);

    if (!firebaseContext || !firebaseContext.auth || !firebaseContext.db) {
        setError(strings.firebaseInitError);
        setLoadingEmail(false);
        return;
    }
     const { auth, db } = firebaseContext;

    try {
      const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create a user document in Firestore with default 'free' tier
      const userDocRef = doc(db, 'users', user.uid);
      const initialSubscriptionTier: SubscriptionTier = 'free';
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.email, // Default display name to email
        createdAt: serverTimestamp() as Timestamp, // Use Firestore Timestamp
        subscriptionTier: initialSubscriptionTier,
        lastLogin: serverTimestamp() as Timestamp,
         photoURL: null, // Initialize photoURL
      });

      toast({
        title: strings.signupSuccessTitle,
        description: strings.signupSuccessDesc,
      });
      router.push('/dashboard'); // Redirect to dashboard after signup
    } catch (err: any) {
       console.error("Signup error:", err);
       const authError = err as AuthError;
       let errorMessage = strings.defaultError;

       switch (authError.code) {
         case 'auth/email-already-in-use':
           errorMessage = strings.emailInUseError;
           break;
         case 'auth/weak-password':
           errorMessage = strings.weakPasswordError;
           break;
         default:
           errorMessage = authError.message || errorMessage;
           break;
       }

       setError(errorMessage);
       toast({
           title: strings.signupFailTitle,
           description: errorMessage,
           variant: 'destructive',
       });
    } finally {
      setLoadingEmail(false);
    }
  };

   const handleGoogleSignUp = async () => {
     setLoadingGoogle(true);
     setError(null);

     if (!firebaseContext || !firebaseContext.auth || !firebaseContext.db || !firebaseContext.googleAuthProvider) {
         setError(strings.firebaseInitError);
         toast({
             title: strings.googleFailTitle,
             description: strings.firebaseInitError,
             variant: 'destructive',
         });
         setLoadingGoogle(false);
         return;
     }

     const { auth, db, googleAuthProvider } = firebaseContext;
     const provider = new googleAuthProvider(); // Instantiate the provider

    try {
        const result: UserCredential = await signInWithPopup(auth, provider);
        const user = result.user;

         // Prepare user data for Firestore
         const userData = {
             uid: user.uid,
             email: user.email,
             displayName: user.displayName || user.email, // Fallback display name
             photoURL: user.photoURL,
             lastLogin: serverTimestamp() as Timestamp, // Use Firestore Timestamp
         };


        // Check if user document already exists
        const userDocRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);

        if (!docSnap.exists()) {
             // Create new user document if they don't exist
             await setDoc(userDocRef, {
                ...userData,
                createdAt: serverTimestamp() as Timestamp,
                subscriptionTier: 'free', // Default tier
            });
             toast({
                title: strings.signupSuccessTitle,
                description: strings.welcomeToSPAT,
             });
        } else {
             // User exists, treat as login - update last login time and potentially profile info
             await updateDoc(userDocRef, {
                 displayName: userData.displayName,
                 photoURL: userData.photoURL,
                 lastLogin: userData.lastLogin,
                 // Do not overwrite createdAt or subscriptionTier on login
             });
             toast({
                 title: 'Login Successful', // Use login title as they exist
                 description: 'Welcome back!',
             });
        }
        router.push('/dashboard'); // Redirect after sign-up or login
    } catch (error: any) {
         console.error("Google Sign-Up/Sign-In error:", error);
         const authError = error as AuthError;
         let message = strings.googleFailDescDefault;

         switch (authError.code) {
             case 'auth/popup-closed-by-user':
             case 'auth/cancelled-popup-request':
                 message = strings.googleFailDescCancelled;
                 break;
             case 'auth/account-exists-with-different-credential':
                 message = strings.googleFailDescExists;
                 break;
             case 'auth/popup-blocked':
                 message = strings.googleFailDescPopupBlocked;
                 break;
             default:
                 message = authError.message || message;
                 break;
         }

         setError(message);
         toast({
             title: strings.googleFailTitle,
             description: message,
             variant: 'destructive',
         });
    } finally {
        setLoadingGoogle(false);
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary">
      <div className="absolute top-4 right-4">
        <Button variant="outline" size="sm" onClick={() => setLanguage(language === 'en' ? 'vi' : 'en')}>
          {language === 'en' ? 'Tiếng Việt' : 'English'}
        </Button>
      </div>
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">{strings.signupTitle}</CardTitle>
          <CardDescription>{strings.signupDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{strings.emailLabel}</Label>
              <Input
                id="email"
                type="email"
                placeholder={strings.emailPlaceholder}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                 disabled={loadingEmail || loadingGoogle}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{strings.passwordLabel}</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6} // Enforce minimum length in UI
                 disabled={loadingEmail || loadingGoogle}
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="confirm-password">{strings.confirmPasswordLabel}</Label>
              <Input
                id="confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loadingEmail || loadingGoogle}
              />
            </div>
             {error && <p className="text-sm text-destructive text-center">{error}</p>}
            <Button type="submit" className="w-full" disabled={loadingEmail || loadingGoogle}>
               {loadingEmail ? strings.signingUpButton : strings.signupButton}
            </Button>
          </form>

          <div className="my-4 flex items-center">
            <Separator className="flex-grow" />
            <span className="mx-2 text-xs text-muted-foreground">{strings.orSeparator}</span>
            <Separator className="flex-grow" />
          </div>

          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2" // Added flex utilities
            onClick={handleGoogleSignUp}
            disabled={loadingEmail || loadingGoogle}
          >
            {/* Basic Google Icon SVG */}
             <svg className="h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 381.7 512 244 512 109.8 512 0 402.2 0 261.8 0 120.3 109.8 11.8 244 11.8c70.3 0 136.5 28.7 184.4 75.4l-62.9 54.7C334.5 106.4 295.6 86.8 244 86.8c-66.8 0-123 54.4-123 121.3 0 66.9 56.2 121.4 123 121.4 72.9 0 100.7-47.8 105.3-71.4H244V245.5h132.3c1.9 10.8 3.1 21.9 3.1 34.1 0 16.2-3.1 32.4-9.4 47.8z"></path></svg>
            {loadingGoogle ? strings.googleSigningUpButton : strings.googleSignupButton}
          </Button>


          <div className="mt-4 text-center text-sm">
             {strings.loginPrompt}{' '}
            <Link href="/login" className="underline text-primary">
              {strings.loginLink}
            </Link>
          </div>
           <div className="mt-2 text-center text-sm">
             <Link href="/" className="underline text-muted-foreground">
               {strings.backToHome}
             </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

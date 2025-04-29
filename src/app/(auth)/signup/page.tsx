'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
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
    googleFailDescExists: 'An account already exists with this email using a different sign-in method.',
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
    googleFailDescExists: 'Tài khoản đã tồn tại với email này bằng phương thức đăng nhập khác.',
    defaultError: 'Không thể tạo tài khoản. Vui lòng thử lại.',
    emailInUseError: 'Địa chỉ email này đã được sử dụng.',
    weakPasswordError: 'Mật khẩu phải có ít nhất 6 ký tự.',
     welcomeToSPAT: 'Chào mừng đến với SPAT!',
  },
};


export default function SignupPage() {
  const { auth, db, googleAuthProvider } = useFirebase();
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

    setLoadingEmail(true);

    if (!auth || !db) {
        setError(strings.firebaseInitError);
        setLoadingEmail(false);
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
        displayName: user.email, // Default display name to email
        createdAt: serverTimestamp(),
        subscriptionTier: initialSubscriptionTier,
        // Add any other initial user data here
      });


      toast({
        title: strings.signupSuccessTitle,
        description: strings.signupSuccessDesc,
      });
      router.push('/dashboard'); // Redirect to dashboard after signup
    } catch (err: any) {
       console.error("Signup error:", err);
       // Provide more specific error messages
       let errorMessage = strings.defaultError;
       if (err.code === 'auth/email-already-in-use') {
           errorMessage = strings.emailInUseError;
       } else if (err.code === 'auth/weak-password') {
           errorMessage = strings.weakPasswordError;
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
    if (!auth || !db || !googleAuthProvider) {
        setError(strings.firebaseInitError);
        return;
    }
    setLoadingGoogle(true);
    setError(null);
    const provider = new googleAuthProvider();

    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Check if user document already exists (e.g., signed up via email before)
        const userDocRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);

        if (!docSnap.exists()) {
             // Create new user document
             await setDoc(userDocRef, {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                createdAt: serverTimestamp(),
                subscriptionTier: 'free',
            });
             toast({
                title: strings.signupSuccessTitle,
                description: strings.welcomeToSPAT,
             });
        } else {
             // User exists, potentially update info (like display name/photo if changed)
            await updateDoc(userDocRef, {
                displayName: user.displayName,
                photoURL: user.photoURL,
                lastLogin: serverTimestamp(), // Update last login time
             });
             toast({
                 title: strings.signupSuccessTitle, // Or maybe "Login Successful" if they already existed
                 description: 'Welcome back!',
             });
        }
        router.push('/dashboard');
    } catch (error: any) {
         console.error("Google Sign-Up/Sign-In error:", error);
         let message = strings.googleFailDescDefault;
         if (error.code === 'auth/popup-closed-by-user') {
             message = strings.googleFailDescCancelled;
         } else if (error.code === 'auth/account-exists-with-different-credential') {
             // This case is crucial: the user might have an account with the same email but via password.
             // You might want to guide them to the login page instead.
              message = strings.googleFailDescExists;
             // Optionally redirect or provide a specific link
              // router.push('/login?error=account-exists');
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
                minLength={6} // Basic check
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
             {error && <p className="text-sm text-destructive">{error}</p>}
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
            className="w-full"
            onClick={handleGoogleSignUp}
            disabled={loadingEmail || loadingGoogle}
          >
            {/* Basic Google Icon SVG */}
             <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 381.7 512 244 512 109.8 512 0 402.2 0 261.8 0 120.3 109.8 11.8 244 11.8c70.3 0 136.5 28.7 184.4 75.4l-62.9 54.7C334.5 106.4 295.6 86.8 244 86.8c-66.8 0-123 54.4-123 121.3 0 66.9 56.2 121.4 123 121.4 72.9 0 100.7-47.8 105.3-71.4H244V245.5h132.3c1.9 10.8 3.1 21.9 3.1 34.1 0 16.2-3.1 32.4-9.4 47.8z"></path></svg>
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

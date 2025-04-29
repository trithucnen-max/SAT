'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useFirebase } from '@/context/FirebaseContext'; // Use Firebase context
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

// Basic i18n strings
const translations = {
  en: {
    loginTitle: 'Login to SPAT',
    loginDescription: 'Enter your email below to login to your account',
    emailLabel: 'Email',
    emailPlaceholder: 'm@example.com',
    passwordLabel: 'Password',
    loginButton: 'Login',
    loggingInButton: 'Logging in...',
    googleSignInButton: 'Sign in with Google',
    googleSigningInButton: 'Signing in...',
    orSeparator: 'OR',
    signupPrompt: "Don't have an account?",
    signupLink: 'Sign up',
    backToHome: 'Back to Home',
    loginSuccessTitle: 'Login Successful',
    loginSuccessDesc: 'Welcome back!',
    loginFailTitle: 'Login Failed',
    googleFailTitle: 'Google Sign-In Failed',
    googleFailDescDefault: 'Google Sign-In failed. Please try again.',
    googleFailDescCancelled: 'Sign-in cancelled.',
    googleFailDescExists: 'An account already exists with this email using a different sign-in method.',
  },
  vi: {
    loginTitle: 'Đăng nhập vào SPAT',
    loginDescription: 'Nhập email của bạn dưới đây để đăng nhập vào tài khoản',
    emailLabel: 'Email',
    emailPlaceholder: 'm@example.com',
    passwordLabel: 'Mật khẩu',
    loginButton: 'Đăng nhập',
    loggingInButton: 'Đang đăng nhập...',
    googleSignInButton: 'Đăng nhập với Google',
    googleSigningInButton: 'Đang đăng nhập...',
    orSeparator: 'HOẶC',
    signupPrompt: 'Chưa có tài khoản?',
    signupLink: 'Đăng ký',
    backToHome: 'Quay lại trang chủ',
    loginSuccessTitle: 'Đăng nhập thành công',
    loginSuccessDesc: 'Chào mừng trở lại!',
    loginFailTitle: 'Đăng nhập thất bại',
    googleFailTitle: 'Đăng nhập Google thất bại',
    googleFailDescDefault: 'Đăng nhập bằng Google thất bại. Vui lòng thử lại.',
    googleFailDescCancelled: 'Đã hủy đăng nhập.',
    googleFailDescExists: 'Tài khoản đã tồn tại với email này bằng phương thức đăng nhập khác.',
  },
};

export default function LoginPage() {
  const { auth, db, googleAuthProvider } = useFirebase(); // Get services and provider
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<'en' | 'vi'>('en'); // Simple language state

  const strings = translations[language];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingEmail(true);
    setError(null);

    if (!auth) {
      setError("Firebase Auth is not initialized.");
      setLoadingEmail(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: strings.loginSuccessTitle,
        description: strings.loginSuccessDesc,
      });
      router.push('/dashboard');
    } catch (err: any) {
      console.error("Login error:", err);
      const message = err.message || 'Failed to log in. Please check your credentials.';
      setError(message);
      toast({
        title: strings.loginFailTitle,
        description: message,
        variant: 'destructive',
      });
    } finally {
      setLoadingEmail(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!auth || !db || !googleAuthProvider) {
        setError("Firebase services not available.");
        return;
    }
    setLoadingGoogle(true);
    setError(null);
    const provider = new googleAuthProvider();

    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        const userDocRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);

        if (!docSnap.exists()) {
            await setDoc(userDocRef, {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                createdAt: serverTimestamp(),
                subscriptionTier: 'free',
            });
            toast({
                title: strings.loginSuccessTitle, // Using login success for new Google user too
                description: 'Welcome to SPAT!', // Custom welcome for new user
            });
        } else {
             await updateDoc(userDocRef, {
                 displayName: user.displayName,
                 photoURL: user.photoURL,
                 lastLogin: serverTimestamp(),
            });
            toast({
                title: strings.loginSuccessTitle,
                description: strings.loginSuccessDesc,
            });
        }
        router.push('/dashboard');
    } catch (error: any) {
        console.error("Google Sign-In error:", error);
        let message = strings.googleFailDescDefault;
        if (error.code === 'auth/popup-closed-by-user') {
            message = strings.googleFailDescCancelled;
        } else if (error.code === 'auth/account-exists-with-different-credential') {
             message = strings.googleFailDescExists;
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
          <CardTitle className="text-2xl font-bold">{strings.loginTitle}</CardTitle>
          <CardDescription>{strings.loginDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
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
                disabled={loadingEmail || loadingGoogle}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loadingEmail || loadingGoogle}>
              {loadingEmail ? strings.loggingInButton : strings.loginButton}
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
            onClick={handleGoogleSignIn}
            disabled={loadingEmail || loadingGoogle}
          >
            {/* Basic Google Icon SVG */}
             <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 381.7 512 244 512 109.8 512 0 402.2 0 261.8 0 120.3 109.8 11.8 244 11.8c70.3 0 136.5 28.7 184.4 75.4l-62.9 54.7C334.5 106.4 295.6 86.8 244 86.8c-66.8 0-123 54.4-123 121.3 0 66.9 56.2 121.4 123 121.4 72.9 0 100.7-47.8 105.3-71.4H244V245.5h132.3c1.9 10.8 3.1 21.9 3.1 34.1 0 16.2-3.1 32.4-9.4 47.8z"></path></svg>
            {loadingGoogle ? strings.googleSigningInButton : strings.googleSignInButton}
          </Button>

          <div className="mt-4 text-center text-sm">
            {strings.signupPrompt}{' '}
            <Link href="/signup" className="underline text-primary">
              {strings.signupLink}
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

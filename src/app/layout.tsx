import type {Metadata} from 'next';
import {Geist_Sans as GeistSans} from 'next/font/google';
import './globals.css';
import {cn} from '@/lib/utils';
import {Toaster} from '@/components/ui/toaster';
import {AuthProvider} from '@/context/AuthContext'; // Import AuthProvider
import {FirebaseProvider} from '@/context/FirebaseContext'; // Import FirebaseProvider

const geistSans = GeistSans({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'SPAT - SAT Prep Adaptive Tool',
  description:
    'Your personalized journey to mastering the SAT with adaptive practice tests and targeted feedback.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          geistSans.variable
        )}
      >
        <FirebaseProvider>
          {' '}
          {/* Wrap with FirebaseProvider */}
          <AuthProvider>
            {' '}
            {/* Wrap with AuthProvider */}
            {children}
            <Toaster />
          </AuthProvider>
        </FirebaseProvider>
      </body>
    </html>
  );
}

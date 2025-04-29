import type {Metadata} from 'next';
import { Inter } from 'next/font/google'; // Import Inter from next/font/google
import './globals.css';
import {cn} from '@/lib/utils';
import {Toaster} from '@/components/ui/toaster';
import {AuthProvider} from '@/context/AuthContext'; // Import AuthProvider
import {FirebaseProvider} from '@/context/FirebaseContext'; // Import FirebaseProvider

// Instantiate Inter font
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter', // Define a CSS variable for the font
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
    <html lang="en" className={inter.variable}> {/* Add font variable to html tag */}
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased'
          // Removed the direct font variable here as it's applied to <html>
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

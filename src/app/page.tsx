'use client';

import Link from 'next/link';
import {Button} from '@/components/ui/button';
import {useAuth} from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const {currentUser} = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      router.push('/dashboard');
    }
  }, [currentUser, router]);


  if (currentUser) {
    // Optional: Show loading or redirecting state
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link href="#" className="flex items-center justify-center" prefetch={false}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 text-primary"
          >
            <path d="M12 18L12 6" />
            <path d="M4 12H20" />
          </svg>
          <span className="ml-2 text-lg font-semibold">SPAT</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/login" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Login
          </Link>
          <Link href="/signup" prefetch={false}>
            <Button size="sm">Sign Up</Button>
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Master the SAT with Adaptive Practice
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    SPAT delivers personalized SAT preparation. Our adaptive engine adjusts question difficulty based on your performance, ensuring efficient and effective learning.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                   <Link href="/signup" prefetch={false}>
                    <Button size="lg">Get Started for Free</Button>
                  </Link>
                   <Link href="#features" prefetch={false}>
                      <Button variant="outline" size="lg">
                        Learn More
                      </Button>
                  </Link>
                </div>
              </div>
                 <img
                  src="https://picsum.photos/600/400?random=1" // Placeholder image
                  width="600"
                  height="400"
                  alt="Hero"
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
                />
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Tailored Prep for SAT Success</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  SPAT provides the tools you need to excel. From adaptive tests to detailed explanations, we've got you covered.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
                <div className="flex flex-col justify-center space-y-4 items-center text-center p-4 rounded-lg border bg-card shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10 text-primary"><path d="M2 18v-2c0-1.1.9-2 2-2h16a2 2 0 0 1 2 2v2" /><path d="M2 12V7c0-1.1.9-2 2-2h16a2 2 0 0 1 2 2v5" /><path d="M12 12v-2" /><path d="M12 18v-2" /></svg>
                  <h3 className="text-xl font-bold">Adaptive Testing</h3>
                  <p className="text-muted-foreground">
                    Practice tests that adjust difficulty based on your answers, maximizing learning efficiency.
                  </p>
                </div>
               <div className="flex flex-col justify-center space-y-4 items-center text-center p-4 rounded-lg border bg-card shadow-sm">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10 text-primary"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" /></svg>
                  <h3 className="text-xl font-bold">Detailed Explanations</h3>
                  <p className="text-muted-foreground">
                    Understand the reasoning behind every answer with clear, step-by-step explanations (Premium feature).
                  </p>
                </div>
                <div className="flex flex-col justify-center space-y-4 items-center text-center p-4 rounded-lg border bg-card shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10 text-primary"><line x1="18" x2="18" y1="20" y2="10" /><line x1="12" x2="12" y1="20" y2="4" /><line x1="6" x2="6" y1="20" y2="14" /></svg>
                  <h3 className="text-xl font-bold">Performance Analytics</h3>
                  <p className="text-muted-foreground">
                    Track your progress and identify areas needing improvement with insightful results summaries.
                  </p>
                </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 border-t">
            <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Ready to Boost Your SAT Score?</h2>
                <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Sign up today and start your adaptive SAT preparation journey with SPAT.
                </p>
            </div>
            <div className="flex justify-center">
                <Link href="/signup" prefetch={false}>
                <Button size="lg">Start Practicing Now</Button>
                </Link>
            </div>
            </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 SPAT. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}

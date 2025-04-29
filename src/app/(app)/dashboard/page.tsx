'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/context/AuthContext';
import { FileText, BarChart3, BookOpen, Zap, User, LogIn } from 'lucide-react'; // Added User and LogIn icons

export default function DashboardPage() {
  const { currentUser, isGuest } = useAuth();

  // Placeholder data - replace with actual user data fetching if logged in
  const recentScore = 1350; // Example score
  const testsTaken = 5;
  const progressPercent = 60; // Example progress

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
         <h1 className="text-3xl font-bold">
             {isGuest ? 'Welcome, Guest!' : `Welcome back, ${currentUser?.displayName || currentUser?.email || 'Student'}!`}
         </h1>
        <p className="text-muted-foreground">
             {isGuest ? 'Explore SPAT or sign up to save your progress.' : "Here's your SAT prep overview."}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Quick Actions */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Jump right into your prep.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Link href="/practice" passHref legacyBehavior> {/* Changed link to practice overview */}
              <Button className="w-full justify-start gap-2">
                 <Zap className="h-4 w-4" /> Start Practice
              </Button>
            </Link>
             {/* Removed specific section links for simplicity */}
            <Link href="/materials" passHref legacyBehavior>
              <Button variant="outline" className="w-full justify-start gap-2">
                <BookOpen className="h-4 w-4" /> Browse Study Materials
              </Button>
            </Link>
             {isGuest && (
                 <Link href="/signup" passHref legacyBehavior>
                    <Button variant="default" className="w-full justify-start gap-2 mt-2 bg-green-600 hover:bg-green-700 text-white">
                         <User className="h-4 w-4" /> Create Account to Save Progress
                     </Button>
                 </Link>
             )}
          </CardContent>
        </Card>

        {/* Recent Performance - Show differently for guests */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Performance</CardTitle>
             <CardDescription>
                 {isGuest ? 'Sign up to track your scores.' : 'Your latest mock test result.'}
             </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
             {isGuest ? (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <BarChart3 className="h-10 w-10" />
                    <p>Log in to see your test results here.</p>
                     <Link href="/login" passHref legacyBehavior>
                         <Button variant="link" className="mt-2">Login</Button>
                    </Link>
                </div>
             ) : recentScore ? (
                 <>
                    <p className="text-4xl font-bold">{recentScore}</p>
                    <p className="text-sm text-muted-foreground mt-1">out of 1600</p>
                    <Link href="/results" passHref legacyBehavior>
                         <Button variant="link" className="mt-2">View Detailed Results</Button>
                    </Link>
                 </>
             ) : (
                <p className="text-muted-foreground">No recent tests taken.</p>
             )}
          </CardContent>
        </Card>

        {/* Overall Progress - Show differently for guests */}
        <Card>
          <CardHeader>
            <CardTitle>Overall Progress</CardTitle>
            <CardDescription>
                {isGuest ? 'Track your learning journey.' : 'Based on completed practice.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
             {isGuest ? (
                 <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Progress value={0} className="mb-2 w-full" aria-label="Progress bar for guests"/>
                     <p>Sign up to track your progress.</p>
                     <Link href="/signup" passHref legacyBehavior>
                         <Button variant="link" className="mt-2">Sign Up</Button>
                    </Link>
                 </div>
             ) : (
                 <>
                    <Progress value={progressPercent} className="mb-2 w-full" />
                     <p className="text-sm text-muted-foreground">{progressPercent}% towards mastery (example)</p>
                     <p className="text-xs text-muted-foreground mt-2">Tests Taken: {testsTaken}</p>
                 </>
             )}
          </CardContent>
        </Card>

         {/* Subscription/Account Status */}
         <Card className="md:col-span-2 lg:col-span-1">
           <CardHeader>
             <CardTitle>{isGuest ? 'Account Status' : 'Subscription'}</CardTitle>
             <CardDescription>{isGuest ? 'Log in or sign up for full features.' : 'Your current plan details.'}</CardDescription>
           </CardHeader>
           <CardContent>
             {isGuest ? (
                 <div className="flex flex-col gap-3 items-center">
                    <p className="font-semibold">Guest User</p>
                    <p className="text-sm text-muted-foreground text-center">
                        Sign up for free to save practice results and track progress. Upgrade later for full explanations and analytics.
                    </p>
                     <div className="flex gap-3 w-full mt-2">
                          <Link href="/login" passHref legacyBehavior className="flex-1">
                             <Button size="sm" variant="outline" className="w-full">Login</Button>
                          </Link>
                          <Link href="/signup" passHref legacyBehavior className="flex-1">
                             <Button size="sm" className="w-full">Sign Up</Button>
                           </Link>
                     </div>
                 </div>
             ) : (
                 <>
                    <p className="font-semibold capitalize">{currentUser?.subscriptionTier} Plan</p>
                     {currentUser?.subscriptionTier === 'free' && (
                         <p className="text-sm text-muted-foreground mt-2">
                             Upgrade to unlock unlimited tests and detailed explanations.
                         </p>
                     )}
                     {currentUser?.subscriptionTier !== 'high-end' ? (
                        <Link href="/billing" passHref legacyBehavior>
                             <Button size="sm" className="mt-4 w-full">Manage Subscription</Button>
                         </Link>
                     ) : (
                         <p className="text-sm text-green-600 mt-2">You have access to all features!</p>
                     )}
                 </>
             )}
           </CardContent>
         </Card>
      </div>
    </div>
  );
}

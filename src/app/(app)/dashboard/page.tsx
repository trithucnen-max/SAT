'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/context/AuthContext';
import { FileText, BarChart3, BookOpen, Zap } from 'lucide-react';

export default function DashboardPage() {
  const { currentUser } = useAuth();

  // Placeholder data - replace with actual user data fetching
  const recentScore = 1350; // Example score
  const testsTaken = 5;
  const progressPercent = 60; // Example progress

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome back, {currentUser?.displayName || currentUser?.email || 'Student'}!</h1>
        <p className="text-muted-foreground">Here's your SAT prep overview.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Quick Actions */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Jump right into your prep.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Link href="/practice/new" passHref legacyBehavior>
              <Button className="w-full justify-start gap-2">
                 <Zap className="h-4 w-4" /> Start New Practice Test
              </Button>
            </Link>
             <Link href="/practice/reading" passHref legacyBehavior>
              <Button variant="outline" className="w-full justify-start gap-2">
                Focus on Reading
              </Button>
            </Link>
            <Link href="/materials" passHref legacyBehavior>
              <Button variant="outline" className="w-full justify-start gap-2">
                <BookOpen className="h-4 w-4" /> Browse Study Materials
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Performance</CardTitle>
             <CardDescription>Your latest mock test result.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
             {recentScore ? (
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

        {/* Overall Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Overall Progress</CardTitle>
            <CardDescription>Based on completed practice.</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={progressPercent} className="mb-2" />
            <p className="text-sm text-muted-foreground text-center">{progressPercent}% towards mastery (example)</p>
             <p className="text-xs text-muted-foreground text-center mt-2">Tests Taken: {testsTaken}</p>
          </CardContent>
        </Card>

         {/* Subscription Status */}
         <Card className="md:col-span-2 lg:col-span-1">
           <CardHeader>
             <CardTitle>Subscription</CardTitle>
             <CardDescription>Your current plan details.</CardDescription>
           </CardHeader>
           <CardContent>
             <p className="font-semibold capitalize">{currentUser?.subscriptionTier} Plan</p>
             {currentUser?.subscriptionTier === 'free' && (
                 <p className="text-sm text-muted-foreground mt-2">
                     Upgrade to unlock all features, unlimited tests, and detailed explanations.
                 </p>
             )}
              {currentUser?.subscriptionTier !== 'high-end' && (
                <Link href="/billing" passHref legacyBehavior>
                    <Button size="sm" className="mt-4 w-full">Manage Subscription</Button>
                </Link>
              )}
                {currentUser?.subscriptionTier === 'high-end' && (
                     <p className="text-sm text-green-600 mt-2">You have access to all features!</p>
                )}
           </CardContent>
         </Card>
      </div>
    </div>
  );
}

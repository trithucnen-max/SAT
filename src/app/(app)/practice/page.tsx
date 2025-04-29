'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Zap, Clock } from 'lucide-react';

export default function PracticePage() {
  // TODO: Fetch user's test history or available tests

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Practice Tests</h1>
        <p className="text-muted-foreground">Choose your practice mode or start a full mock test.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Start Full Mock Test */}
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
               <Zap className="h-5 w-5 text-primary" />
              Full Mock Test
            </CardTitle>
            <CardDescription>Simulate the complete SAT experience.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">Includes Reading, Writing & Language, and Math sections. Adaptive difficulty based on your performance.</p>
             <Link href="/practice/test/full" passHref legacyBehavior>
                 <Button className="w-full">Start Full Test</Button>
             </Link>
          </CardContent>
        </Card>

        {/* Section Practice */}
        <Card className="md:col-span-2 lg:col-span-2 hover:shadow-md transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Focused Practice
            </CardTitle>
            <CardDescription>Target specific sections or topics.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Reading Practice */}
                <div className="flex flex-col items-center gap-2 p-4 border rounded-lg bg-background">
                    <h3 className="font-semibold">Reading</h3>
                    <p className="text-xs text-muted-foreground text-center">Practice passages and comprehension questions.</p>
                    <Link href="/practice/test/reading" passHref legacyBehavior>
                        <Button size="sm" variant="outline" className="mt-2 w-full">Practice Reading</Button>
                    </Link>
                </div>
                 {/* Writing Practice */}
                <div className="flex flex-col items-center gap-2 p-4 border rounded-lg bg-background">
                    <h3 className="font-semibold">Writing & Language</h3>
                    <p className="text-xs text-muted-foreground text-center">Improve grammar, style, and expression.</p>
                     <Link href="/practice/test/writing" passHref legacyBehavior>
                        <Button size="sm" variant="outline" className="mt-2 w-full">Practice Writing</Button>
                    </Link>
                </div>
                 {/* Math Practice */}
                <div className="flex flex-col items-center gap-2 p-4 border rounded-lg bg-background">
                    <h3 className="font-semibold">Math</h3>
                    <p className="text-xs text-muted-foreground text-center">Sharpen your skills in algebra, data analysis, and more.</p>
                     <Link href="/practice/test/math" passHref legacyBehavior>
                        <Button size="sm" variant="outline" className="mt-2 w-full">Practice Math</Button>
                    </Link>
                </div>
          </CardContent>
        </Card>

         {/* Test History (Placeholder) */}
        <Card className="lg:col-span-3">
             <CardHeader>
                 <CardTitle className="flex items-center gap-2">
                     <Clock className="h-5 w-5 text-primary" />
                     Test History
                 </CardTitle>
                 <CardDescription>Review your past practice sessions.</CardDescription>
            </CardHeader>
             <CardContent>
                {/* TODO: List past tests here */}
                 <p className="text-muted-foreground text-sm">Your previous test results will appear here.</p>
                 <Link href="/results" passHref legacyBehavior>
                     <Button variant="link" className="p-0 h-auto mt-2">View all results</Button>
                 </Link>
            </CardContent>
         </Card>

      </div>
    </div>
  );
}

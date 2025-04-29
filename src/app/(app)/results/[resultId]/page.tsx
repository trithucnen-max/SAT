'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle, XCircle, Info, ArrowLeft, LogIn } from 'lucide-react'; // Added LogIn icon
import { useAuth, SubscriptionTier, AppUser } from '@/context/AuthContext'; // Import AppUser type

// --- Mock Data & Types ---
// These should match the structure used when saving results

interface AnswerDetail {
  questionId: string;
  questionText: string;
  userAnswerId: string | null; // ID of the option the user selected
  correctAnswerId: string;
  explanation: string;
  options: { id: string; text: string }[];
  isCorrect: boolean;
  section: 'Reading' | 'Writing' | 'Math';
}

interface TestResultDetails {
  id: string; // Result ID
  testType: 'Full' | 'Reading' | 'Writing' | 'Math';
  dateCompleted: Date;
  score: number; // Percentage
  totalQuestions: number;
  correctAnswers: number;
  answers: AnswerDetail[];
  userId?: string; // Optional: To verify ownership if needed
}

// Mock function to fetch detailed results (replace with actual API call)
async function fetchDetailedTestResult(resultId: string): Promise<TestResultDetails | null> {
  console.log("Fetching details for result:", resultId);
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // In a real app, fetch from Firestore using resultId and potentially check ownership
  const mockResults: { [key: string]: TestResultDetails } = {
      'result1': {
        id: 'result1',
        testType: 'Full',
        dateCompleted: new Date(Date.now() - 86400000),
        score: 75,
        totalQuestions: 4,
        correctAnswers: 3,
        userId: 'mockUserId1', // Example owner
        answers: [
            { questionId: 'm1', questionText: 'If 2x + 3 = 7, what is x?', userAnswerId: 'm1b', correctAnswerId: 'm1b', explanation: '2x = 4, x = 2', options: [{id: 'm1a', text: '1'}, {id: 'm1b', text: '2'}, {id: 'm1c', text: '3'}, {id: 'm1d', text: '4'}], isCorrect: true, section: 'Math' },
            { questionId: 'r1', questionText: 'What is the main idea of the passage?', userAnswerId: 'r1a', correctAnswerId: 'r1c', explanation: 'The main idea is C because...', options: [{id: 'r1a', text: 'Option A'}, {id: 'r1b', text: 'Option B'}, {id: 'r1c', text: 'Correct C'}, {id: 'r1d', text: 'Option D'}], isCorrect: false, section: 'Reading' },
            { questionId: 'w1', questionText: 'Choose the best correction: dog, chased the ball.', userAnswerId: 'w1d', correctAnswerId: 'w1d', explanation: 'Explanation for W1...', options: [{id: 'w1a', text: 'dog chased'}, {id: 'w1b', text: 'dog, chased,'}, {id: 'w1c', text: 'dog chased,'}, {id: 'w1d', text: 'dog chased'}], isCorrect: true, section: 'Writing' },
            { questionId: 'm2', questionText: 'What is the area of a circle with radius 3?', userAnswerId: 'm2b', correctAnswerId: 'm2b', explanation: 'Area = πr², so π(3)² = 9π', options: [{id: 'm2a', text: '6π'}, {id: 'm2b', text: '9π'}, {id: 'm2c', text: '3π'}, {id: 'm2d', text: '27π'}], isCorrect: true, section: 'Math' },
        ],
      },
      'result2': {
         id: 'result2',
         testType: 'Math',
         dateCompleted: new Date(Date.now() - 3 * 86400000),
         score: 90,
         totalQuestions: 10,
         correctAnswers: 9,
         userId: 'mockUserId1',
         answers: [], // Empty for simplicity in mock
       },
       'result3': {
         id: 'result3',
         testType: 'Reading',
         dateCompleted: new Date(Date.now() - 7 * 86400000),
         score: 60,
         totalQuestions: 5,
         correctAnswers: 3,
          userId: 'mockUserId2', // Different owner
         answers: [], // Empty for simplicity in mock
       },
       'latest': { // Alias for result1
         id: 'result1',
         testType: 'Full',
         dateCompleted: new Date(Date.now() - 86400000),
         score: 75,
         totalQuestions: 4,
         correctAnswers: 3,
          userId: 'mockUserId1',
         answers: [
            { questionId: 'm1', questionText: 'If 2x + 3 = 7, what is x?', userAnswerId: 'm1b', correctAnswerId: 'm1b', explanation: '2x = 4, x = 2', options: [{id: 'm1a', text: '1'}, {id: 'm1b', text: '2'}, {id: 'm1c', text: '3'}, {id: 'm1d', text: '4'}], isCorrect: true, section: 'Math' },
            { questionId: 'r1', questionText: 'What is the main idea of the passage?', userAnswerId: 'r1a', correctAnswerId: 'r1c', explanation: 'The main idea is C because...', options: [{id: 'r1a', text: 'Option A'}, {id: 'r1b', text: 'Option B'}, {id: 'r1c', text: 'Correct C'}, {id: 'r1d', text: 'Option D'}], isCorrect: false, section: 'Reading' },
            { questionId: 'w1', questionText: 'Choose the best correction: dog, chased the ball.', userAnswerId: 'w1d', correctAnswerId: 'w1d', explanation: 'Explanation for W1...', options: [{id: 'w1a', text: 'dog chased'}, {id: 'w1b', text: 'dog, chased,'}, {id: 'w1c', text: 'dog chased,'}, {id: 'w1d', text: 'dog chased'}], isCorrect: true, section: 'Writing' },
            { questionId: 'm2', questionText: 'What is the area of a circle with radius 3?', userAnswerId: 'm2b', correctAnswerId: 'm2b', explanation: 'Area = πr², so π(3)² = 9π', options: [{id: 'm2a', text: '6π'}, {id: 'm2b', text: '9π'}, {id: 'm2c', text: '3π'}, {id: 'm2d', text: '27π'}], isCorrect: true, section: 'Math' },
         ],
       },
  };

  return mockResults[resultId] || null; // Result not found
}

// --- Component ---

export default function ResultDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { currentUser, isGuest, loading: authLoading } = useAuth();
  const resultId = params.resultId as string;

  const [resultDetails, setResultDetails] = useState<TestResultDetails | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    if (authLoading || !resultId) return; // Wait for auth state and resultId

    if (isGuest) {
      // Guests cannot view detailed results
       setAccessDenied(true);
       setLoadingData(false);
       return;
    }

     // Logged-in user, proceed to fetch data
     setAccessDenied(false);
     const loadResultDetails = async () => {
        setLoadingData(true);
        setError(null);
        try {
            const details = await fetchDetailedTestResult(resultId);
            if (details) {
                // Optional: Check if currentUser.uid matches details.userId if privacy is strict
                // if (details.userId && details.userId !== currentUser?.uid) {
                //   setError("You do not have permission to view this result.");
                //   setResultDetails(null);
                // } else {
                setResultDetails(details);
                // }
            } else {
                setError("Test result not found.");
                 setResultDetails(null);
            }
        } catch (err) {
            console.error("Failed to load result details:", err);
            setError("Could not load the test result details. Please try again later.");
             setResultDetails(null);
        } finally {
            setLoadingData(false);
        }
        };
        loadResultDetails();
  }, [resultId, isGuest, authLoading, currentUser?.uid]); // Add currentUser?.uid if ownership check is needed


  const getOptionTextById = (options: AnswerDetail['options'], id: string | null): string => {
      if (!id) return 'Not Answered';
      return options.find(opt => opt.id === id)?.text || 'Unknown Option';
  }

   // Determine if the current user can view explanations based on their tier
  const canViewExplanation = !isGuest && (currentUser?.subscriptionTier === 'premium' || currentUser?.subscriptionTier === 'high-end');

  // Combined loading state
   const isLoading = authLoading || loadingData;

   if (isLoading) {
     return (
       <div className="container mx-auto py-8">
         <Skeleton className="h-8 w-1/4 mb-2" />
         <Skeleton className="h-5 w-1/2 mb-8" />
         <Card>
            <CardHeader><Skeleton className="h-6 w-1/3" /></CardHeader>
             <CardContent className="grid grid-cols-3 gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </CardContent>
         </Card>
         <Card className="mt-6">
             <CardHeader><Skeleton className="h-6 w-1/4" /></CardHeader>
             <CardContent className="space-y-4">
                 <Skeleton className="h-20 w-full" />
                 <Skeleton className="h-20 w-full" />
                 <Skeleton className="h-20 w-full" />
             </CardContent>
         </Card>
       </div>
     );
   }

    if (accessDenied) {
        return (
            <div className="container mx-auto py-8 text-center">
                <Card className="max-w-md mx-auto">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-center gap-2">
                            <LogIn className="h-6 w-6" /> Access Required
                        </CardTitle>
                        <CardDescription>
                             Please log in or sign up to view detailed test results and explanations.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <Link href="/login" passHref legacyBehavior>
                             <Button className="w-full">Login</Button>
                        </Link>
                         <Link href="/signup" passHref legacyBehavior>
                            <Button variant="outline" className="w-full">Sign Up</Button>
                        </Link>
                         <Button variant="ghost" onClick={() => router.back()} className="mt-2">
                           <ArrowLeft className="mr-2 h-4 w-4"/> Back
                         </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }


  if (error) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p className="text-destructive mb-4">{error}</p>
        <Link href="/results" passHref legacyBehavior>
             <Button variant="outline"> <ArrowLeft className="mr-2 h-4 w-4"/> Back to Results List</Button>
         </Link>
      </div>
    );
  }

  if (!resultDetails) {
    // This case handles not found after loading/auth check
    return (
        <div className="container mx-auto py-8 text-center">
            <p className="text-muted-foreground mb-4">Test result details not available.</p>
             <Link href="/results" passHref legacyBehavior>
                 <Button variant="outline"> <ArrowLeft className="mr-2 h-4 w-4"/> Back to Results List</Button>
             </Link>
        </div>
    );
  }

   // Filter out questions if answers array is empty (for mock data simplicity)
   const detailedAnswers = resultDetails.answers.filter(a => a.questionId);

  return (
    <div className="container mx-auto py-8">
       <Button variant="outline" size="sm" onClick={() => router.push('/results')} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4"/> Back to Results List
       </Button>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Test Results: {resultDetails.testType}</h1>
        <p className="text-muted-foreground">Completed on: {resultDetails.dateCompleted.toLocaleDateString()}</p>
      </div>

      {/* Summary Card */}
      <Card className="mb-6 bg-secondary border-primary/20">
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Overall Score</p>
            <p className="text-2xl font-bold text-primary">{resultDetails.score}%</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Correct Answers</p>
            <p className="text-2xl font-bold">{resultDetails.correctAnswers}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Questions</p>
            <p className="text-2xl font-bold">{resultDetails.totalQuestions}</p>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Answers Section */}
       {detailedAnswers.length > 0 ? (
        <Card>
            <CardHeader>
                <CardTitle>Detailed Review</CardTitle>
                <CardDescription>Review each question, your answer, and the correct explanation.</CardDescription>
            </CardHeader>
            <CardContent>
            <Accordion type="single" collapsible className="w-full">
                {detailedAnswers.map((answer, index) => (
                <AccordionItem key={answer.questionId} value={`item-${index}`}>
                    <AccordionTrigger className={`flex justify-between items-center hover:no-underline ${!answer.isCorrect ? 'text-destructive hover:text-destructive/90' : 'text-green-600 hover:text-green-600/90'}`}>
                    <div className="flex items-center gap-2 text-left">
                        {answer.isCorrect ? <CheckCircle className="h-5 w-5 text-green-600" /> : <XCircle className="h-5 w-5 text-destructive" />}
                        <span>Question {index + 1} ({answer.section})</span>
                    </div>
                    {/* Optional: Add badge for difficulty? */}
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 pb-2 px-2 space-y-4">
                        <p className="font-medium">{answer.questionText}</p>
                        <div className="text-sm space-y-1">
                            <p><strong>Your Answer:</strong> <span className={!answer.isCorrect ? 'text-destructive' : ''}>{getOptionTextById(answer.options, answer.userAnswerId)}</span></p>
                            <p><strong>Correct Answer:</strong> <span className="text-green-600">{getOptionTextById(answer.options, answer.correctAnswerId)}</span></p>
                        </div>
                         <div className="mt-3 p-3 border rounded-md bg-accent/10 border-accent/30">
                            <h4 className="font-semibold text-accent-foreground flex items-center gap-1 mb-2 text-sm"><Info size={16} /> Explanation</h4>
                            {canViewExplanation ? (
                                <p className="text-sm text-accent-foreground/90">{answer.explanation}</p>
                            ) : (
                                <div className="text-sm text-accent-foreground/80 flex items-center justify-between">
                                     {/* Different message for logged-in free users vs potential (but blocked) guests */}
                                     {isGuest ? (
                                         <span>Detailed explanation available for registered users.</span>
                                     ) : (
                                        <span>Detailed explanation available for Premium users.</span>
                                     )}

                                     {!isGuest && ( // Show upgrade only if logged in and not premium/high-end
                                         <Link href="/billing" passHref legacyBehavior>
                                             <Button variant="link" size="sm" className="text-accent-foreground underline h-auto p-0">Upgrade Now</Button>
                                         </Link>
                                     )}
                                     {isGuest && ( // Show login/signup if guest
                                         <Link href="/login" passHref legacyBehavior>
                                             <Button variant="link" size="sm" className="text-accent-foreground underline h-auto p-0">Login/Sign Up</Button>
                                         </Link>
                                     )}
                                </div>
                            )}
                        </div>
                    </AccordionContent>
                </AccordionItem>
                ))}
            </Accordion>
            </CardContent>
        </Card>
        ) : (
            <Card>
                <CardHeader>
                    <CardTitle>Detailed Review</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-sm">Detailed answer review is not available for this test result (mock data might be incomplete).</p>
                </CardContent>
            </Card>
        )}
    </div>
  );
}

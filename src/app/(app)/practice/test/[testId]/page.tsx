'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton'; // For loading state
import { Clock, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { useAuth, SubscriptionTier } from '@/context/AuthContext'; // Import subscription tier


// --- Mock Data & Types ---
// Replace with actual data fetching and types from Firestore/Backend

interface QuestionOption {
  id: string;
  text: string;
}

interface Question {
  id: string;
  section: 'Reading' | 'Writing' | 'Math';
  passage?: string; // Optional passage for Reading/Writing
  text: string;
  options: QuestionOption[];
  correctAnswerId: string;
  explanation: string;
  difficulty: number; // e.g., 1 (easy) to 5 (hard)
}

// Mock function to fetch questions (replace with actual API call)
// Simulates adaptive logic based on performance (very basic)
async function fetchQuestions(testType: string, currentDifficulty: number, answeredCorrectly?: boolean): Promise<Question[]> {
    console.log(`Fetching questions for ${testType}, difficulty: ${currentDifficulty}, answered correctly: ${answeredCorrectly}`);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Basic adaptive logic: Adjust difficulty slightly based on the last answer
    let nextDifficulty = currentDifficulty;
    if (answeredCorrectly === true) {
        nextDifficulty = Math.min(5, currentDifficulty + 0.5); // Increase difficulty slightly, max 5
    } else if (answeredCorrectly === false) {
        nextDifficulty = Math.max(1, currentDifficulty - 0.5); // Decrease difficulty slightly, min 1
    }
     const roundedDifficulty = Math.round(nextDifficulty);


    // In a real app, fetch questions from Firestore based on testType and roundedDifficulty
    const allQuestions: Question[] = [
        // Add ~10-20 diverse mock questions here covering different sections and difficulties
         { id: 'r1', section: 'Reading', passage: "The passage discusses the impact of...", text: 'What is the main idea of the passage?', options: [{id: 'r1a', text: 'Option A'}, {id: 'r1b', text: 'Option B'}, {id: 'r1c', text: 'Correct C'}, {id: 'r1d', text: 'Option D'}], correctAnswerId: 'r1c', explanation: 'Explanation for R1...', difficulty: 2 },
         { id: 'w1', section: 'Writing', passage: "Sentence: The dog, chased the ball.", text: 'Choose the best correction:', options: [{id: 'w1a', text: 'dog chased'}, {id: 'w1b', text: 'dog, chased,'}, {id: 'w1c', text: 'dog chased,'}, {id: 'w1d', text: 'Correct: dog chased'}], correctAnswerId: 'w1d', explanation: 'Explanation for W1...', difficulty: 1 },
         { id: 'm1', section: 'Math', text: 'If 2x + 3 = 7, what is x?', options: [{id: 'm1a', text: '1'}, {id: 'm1b', text: 'Correct: 2'}, {id: 'm1c', text: '3'}, {id: 'm1d', text: '4'}], correctAnswerId: 'm1b', explanation: '2x = 4, x = 2', difficulty: 1 },
         { id: 'r2', section: 'Reading', passage: "Continued passage...", text: 'According to the passage, why did X happen?', options: [{id: 'r2a', text: 'Reason A'}, {id: 'r2b', text: 'Correct B'}, {id: 'r2c', text: 'Reason C'}, {id: 'r2d', text: 'Reason D'}], correctAnswerId: 'r2b', explanation: 'Explanation for R2...', difficulty: 3 },
         { id: 'm2', section: 'Math', text: 'What is the area of a circle with radius 3?', options: [{id: 'm2a', text: '6π'}, {id: 'm2b', text: 'Correct: 9π'}, {id: 'm2c', text: '3π'}, {id: 'm2d', text: '27π'}], correctAnswerId: 'm2b', explanation: 'Area = πr², so π(3)² = 9π', difficulty: 2 },
        // ... add more questions
         { id: 'm3', section: 'Math', text: 'Solve for y: 3y - 5 = 10', options: [{id: 'm3a', text: '3'}, {id: 'm3b', text: '4'}, {id: 'm3c', text: 'Correct: 5'}, {id: 'm3d', text: '6'}], correctAnswerId: 'm3c', explanation: '3y = 15, y = 5', difficulty: 2 },
         { id: 'w2', section: 'Writing', text: 'Which choice best combines the sentences? Sentence 1. Sentence 2.', options: [{id: 'w2a', text: 'Combination A'}, {id: 'w2b', text: 'Combination B'}, {id: 'w2c', text: 'Correct C'}, {id: 'w2d', text: 'Combination D'}], correctAnswerId: 'w2c', explanation: 'Explanation for W2...', difficulty: 3 },
          { id: 'r3', section: 'Reading', passage: "Another passage...", text: 'The word "ephemeral" in line X most nearly means?', options: [{id: 'r3a', text: 'Correct: short-lived'}, {id: 'r3b', text: 'everlasting'}, {id: 'r3c', text: 'complex'}, {id: 'r3d', text: 'beautiful'}], correctAnswerId: 'r3a', explanation: 'Explanation for R3...', difficulty: 4 },
          { id: 'm4', section: 'Math', text: 'A triangle has sides 3, 4, and 5. What type of triangle is it?', options: [{id: 'm4a', text: 'Acute'}, {id: 'm4b', text: 'Obtuse'}, {id: 'm4c', text: 'Equilateral'}, {id: 'm4d', text: 'Correct: Right'}], correctAnswerId: 'm4d', explanation: 'Satisfies Pythagorean theorem: 3² + 4² = 9 + 16 = 25 = 5²', difficulty: 3 },
         { id: 'm5', section: 'Math', text: 'What is 15% of 80?', options: [{id: 'm5a', text: '10'}, {id: 'm5b', text: 'Correct: 12'}, {id: 'm5c', text: '15'}, {id: 'm5d', text: '16'}], correctAnswerId: 'm5b', explanation: '0.15 * 80 = 12', difficulty: 2 },

    ];

     // Filter questions roughly matching the target difficulty and test type (if not 'full')
     const filteredQuestions = allQuestions.filter(q =>
        (testType === 'full' || q.section.toLowerCase() === testType) &&
        Math.abs(q.difficulty - roundedDifficulty) <= 1 // Allow some variance
     );

    // Return a small batch (e.g., 5 questions) - adjust as needed
    return filteredQuestions.sort(() => 0.5 - Math.random()).slice(0, 5);
}

// Mock function to submit results (replace with actual API call)
async function submitTestResults(testId: string, answers: Map<string, string>, score: number): Promise<{ success: boolean; resultsId?: string }> {
  console.log('Submitting results for test:', testId, answers, score);
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
  // In a real app, save to Firestore and return the results document ID
  return { success: true, resultsId: `results_${testId}_${Date.now()}` };
}

// --- Component ---

export default function TestTakingPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { currentUser } = useAuth();

  const testId = params.testId as string; // e.g., 'full', 'reading', 'math'
  const testTitle = testId.charAt(0).toUpperCase() + testId.slice(1); // Capitalize

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentDifficulty, setCurrentDifficulty] = useState(3); // Start at medium difficulty
  const [showExplanation, setShowExplanation] = useState(false);

  // --- Timer Logic ---
  const initialTime = testId === 'full' ? 180 * 60 : 60 * 60; // 3 hours for full, 1 hour for sections (example)
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (timeLeft <= 0) {
        handleSubmit(true); // Force submit when time runs out
        return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);
    return () => clearInterval(timer); // Cleanup timer
  }, [timeLeft]); // Removed handleSubmit dependency


  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs > 0 ? hrs + ':' : ''}${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  // --- End Timer Logic ---


  // Fetch initial questions
  useEffect(() => {
    const loadQuestions = async () => {
      setLoading(true);
      try {
        const initialQuestions = await fetchQuestions(testId, currentDifficulty);
        setQuestions(initialQuestions);
        // Reset answers when questions load (prevents carrying over answers if user navigates back/forth quickly)
        setUserAnswers(new Map());
        setShowExplanation(false); // Hide explanation for new question
      } catch (error) {
        console.error("Failed to load questions:", error);
        toast({ title: 'Error', description: 'Could not load questions.', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    loadQuestions();
  }, [testId]); // Only re-fetch if the testId changes


   const handleAnswerSelect = (questionId: string, selectedOptionId: string) => {
      setUserAnswers(prev => new Map(prev).set(questionId, selectedOptionId));
      setShowExplanation(false); // Hide explanation if user changes answer
  };

   const loadNextQuestion = async () => {
       const currentQuestion = questions[currentQuestionIndex];
       const userAnswerId = userAnswers.get(currentQuestion.id);
       const answeredCorrectly = userAnswerId === currentQuestion.correctAnswerId;

       // Show explanation if user has answered (and has access)
       setShowExplanation(!!userAnswerId);

       // Proceed to next question after a short delay or button click
       // For now, let's use the Next button

       if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setShowExplanation(false); // Hide explanation for the new question
       } else {
            // End of the current batch, fetch more questions adaptively
            setLoading(true);
            try {
                const nextQuestions = await fetchQuestions(testId, currentDifficulty, answeredCorrectly);
                if (nextQuestions.length > 0) {
                    // Append new questions or replace, depending on desired behavior
                    // For simplicity, let's replace the batch for now
                    setQuestions(nextQuestions);
                    setCurrentQuestionIndex(0); // Reset index for the new batch
                     // Adjust overall difficulty based on last answer of the batch
                    setCurrentDifficulty(prev => {
                        const newDiff = answeredCorrectly ? Math.min(5, prev + 0.5) : Math.max(1, prev - 0.5);
                        return newDiff;
                    });
                    setShowExplanation(false);
                } else {
                    // No more questions available for this difficulty/type
                    toast({ title: 'Test Complete', description: 'You have answered all available questions.' });
                    handleSubmit(); // Auto-submit if no more questions
                }
            } catch (error) {
                 console.error("Failed to load next questions:", error);
                toast({ title: 'Error', description: 'Could not load next questions.', variant: 'destructive' });
                 // Optionally allow submission of current answers
            } finally {
                setLoading(false);
            }
       }
   };

   const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
            setShowExplanation(false); // Hide explanation when going back
        }
    };


  const handleSubmit = async (timeUp = false) => {
    setSubmitting(true);
    // --- Calculate Score (Basic Example) ---
    let score = 0;
    questions.forEach((q) => {
      if (userAnswers.get(q.id) === q.correctAnswerId) {
        score++;
      }
    });
    const percentageScore = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
    // --- End Score Calculation ---

    try {
      // TODO: Submit userAnswers, score, timeLeft, etc. to backend (Firestore/Cloud Function)
      const result = await submitTestResults(testId, userAnswers, percentageScore);

      if (result.success) {
         toast({
            title: timeUp ? 'Time Expired!' : 'Test Submitted!',
            description: `Your score: ${score}/${questions.length} (${percentageScore}%)`,
            duration: 5000,
        });
        // Redirect to results page with the new results ID
        router.push(`/results/${result.resultsId || 'latest'}`);
      } else {
           throw new Error("Submission failed on the server.");
      }

    } catch (error) {
      console.error("Failed to submit test:", error);
      toast({ title: 'Submission Error', description: 'Could not submit your test results.', variant: 'destructive' });
      setSubmitting(false);
    }
    // No finally block needed as we redirect on success
  };


  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;
  const canShowExplanation = currentUser?.subscriptionTier === 'premium' || currentUser?.subscriptionTier === 'high-end';


  return (
    <div className="container mx-auto py-8 flex flex-col" style={{ minHeight: 'calc(100vh - 10rem)'}}>
        <Card className="w-full max-w-4xl mx-auto flex-grow flex flex-col">
            <CardHeader className="border-b pb-4">
             <div className="flex justify-between items-center mb-2">
                 <CardTitle className="text-2xl">{`${testTitle} Practice Test`}</CardTitle>
                    <div className="flex items-center gap-2 text-lg font-semibold text-primary">
                        <Clock className="h-5 w-5" />
                        <span>{formatTime(timeLeft)}</span>
                    </div>
                </div>
                <Progress value={progress} className="w-full" />
                 <p className="text-sm text-muted-foreground text-center mt-2">
                    Question {currentQuestionIndex + 1} of {questions.length} (Current Batch)
                 </p>
            </CardHeader>

            <CardContent className="py-6 px-4 md:px-6 flex-grow">
                {loading && !currentQuestion && (
                     <div className="space-y-4">
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-24 w-full" />
                        <div className="space-y-3 mt-4">
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-6 w-full" />
                        </div>
                    </div>
                )}

                {!loading && currentQuestion && (
                 <div>
                    {/* Optional Passage */}
                    {currentQuestion.passage && (
                        <div className="mb-6 p-4 bg-secondary rounded-md border">
                        <h3 className="font-semibold mb-2">Passage ({currentQuestion.section})</h3>
                        <p className="text-sm text-muted-foreground whitespace-pre-line">{currentQuestion.passage}</p>
                        </div>
                    )}

                    {/* Question Text */}
                    <p className="text-lg font-medium mb-6">{currentQuestion.text}</p>

                    {/* Options */}
                    <RadioGroup
                         value={userAnswers.get(currentQuestion.id) || ''}
                         onValueChange={(value) => handleAnswerSelect(currentQuestion.id, value)}
                         className="space-y-3"
                    >
                        {currentQuestion.options.map((option) => (
                        <div key={option.id} className="flex items-center space-x-3">
                            <RadioGroupItem value={option.id} id={`${currentQuestion.id}-${option.id}`} />
                            <Label htmlFor={`${currentQuestion.id}-${option.id}`} className="text-base font-normal cursor-pointer">
                                {option.text}
                            </Label>
                        </div>
                        ))}
                    </RadioGroup>

                     {/* Explanation Area */}
                     {showExplanation && (
                        <div className="mt-6 p-4 border rounded-md bg-accent/10 border-accent/30">
                            <h4 className="font-semibold text-accent-foreground flex items-center gap-1 mb-2"><Info size={16} /> Explanation</h4>
                            {canShowExplanation ? (
                                <p className="text-sm text-accent-foreground/90">{currentQuestion.explanation}</p>
                            ) : (
                                 <div className="text-sm text-accent-foreground/80 flex items-center justify-between">
                                    <span> Detailed explanation available for Premium users.</span>
                                     <Link href="/billing" passHref legacyBehavior>
                                         <Button variant="link" size="sm" className="text-accent-foreground underline h-auto p-0">Upgrade Now</Button>
                                     </Link>
                                </div>
                            )}
                             {/* Show Correct/Incorrect feedback */}
                             {userAnswers.get(currentQuestion.id) && (
                                 <p className={`text-sm font-medium mt-3 ${userAnswers.get(currentQuestion.id) === currentQuestion.correctAnswerId ? 'text-green-600' : 'text-destructive'}`}>
                                     Your answer is {userAnswers.get(currentQuestion.id) === currentQuestion.correctAnswerId ? 'correct' : 'incorrect'}.
                                 </p>
                             )}
                        </div>
                     )}
                 </div>
                )}
                 {!loading && questions.length === 0 && (
                    <p className="text-center text-muted-foreground">No questions loaded for this test type yet.</p>
                )}
            </CardContent>

            <CardFooter className="flex justify-between items-center border-t pt-4 mt-auto">
                <Button
                    variant="outline"
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0 || loading || submitting}
                    aria-label="Previous Question"
                 >
                    <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                 </Button>

                <div className="flex gap-2">
                     {/* Submit Button */}
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                             <Button variant="destructive" disabled={loading || submitting}>
                                Submit Test
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Submit your test?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to finish and submit your answers? This action cannot be undone.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel disabled={submitting}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleSubmit()} disabled={submitting}>
                                {submitting ? 'Submitting...' : 'Yes, Submit'}
                            </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                     {/* Next Button */}
                    <Button
                        onClick={loadNextQuestion}
                        disabled={!userAnswers.has(currentQuestion?.id) || loading || submitting}
                        aria-label="Next Question"
                    >
                        Next <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                 </div>
            </CardFooter>
        </Card>
    </div>
  );
}

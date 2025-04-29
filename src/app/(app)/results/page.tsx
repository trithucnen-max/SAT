'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton'; // For loading state
import { Eye } from 'lucide-react';

// --- Mock Data & Types ---
// Replace with actual data fetching from Firestore/Backend

interface TestResultSummary {
  id: string; // Unique ID for the result document
  testType: 'Full' | 'Reading' | 'Writing' | 'Math';
  dateCompleted: Date;
  score: number; // e.g., Percentage or scaled score
  totalQuestions: number;
  correctAnswers: number;
}

// Mock function to fetch results history (replace with actual API call)
async function fetchTestResultsHistory(): Promise<TestResultSummary[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // In a real app, fetch from Firestore, ordered by dateCompleted descending
  return [
    { id: 'result1', testType: 'Full', dateCompleted: new Date(Date.now() - 86400000), score: 75, totalQuestions: 5, correctAnswers: 4 }, // 1 day ago
    { id: 'result2', testType: 'Math', dateCompleted: new Date(Date.now() - 3 * 86400000), score: 90, totalQuestions: 10, correctAnswers: 9 }, // 3 days ago
    { id: 'result3', testType: 'Reading', dateCompleted: new Date(Date.now() - 7 * 86400000), score: 60, totalQuestions: 5, correctAnswers: 3 }, // 7 days ago
    // Add more mock results
  ];
}

// --- Component ---

export default function ResultsPage() {
  const [results, setResults] = useState<TestResultSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const history = await fetchTestResultsHistory();
        setResults(history);
      } catch (err) {
        console.error("Failed to load results history:", err);
        setError("Could not load your test results. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    loadResults();
  }, []);

  const getScoreBadgeVariant = (score: number): 'default' | 'secondary' | 'destructive' | 'outline' => {
     if (score >= 80) return 'default'; // Use primary color (blue in this theme) for high scores
     if (score >= 60) return 'outline'; // Use outline for medium scores
     return 'destructive'; // Use destructive (red) for lower scores
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Test Results</h1>
        <p className="text-muted-foreground">Review your past performance and identify areas for improvement.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Test History</CardTitle>
          <CardDescription>A summary of your completed practice tests.</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <p className="text-destructive text-center">{error}</p>}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Test Type</TableHead>
                <TableHead className="text-right">Score (%)</TableHead>
                <TableHead className="text-right">Accuracy</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && Array.from({ length: 3 }).map((_, index) => (
                <TableRow key={`loading-${index}`}>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-5 w-12 ml-auto" /></TableCell>
                   <TableCell className="text-right"><Skeleton className="h-5 w-20 ml-auto" /></TableCell>
                  <TableCell className="text-center"><Skeleton className="h-8 w-8 mx-auto rounded-md" /></TableCell>
                </TableRow>
              ))}
              {!loading && results.length === 0 && !error && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    You haven't completed any tests yet.
                     <Link href="/practice" passHref legacyBehavior>
                      <Button variant="link" className="ml-2">Start Practicing</Button>
                     </Link>
                  </TableCell>
                </TableRow>
              )}
              {!loading && results.map((result) => (
                <TableRow key={result.id}>
                  <TableCell>{result.dateCompleted.toLocaleDateString()}</TableCell>
                  <TableCell>{result.testType}</TableCell>
                  <TableCell className="text-right">
                      <Badge variant={getScoreBadgeVariant(result.score)}>{result.score}%</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                     {result.correctAnswers}/{result.totalQuestions}
                  </TableCell>
                  <TableCell className="text-center">
                     <Link href={`/results/${result.id}`} passHref legacyBehavior>
                      <Button variant="ghost" size="icon" aria-label="View Details">
                        <Eye className="h-4 w-4" />
                      </Button>
                     </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

        {/* Placeholder for Overall Analytics - Future Feature */}
        <Card className="mt-6">
             <CardHeader>
                 <CardTitle>Overall Analytics (Coming Soon)</CardTitle>
                 <CardDescription>Deeper insights into your strengths and weaknesses across all tests.</CardDescription>
            </CardHeader>
             <CardContent>
                 <p className="text-muted-foreground text-sm">This section will provide detailed performance breakdowns by topic and question type.</p>
             </CardContent>
        </Card>

    </div>
  );
}

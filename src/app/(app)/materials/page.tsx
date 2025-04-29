'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Lock, Unlock, BookOpen } from 'lucide-react';
import { useAuth, SubscriptionTier } from '@/context/AuthContext';
import Link from 'next/link';

// --- Mock Data & Types ---
// Replace with actual data fetching from Firestore/Backend

interface StudyMaterial {
  id: string;
  title: string;
  description: string;
  category: 'Study Guides' | 'Tips & Strategies' | 'Digital SAT Focus';
  requiredTier: SubscriptionTier; // Tier required to access fully
  previewAvailable: boolean; // Can free users see a preview?
  contentUrl?: string; // URL or path to the actual content (or ID for Firestore doc)
}

// Mock function to fetch study materials (replace with actual API call)
async function fetchStudyMaterials(): Promise<StudyMaterial[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));

  // In a real app, fetch from Firestore
  return [
    { id: 'sg1', title: 'Complete SAT Reading Guide', description: 'Comprehensive strategies for the reading section.', category: 'Study Guides', requiredTier: 'premium', previewAvailable: true, contentUrl: '/materials/sg1' },
    { id: 'ts1', title: 'Top 10 Math Shortcuts', description: 'Save time on the math sections with these tricks.', category: 'Tips & Strategies', requiredTier: 'free', previewAvailable: true, contentUrl: '/materials/ts1' },
    { id: 'dsf1', title: 'Navigating the Bluebook App', description: 'Master the interface of the official digital SAT app.', category: 'Digital SAT Focus', requiredTier: 'free', previewAvailable: true, contentUrl: '/materials/dsf1' },
    { id: 'sg2', title: 'Advanced Writing & Language Techniques', description: 'Refine your grammar and style for a top score.', category: 'Study Guides', requiredTier: 'premium', previewAvailable: true, contentUrl: '/materials/sg2' },
    { id: 'ts2', title: 'Time Management for Test Day', description: 'Strategies to pace yourself effectively during the exam.', category: 'Tips & Strategies', requiredTier: 'premium', previewAvailable: false, contentUrl: '/materials/ts2' },
     { id: 'dsf2', title: 'Understanding Adaptive Testing', description: 'How the digital SAT adjusts difficulty and what it means for you.', category: 'Digital SAT Focus', requiredTier: 'high-end', previewAvailable: true, contentUrl: '/materials/dsf2' },
     { id: 'sg3', title: 'Essay Writing Essentials (Optional SAT)', description: 'Guide for the optional SAT Essay section.', category: 'Study Guides', requiredTier: 'premium', previewAvailable: false, contentUrl: '/materials/sg3' },
     { id: 'ts3', title: 'Vocabulary Building for SAT Reading', description: 'Effective methods to expand your vocabulary.', category: 'Tips & Strategies', requiredTier: 'premium', previewAvailable: true, contentUrl: '/materials/ts3' },
  ];
}

// --- Component ---

export default function MaterialsPage() {
  const { currentUser } = useAuth();
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMaterials = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchStudyMaterials();
        setMaterials(data);
      } catch (err) {
        console.error("Failed to load study materials:", err);
        setError("Could not load study materials. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    loadMaterials();
  }, []);

  const userTierIndex = { free: 0, premium: 1, high-end: 2 };
  const currentTierIndex = userTierIndex[currentUser?.subscriptionTier || 'free'];

  const canAccess = (requiredTier: SubscriptionTier): boolean => {
      const requiredTierIndex = userTierIndex[requiredTier];
      return currentTierIndex >= requiredTierIndex;
  };

  const categories = ['Study Guides', 'Tips & Strategies', 'Digital SAT Focus'];

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Study Materials</h1>
        <p className="text-muted-foreground">Access guides, tips, and strategies to boost your SAT preparation.</p>
      </div>

      {error && <p className="text-destructive text-center mb-4">{error}</p>}

      {loading && (
         <div className="space-y-6">
            {categories.map(category => (
                <div key={category}>
                 <Skeleton className="h-7 w-1/3 mb-4" />
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                     {Array.from({ length: 3 }).map((_, index) => (
                        <Card key={`loading-${category}-${index}`}>
                            <CardHeader><Skeleton className="h-5 w-3/4" /></CardHeader>
                            <CardContent><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-5/6 mt-2" /></CardContent>
                            <CardFooter><Skeleton className="h-8 w-24 ml-auto" /></CardFooter>
                        </Card>
                     ))}
                  </div>
                </div>
            ))}
        </div>
      )}

      {!loading && !error && (
         <div className="space-y-8">
            {categories.map(category => (
                <section key={category}>
                    <h2 className="text-2xl font-semibold mb-4 pb-2 border-b flex items-center gap-2">
                         <BookOpen className="h-5 w-5 text-primary"/>
                        {category}
                    </h2>
                     <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                     {materials.filter(m => m.category === category).length > 0 ? (
                        materials.filter(m => m.category === category).map(material => {
                             const hasAccess = canAccess(material.requiredTier);
                             const showPreview = !hasAccess && material.previewAvailable;
                            return (
                            <Card key={material.id} className={`flex flex-col ${!hasAccess && !showPreview ? 'opacity-60' : 'hover:shadow-md transition-shadow'}`}>
                                <CardHeader>
                                <CardTitle className="text-lg">{material.title}</CardTitle>
                                <CardDescription>{material.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                 {/* Additional details can go here if needed */}
                                </CardContent>
                                <CardFooter className="flex justify-between items-center pt-4 border-t">
                                    <Badge variant={ hasAccess ? 'default' : 'secondary'} className="capitalize">
                                        {hasAccess ? <Unlock size={14} className="mr-1"/> : <Lock size={14} className="mr-1"/>}
                                        {material.requiredTier}
                                    </Badge>
                                    { (hasAccess || showPreview) ? (
                                        <Link href={material.contentUrl || '#'} passHref legacyBehavior>
                                             <Button size="sm" variant={hasAccess ? 'default' : 'outline'} disabled={!material.contentUrl}>
                                                 {hasAccess ? 'View Content' : 'View Preview'}
                                             </Button>
                                        </Link>
                                    ) : (
                                        <Link href="/billing" passHref legacyBehavior>
                                            <Button size="sm" variant="outline">
                                                Upgrade to Access
                                            </Button>
                                        </Link>
                                    )}
                                </CardFooter>
                            </Card>
                            );
                        })
                         ) : (
                            <p className="text-muted-foreground md:col-span-2 lg:col-span-3">No materials found in this category yet.</p>
                         )}
                    </div>
                </section>
            ))}
         </div>
      )}
    </div>
  );
}

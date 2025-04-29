'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Lock } from 'lucide-react';
import { useAuth, SubscriptionTier } from '@/context/AuthContext';

// --- Mock Data & Types ---
// Should match the StudyMaterial type from the overview page
interface StudyMaterial {
  id: string;
  title: string;
  description: string;
  category: string;
  requiredTier: SubscriptionTier;
  previewAvailable: boolean;
  // Actual content for the material
  fullContent: string; // Markdown or HTML string
  previewContent?: string; // Optional preview content for lower tiers
}

// Mock function to fetch a single study material (replace with actual API call)
async function fetchSingleStudyMaterial(materialId: string): Promise<StudyMaterial | null> {
  console.log("Fetching material:", materialId);
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // In a real app, fetch from Firestore document based on materialId
  const mockMaterials: { [key: string]: StudyMaterial } = {
    sg1: { id: 'sg1', title: 'Complete SAT Reading Guide', description: 'Comprehensive strategies...', category: 'Study Guides', requiredTier: 'premium', previewAvailable: true, fullContent: '# Reading Guide\n\nThis is the full content...\n\n## Section 1\n\nDetails...\n\n## Section 2\n\nMore details...', previewContent: '# Reading Guide Preview\n\nThis is a short preview...' },
    ts1: { id: 'ts1', title: 'Top 10 Math Shortcuts', description: 'Save time...', category: 'Tips & Strategies', requiredTier: 'free', previewAvailable: true, fullContent: '# Math Shortcuts\n\n1. Shortcut 1...\n2. Shortcut 2...\n...', previewContent: '# Math Shortcuts Preview\n\nHere are a couple of tips...' },
     dsf1: { id: 'dsf1', title: 'Navigating the Bluebook App', description: 'Master the interface...', category: 'Digital SAT Focus', requiredTier: 'free', previewAvailable: true, fullContent: '# Bluebook App Guide\n\nFull guide content here...', previewContent: '# Bluebook App Preview\n\nShort intro...' },
    // Add other materials matching the overview page
  };

  return mockMaterials[materialId] || null;
}

// --- Component ---

export default function MaterialContentPage() {
  const params = useParams();
  const router = useRouter();
  const { currentUser } = useAuth();
  const materialId = params.materialId as string;

  const [material, setMaterial] = useState<StudyMaterial | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!materialId) return;

    const loadMaterial = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchSingleStudyMaterial(materialId);
        if (data) {
          setMaterial(data);
        } else {
          setError("Study material not found.");
        }
      } catch (err) {
        console.error("Failed to load material:", err);
        setError("Could not load the study material. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    loadMaterial();
  }, [materialId]);

   const userTierIndex = { free: 0, premium: 1, high-end: 2 };
   const currentTierIndex = userTierIndex[currentUser?.subscriptionTier || 'free'];

   const canAccessFullContent = (requiredTier: SubscriptionTier): boolean => {
      if (!material) return false;
      const requiredTierIndex = userTierIndex[requiredTier];
      return currentTierIndex >= requiredTierIndex;
   };


  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <Skeleton className="h-8 w-1/4 mb-2" />
        <Skeleton className="h-5 w-1/2 mb-8" />
        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-1/3 mb-2" />
            <Skeleton className="h-5 w-full" />
          </CardHeader>
          <CardContent className="prose max-w-none dark:prose-invert">
             <Skeleton className="h-6 w-full mb-4" />
             <Skeleton className="h-4 w-full mb-2" />
             <Skeleton className="h-4 w-5/6 mb-2" />
             <Skeleton className="h-4 w-full mb-2" />
             <Skeleton className="h-4 w-4/6 mb-4" />
             <Skeleton className="h-6 w-full mb-4" />
             <Skeleton className="h-4 w-full mb-2" />
             <Skeleton className="h-4 w-full mb-2" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p className="text-destructive mb-4">{error}</p>
         <Button variant="outline" onClick={() => router.back()}>
             <ArrowLeft className="mr-2 h-4 w-4"/> Back to Materials
         </Button>
      </div>
    );
  }

  if (!material) {
    return <div className="container mx-auto py-8 text-center">Material not found.</div>;
  }

  const hasFullAccess = canAccessFullContent(material.requiredTier);
  const contentToShow = hasFullAccess ? material.fullContent : material.previewContent;
  const showUpgradeNotice = !hasFullAccess && !material.previewContent && material.requiredTier !== 'free';
  const showPreviewNotice = !hasFullAccess && material.previewContent;

  return (
    <div className="container mx-auto py-8">
        <Button variant="outline" size="sm" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4"/> Back to Materials
        </Button>

        <Card>
            <CardHeader>
                <CardTitle className="text-3xl">{material.title}</CardTitle>
                <CardDescription>{material.description}</CardDescription>
                <CardDescription className="text-xs pt-1">Category: {material.category} | Required Tier: <span className="capitalize font-medium">{material.requiredTier}</span></CardDescription>
            </CardHeader>
            <CardContent className="prose max-w-none dark:prose-invert mt-4 border-t pt-6">
                {contentToShow ? (
                    // WARNING: Rendering raw HTML/Markdown can be risky if content isn't trusted.
                    // Consider using a safe Markdown renderer like 'react-markdown'.
                    // For simplicity here, we'll use dangerouslySetInnerHTML (USE WITH CAUTION).
                    // If using Markdown, replace this with a Markdown component.
                     <div>
                         {showPreviewNotice && (
                             <div className="mb-4 p-3 rounded-md border border-blue-300 bg-blue-50 text-blue-700 text-sm">
                                 This is a preview. <Link href="/billing" className="font-semibold underline">Upgrade</Link> to view the full content.
                            </div>
                         )}
                         <div dangerouslySetInnerHTML={{ __html: contentToShow }} />
                     </div>

                ) : showUpgradeNotice ? (
                     <div className="flex flex-col items-center justify-center text-center p-8 border rounded-md bg-secondary">
                        <Lock className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Full Access Required</h3>
                        <p className="text-muted-foreground mb-4">
                             This content requires a <span className="capitalize font-medium">{material.requiredTier}</span> plan or higher.
                        </p>
                         <Link href="/billing" passHref legacyBehavior>
                            <Button>Upgrade Your Plan</Button>
                        </Link>
                    </div>
                ) : (
                    <p>No content available for this material.</p> // Fallback
                )}
            </CardContent>
        </Card>
    </div>
  );
}

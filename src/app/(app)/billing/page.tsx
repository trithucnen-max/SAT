'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { CheckCircle, Star, Zap } from 'lucide-react';
import { useAuth, SubscriptionTier } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { processPayment, PaymentDetails, PaymentResult } from '@/services/payment'; // Import the stub
import { useFirebase } from '@/context/FirebaseContext';
import { doc, updateDoc } from 'firebase/firestore';


interface Plan {
  id: SubscriptionTier;
  name: string;
  priceVND: number; // Price in VND
  priceString: string; // Formatted price string
  features: string[];
  isCurrent?: boolean;
  cta: string;
  icon: React.ElementType;
}

export default function BillingPage() {
  const { currentUser } = useAuth();
  const { db } = useFirebase();
  const { toast } = useToast();
  const [loadingPlan, setLoadingPlan] = useState<SubscriptionTier | null>(null);

  const handleUpgrade = async (planId: SubscriptionTier, amountVND: number) => {
      if (!currentUser || !db) return;

      setLoadingPlan(planId);

      // --- Payment Gateway Integration (Stubbed) ---
      const paymentDetails: PaymentDetails = {
          amountVND: amountVND,
          description: `Upgrade to ${planId} plan for user ${currentUser.uid}`,
      };

      try {
          console.log("Initiating payment processing for:", paymentDetails);
          const paymentResult: PaymentResult = await processPayment(paymentDetails); // Call the stub
          console.log("Payment result:", paymentResult);

          if (paymentResult.success) {
              // --- Update User Subscription in Firestore ---
              const userDocRef = doc(db, 'users', currentUser.uid);
              await updateDoc(userDocRef, {
                  subscriptionTier: planId,
                  // Optionally store transaction ID or other payment details
                  lastTransactionId: paymentResult.transactionId,
                  subscriptionUpdatedAt: new Date(),
              });
              // --- End Firestore Update ---

              toast({
                  title: 'Upgrade Successful!',
                  description: `You are now subscribed to the ${planId} plan.`,
              });
              // Auth context will automatically update via its snapshot listener
          } else {
               throw new Error(paymentResult.message || "Payment processing failed.");
          }
      } catch (error: any) {
           console.error("Upgrade failed:", error);
           toast({
               title: 'Upgrade Failed',
               description: error.message || 'Could not process your subscription upgrade. Please try again.',
               variant: 'destructive',
           });
      } finally {
           setLoadingPlan(null);
      }
      // --- End Payment Gateway Integration ---
  };

   const plans: Plan[] = [
    {
      id: 'free',
      name: 'Free',
      priceVND: 0,
      priceString: '₫0 / month',
      features: [
        '1 practice test per day',
        'Limited question explanations',
        'Limited study materials',
        'Basic performance summary',
      ],
      cta: 'Current Plan',
      icon: CheckCircle,
    },
    {
      id: 'premium',
      name: 'Premium',
      priceVND: 100000, // 100,000 VND
      priceString: '₫100,000 / month',
      features: [
        'Up to 100 tests per day',
        'Full access to explanations',
        'Full access to materials',
        'Detailed performance analytics',
        'Priority support (placeholder)',
      ],
      cta: 'Upgrade to Premium',
      icon: Star,
    },
    {
      id: 'high-end',
      name: 'High-End',
      priceVND: 300000, // 300,000 VND
      priceString: '₫300,000 / month',
      features: [
        'All Premium features',
        'Personalized study path (basic)',
        'Early access to new features',
        'Virtual tutor access (placeholder)',
      ],
      cta: 'Upgrade to High-End',
      icon: Zap,
    },
  ];

   // Mark the current plan
  const currentPlanIndex = plans.findIndex(p => p.id === currentUser?.subscriptionTier);
  if (currentPlanIndex !== -1) {
    plans[currentPlanIndex].isCurrent = true;
    plans[currentPlanIndex].cta = 'Current Plan'; // Ensure CTA is correct
  }


  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Billing & Subscription</h1>
        <p className="text-muted-foreground">Manage your plan and view billing details.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
         {plans.map((plan) => (
          <Card key={plan.id} className={`flex flex-col ${plan.isCurrent ? 'border-primary ring-2 ring-primary/50' : ''}`}>
            <CardHeader className="pb-4">
                <div className="flex justify-between items-center mb-2">
                     <CardTitle className="text-xl flex items-center gap-2">
                         <plan.icon className={`h-5 w-5 ${plan.isCurrent ? 'text-primary' : 'text-muted-foreground'}`} />
                         {plan.name}
                    </CardTitle>
                    {plan.isCurrent && <Badge variant="default">Active</Badge>}
                 </div>
                 <span className="text-3xl font-bold">{plan.priceString}</span>
                 <CardDescription>Best for {plan.name === 'Free' ? 'getting started' : plan.name === 'Premium' ? 'serious learners' : 'achieving top scores'}.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-2 text-sm text-muted-foreground">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="mt-4 border-t pt-4">
               {/* Only show upgrade button if it's not the current plan AND it's a higher tier */}
                {!plan.isCurrent && plans.findIndex(p => p.id === plan.id) > currentPlanIndex ? (
                     <Button
                        className="w-full"
                        onClick={() => handleUpgrade(plan.id, plan.priceVND)}
                        disabled={loadingPlan === plan.id}
                    >
                         {loadingPlan === plan.id ? 'Processing...' : plan.cta}
                    </Button>
                ) : (
                     <Button className="w-full" disabled>
                        {plan.cta}
                     </Button>
                )}
            </CardFooter>
          </Card>
         ))}
      </div>

       {/* Placeholder for Billing History/Invoices */}
       <Card className="mt-8">
         <CardHeader>
           <CardTitle>Billing History (Placeholder)</CardTitle>
           <CardDescription>Your past invoices and payment details will appear here.</CardDescription>
         </CardHeader>
         <CardContent>
           <p className="text-muted-foreground text-sm">No billing history available yet.</p>
            {/* TODO: Add link to payment provider's portal if applicable */}
         </CardContent>
       </Card>
    </div>
  );
}

'use client';

import type React from 'react';
import AppSidebar from '@/components/layout/AppSidebar';
import AppHeader from '@/components/layout/AppHeader';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from '@/components/ui/skeleton'; // Keep skeleton for initial loading

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth();

  // Render loading state covering the whole potential layout area
   if (loading) {
     return (
       <div className="flex min-h-screen w-full bg-muted/40">
         {/* Skeleton Sidebar */}
         <div className="hidden md:block border-r bg-sidebar" style={{ width: 'var(--sidebar-width, 16rem)' }}>
           <div className="flex flex-col h-full p-4 gap-4">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
               <Skeleton className="h-8 w-full" />
               <Skeleton className="h-8 w-full mt-auto" />
           </div>
         </div>
          {/* Skeleton Header + Main Content */}
         <div className="flex flex-col flex-1">
           <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
              <Skeleton className="h-8 w-8 rounded-full sm:hidden" /> {/* Mobile trigger */}
              <Skeleton className="h-8 w-8 rounded-full hidden sm:block" /> {/* Desktop trigger */}
              <div className="ml-auto">
                  <Skeleton className="h-8 w-8 rounded-full" /> {/* User menu */}
              </div>
           </header>
           <main className="flex-1 p-4 md:p-6 lg:p-8">
              <Skeleton className="h-32 w-full" />
               <Skeleton className="h-64 w-full mt-4" />
           </main>
         </div>
       </div>
     );
   }


  // Render the actual layout once loading is complete
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-muted/40">
        <AppSidebar />
        <div className="flex flex-col flex-1">
           <AppHeader />
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

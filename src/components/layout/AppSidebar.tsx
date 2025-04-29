'use client';

import Link from 'next/link';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import AppSidebarNavigation from './AppSidebarNavigation';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { signOut } from 'firebase/auth';
import { useFirebase } from '@/context/FirebaseContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function AppSidebar() {
  const { auth } = useFirebase();
  const router = useRouter();
  const { toast } = useToast();

   const handleLogout = async () => {
     if (!auth) return;
    try {
      await signOut(auth);
      toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
       toast({ title: 'Logout Failed', description: 'Could not log you out. Please try again.', variant: 'destructive' });
    }
  };

  return (
    <Sidebar className="border-r" collapsible="icon" variant="sidebar">
      <SidebarHeader className="flex items-center justify-between p-4">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold" prefetch={false}>
           <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-primary"
            >
                <path d="M12 18L12 6" />
                <path d="M4 12H20" />
            </svg>
            <span className="text-lg group-data-[state=collapsed]:hidden">SPAT</span>
             <span className="sr-only group-data-[state=expanded]:hidden">SPAT</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="flex-1 overflow-y-auto">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          <AppSidebarNavigation />
        </nav>
      </SidebarContent>
        <SidebarFooter className="mt-auto p-4 border-t">
            <Button variant="ghost" className="w-full justify-start gap-2" onClick={handleLogout}>
             <LogOut className="h-4 w-4" />
              <span className="group-data-[state=collapsed]:hidden">Logout</span>
              <span className="sr-only group-data-[state=expanded]:hidden">Logout</span>
            </Button>
      </SidebarFooter>
    </Sidebar>
  );
}

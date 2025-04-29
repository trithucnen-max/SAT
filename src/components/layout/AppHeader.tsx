'use client';

import Link from 'next/link';
import { CircleUser, Menu, LogIn } from 'lucide-react'; // Added LogIn
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import AppSidebarNavigation from './AppSidebarNavigation'; // Re-use navigation links
import { useAuth } from '@/context/AuthContext';
import { signOut } from 'firebase/auth';
import { useFirebase } from '@/context/FirebaseContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { SidebarTrigger } from '@/components/ui/sidebar';

export default function AppHeader() {
  const { currentUser, isGuest } = useAuth();
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
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
        {/* Mobile Sidebar Trigger */}
        <Sheet>
            <SheetTrigger asChild>
                <Button size="icon" variant="outline" className="sm:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs bg-sidebar text-sidebar-foreground">
                <nav className="grid gap-6 text-lg font-medium mt-8">
                <Link
                    href="/dashboard" // Link to dashboard
                    className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                    prefetch={false}
                >
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
                        className="h-5 w-5 transition-all group-hover:scale-110"
                    >
                        <path d="M12 18L12 6" />
                        <path d="M4 12H20" />
                    </svg>
                    <span className="sr-only">SPAT</span>
                </Link>
                <AppSidebarNavigation />
                 {/* Add Login/Logout in mobile sheet */}
                 <div className="mt-auto">
                      {isGuest ? (
                          <Link href="/login" passHref legacyBehavior>
                              <Button variant="outline" className="w-full justify-start gap-2">
                                 <LogIn className="h-4 w-4" /> Login / Sign Up
                              </Button>
                           </Link>
                      ) : (
                           <Button variant="ghost" className="w-full justify-start gap-2" onClick={handleLogout}>
                              <Menu className="h-4 w-4" /> Logout
                           </Button> // Assuming LogOut icon exists
                      )}
                 </div>
                </nav>
            </SheetContent>
        </Sheet>

        {/* Desktop Sidebar Trigger (using Shadcn Sidebar component trigger) */}
        <div className="hidden sm:block">
             <SidebarTrigger />
        </div>


      {/* Spacer to push user menu/login button to the right */}
      <div className="ml-auto flex items-center gap-2">
         {isGuest ? (
             <Link href="/login" passHref legacyBehavior>
                 <Button variant="outline">
                      <LogIn className="mr-2 h-4 w-4" /> Login / Sign Up
                 </Button>
            </Link>
         ) : (
            /* User Dropdown for logged-in users */
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full">
                  <CircleUser className="h-5 w-5" />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {currentUser?.email && <DropdownMenuItem disabled>{currentUser.email}</DropdownMenuItem>}
                <DropdownMenuItem disabled className="capitalize text-xs text-muted-foreground">
                    Tier: {currentUser?.subscriptionTier || 'Free'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                 <DropdownMenuItem asChild>
                  <Link href="/billing">Billing</Link>
                </DropdownMenuItem>
                 {/* Removed Settings link from dropdown, keep Profile */}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
         )}
      </div>
    </header>
  );
}

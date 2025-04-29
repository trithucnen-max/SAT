'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText, BarChart3, BookOpen, Settings, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar'; // Import Sidebar components
import { useAuth } from '@/context/AuthContext';


export default function AppSidebarNavigation() {
    const pathname = usePathname();
    const { isGuest } = useAuth();

    const allNavItems = [
        { href: '/dashboard', label: 'Dashboard', icon: Home, guestAccess: true },
        { href: '/practice', label: 'Practice Tests', icon: FileText, guestAccess: true },
        { href: '/results', label: 'Results', icon: BarChart3, guestAccess: true }, // Allow access to list, details page will guard
        { href: '/materials', label: 'Study Materials', icon: BookOpen, guestAccess: true },
        { href: '/billing', label: 'Billing', icon: CreditCard, guestAccess: false },
        { href: '/profile', label: 'Profile', icon: Settings, guestAccess: false }, // Combined profile/settings for now
    ];

    const navItems = allNavItems.filter(item => item.guestAccess || !isGuest);


    return (
        <SidebarMenu>
            {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                     <Link href={item.href} passHref legacyBehavior>
                        <SidebarMenuButton
                            isActive={pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))}
                            tooltip={item.label} // Tooltip shown when collapsed
                            aria-label={item.label}
                        >
                             <item.icon className="h-4 w-4" />
                            <span className="group-data-[state=collapsed]:hidden">{item.label}</span>
                             <span className="sr-only group-data-[state=expanded]:hidden">{item.label}</span>
                        </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
            ))}
        </SidebarMenu>
    );
}

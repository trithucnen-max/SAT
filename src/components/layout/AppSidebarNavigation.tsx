'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText, BarChart3, BookOpen, Settings, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar'; // Import Sidebar components


export default function AppSidebarNavigation() {
    const pathname = usePathname();

    const navItems = [
        { href: '/dashboard', label: 'Dashboard', icon: Home },
        { href: '/practice', label: 'Practice Tests', icon: FileText },
        { href: '/results', label: 'Results', icon: BarChart3 },
        { href: '/materials', label: 'Study Materials', icon: BookOpen },
        { href: '/billing', label: 'Billing', icon: CreditCard },
        { href: '/profile', label: 'Profile', icon: Settings }, // Combined profile/settings for now
    ];

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

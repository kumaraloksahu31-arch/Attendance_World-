
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  LayoutGrid,
  Settings,
  Users,
  ClipboardCheck,
  BarChart,
} from 'lucide-react';
import { Logo } from '@/app/components/icons';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { useSidebar } from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from '@/firebase';

const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
    { href: '/dashboard/attendance', label: 'Attendance', icon: ClipboardCheck },
    { href: '/dashboard/admin/users', label: 'Users', icon: Users, admin: true },
    { href: '/dashboard/admin/analytics', label: 'Analytics', icon: BarChart, admin: true },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];


export function DashboardSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const { user, loading } = useUser();

  const isNavItemActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const getInitials = (name?: string | null) => {
    if (!name) return '';
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return name.charAt(0).toUpperCase();
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Logo className="h-8 w-8 text-primary" />
          {state === 'expanded' && (
            <span className="text-xl font-semibold font-headline">AttendEase Pro</span>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={isNavItemActive(item.href)}
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-3 p-2">
          {loading ? (
            <>
              <Skeleton className="h-10 w-10 rounded-full" />
              {state === 'expanded' && (
                <div className="flex flex-col gap-1 w-32">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                </div>
              )}
            </>
          ) : user ? (
            <>
            <Avatar className="h-10 w-10">
                <AvatarImage src={user.photoURL || undefined} alt={user.displayName || ''} />
                <AvatarFallback>
                {getInitials(user.displayName)}
                </AvatarFallback>
            </Avatar>
            {state === 'expanded' && (
                <div className="flex flex-col truncate">
                <span className="font-semibold">{user.displayName}</span>
                <span className="text-xs text-muted-foreground">
                    {user.email}
                </span>
                </div>
            )}
            </>
          ) : null}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

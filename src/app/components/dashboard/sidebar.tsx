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
  Users,
  LayoutGrid,
  Sheet,
  BarChart2,
  Settings,
  LogOut,
} from 'lucide-react';
import { Logo } from '@/app/components/icons';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { useSidebar } from '@/components/ui/sidebar';

// This is a mock user. In a real app, you'd get this from your auth context.
const mockUser = {
  name: 'Admin User',
  email: 'admin@example.com',
  role: 'admin', // 'admin', 'employee', or 'student'
  avatar: 'https://avatar.vercel.sh/admin-user.png',
};

const navItems = {
  admin: [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
    { href: '/dashboard/attendance', label: 'Attendance', icon: Sheet },
    { href: '/dashboard/admin/users', label: 'Users', icon: Users },
    { href: '/dashboard/admin/analytics', label: 'Analytics', icon: BarChart2 },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  ],
  employee: [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
    { href: '/dashboard/attendance', label: 'My Attendance', icon: Sheet },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  ],
  student: [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
    { href: '/dashboard/attendance', label: 'My Attendance', icon: Sheet },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  ],
};

export function DashboardSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const userRole = mockUser.role as keyof typeof navItems;
  const currentNavItems = navItems[userRole] || navItems.student;

  const isNavItemActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

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
          {currentNavItems.map((item) => (
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
          <Avatar className="h-10 w-10">
            <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
            <AvatarFallback>
              {mockUser.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {state === 'expanded' && (
            <div className="flex flex-col truncate">
              <span className="font-semibold">{mockUser.name}</span>
              <span className="text-xs text-muted-foreground">
                {mockUser.email}
              </span>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

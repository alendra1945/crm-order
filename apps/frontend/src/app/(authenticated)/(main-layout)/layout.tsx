'use client';
import { AppLogo } from '@/components/layout/app-logo';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { Header } from '@/components/layout/header';
import { NavGroup } from '@/components/layout/nav-group';
import { NavUser } from '@/components/layout/nav-user';
import { TopNav } from '@/components/layout/top-nav';
import {
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { LayoutDashboard, ListTodo, Users, UserSearchIcon } from 'lucide-react';

const topNav = [
  {
    title: 'Overview',
    href: '/dashboard',
    isActive: true,
    disabled: false,
  },
];

export const navGroups = [
  {
    title: '',
    items: [
      {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutDashboard,
      },
      {
        title: 'Products',
        icon: Users,
        items: [
          {
            title: 'List',
            url: '/products',
          },
        ],
      },
      {
        title: 'Orders',
        icon: Users,
        items: [
          {
            title: 'List',
            url: '/orders',
          },
        ],
      },
      {
        title: 'Report',
        icon: ListTodo,
        items: [
          {
            title: 'Templates',
            url: '/reporting-template',
          },
        ],
      },
      {
        title: 'Users',
        icon: UserSearchIcon,
        items: [
          {
            title: 'List',
            url: '/members',
          },
        ],
      },
    ],
  },
];
export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar>
        <SidebarHeader>
          <AppLogo />
        </SidebarHeader>
        <SidebarContent className='smooth-scroll'>
          {navGroups.map((props) => (
            <NavGroup key={props.title} {...props} />
          ))}
        </SidebarContent>
        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
        <SidebarRail />
      </AppSidebar>
      <SidebarInset
        className={cn(
          'has-[[data-layout=fixed]]:h-svh',
          'peer-data-[variant=inset]:has-[[data-layout=fixed]]:h-[calc(100svh-(var(--spacing)*4))]',
          '@container/content'
        )}
      >
        <Header>
          <TopNav links={topNav} />
        </Header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}

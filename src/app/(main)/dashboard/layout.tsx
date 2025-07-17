
"use client"

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { Header } from '@/components/layout/Header';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.replace('/login');
      } else if (user && !user.termsAccepted) {
        router.replace('/legal/accept-terms');
      }
    }
  }, [user, isLoading, router]);

  if (isLoading || (!isLoading && !user) || (!isLoading && user && !user.termsAccepted)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size={48} />
      </div>
    );
  }

  return (
    <SidebarProvider>
        <Sidebar collapsible="icon" variant="sidebar">
          {/* Sidebar content is defined in its own component */}
        </Sidebar>
        <SidebarInset>
            <Header>
                <SidebarTrigger />
            </Header>
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
              {children}
            </main>
        </SidebarInset>
    </SidebarProvider>
  );
}

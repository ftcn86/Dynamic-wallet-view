
"use client"

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { Header } from '@/components/layout/Header';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Sidebar as SidebarContent } from '@/components/layout/Sidebar';
import { MobileSidebar } from '@/components/layout/MobileSidebar';

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
        <Sidebar>
          <SidebarContent />
        </Sidebar>
        <SidebarInset>
            <Header>
                <MobileSidebar>
                  <SidebarContent />
                </MobileSidebar>
            </Header>
            <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 lg:p-8 max-w-full">
              <div className="w-full max-w-none">
                {children}
              </div>
            </main>
        </SidebarInset>
    </SidebarProvider>
  );
}

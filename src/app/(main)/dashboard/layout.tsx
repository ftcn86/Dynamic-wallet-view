
"use client"

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Sidebar } from '@/components/layout/Sidebar';
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

  // Show loading spinner if still loading auth state, or if user is not yet available (and useEffect will redirect)
  // or if user exists but terms not accepted (and useEffect will redirect)
  if (isLoading || (!isLoading && !user) || (!isLoading && user && !user.termsAccepted)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size={48} />
      </div>
    );
  }

  // Only render sidebar and children if user is authenticated and terms are accepted
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}

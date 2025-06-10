
"use client"

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth(); // isLoading is for initial auth check
  const router = useRouter();

  useEffect(() => {
    // If initial auth check is done (isLoading is false) AND there's no user, redirect to login
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [user, isLoading, router]);

  // Show loading spinner if:
  // 1. Initial auth check is in progress (isLoading is true)
  // 2. Initial auth check is done (isLoading is false) BUT there's still no user (e.g., about to redirect, or after logout)
  if (isLoading || (!isLoading && !user)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size={48} />
      </div>
    );
  }

  // If initial auth check is done AND user exists, render the layout
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}

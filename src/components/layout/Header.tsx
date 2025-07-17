
"use client"

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Bell, LogOut, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleRefresh = () => {
    // In a real app, this would trigger a data refresh.
    // For now, we can just reload the page to simulate.
    window.location.reload();
  };

  if (!user) {
    return null; // Or a loading skeleton
  }

  return (
    <header className="flex h-20 items-center justify-between border-b bg-card px-4 sm:px-6 md:px-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground font-headline">
          Welcome back, {user.name.split(' ')[0]}!
        </h1>
        <p className="text-sm text-muted-foreground">Your Dynamic Pi Wallet dashboard</p>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
        <Button variant="outline" onClick={handleRefresh}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Data
        </Button>
        <Button onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
  );
}

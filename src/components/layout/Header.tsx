
"use client"

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Bell, LogOut, RefreshCw, UserCircle, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Skeleton } from '../ui/skeleton';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { Sidebar } from './Sidebar';
import { cn } from '@/lib/utils';

export function Header({children}: {children?: React.ReactNode}) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const avatarFallback = user ? (user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : '?') : '';

  return (
    <header className="flex h-20 items-center justify-between border-b bg-card px-4 sm:px-6 md:px-8">
      <div className="flex items-center gap-4">
        {children}
        {!user ? (
            <div className="flex flex-col gap-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
            </div>
        ) : (
            <div>
                <h1 className="text-xl font-bold text-foreground font-headline">
                Welcome back, {user.name.split(' ')[0]}!
                </h1>
                <p className="text-sm text-muted-foreground">Here is your Pi Network overview for today.</p>
            </div>
        )}
      </div>

      {!user ? (
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-24 rounded-md" />
          </div>
      ) : (
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
            </Button>
            <Button variant="outline" size="icon" className="h-10 w-10 rounded-full" onClick={handleRefresh}>
            <RefreshCw className="h-5 w-5" />
            <span className="sr-only">Refresh Data</span>
            </Button>

            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="person face"/>
                    <AvatarFallback>{avatarFallback}</AvatarFallback>
                </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                    @{user.username}
                    </p>
                </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>
                <UserCircle className="mr-2 h-4 w-4" />
                <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
        </div>
      )}
    </header>
  );
}

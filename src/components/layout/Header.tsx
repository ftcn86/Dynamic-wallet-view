
"use client"

import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getNodeData } from '@/services/piService';
import type { NodeData } from '@/data/schemas';
import { Button } from '@/components/ui/button';
import { Bell, LogOut, RefreshCw, UserCircle, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Skeleton } from '../ui/skeleton';

function NotificationsDropdown() {
    const { user } = useAuth();
    const [nodeData, setNodeData] = useState<NodeData | null>(null);

    useEffect(() => {
        if (user?.isNodeOperator) {
            getNodeData().then(setNodeData);
        }
    }, [user?.isNodeOperator]);

    const needsUpdate = useMemo(() => {
        if (!user?.isNodeOperator || !nodeData) return false;
        return nodeData.nodeSoftwareVersion < nodeData.latestSoftwareVersion;
    }, [user, nodeData]);

    const hasNotifications = needsUpdate;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full">
                    <Bell className="h-5 w-5" />
                    {hasNotifications && (
                        <span className="absolute top-2 right-2.5 block h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
                    )}
                    <span className="sr-only">Notifications</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {hasNotifications ? (
                    <>
                        {needsUpdate && (
                             <DropdownMenuItem className="flex items-start gap-3" onSelect={(e) => { e.preventDefault(); router.push('/dashboard/node')}}>
                                <AlertTriangle className="h-5 w-5 text-yellow-500 mt-1" />
                                <div className="flex-1">
                                    <p className="font-semibold">Software Update Available</p>
                                    <p className="text-xs text-muted-foreground">
                                        Your node needs an update. Click to view details.
                                    </p>
                                </div>
                            </DropdownMenuItem>
                        )}
                    </>
                ) : (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                        You're all caught up!
                    </div>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

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
            <NotificationsDropdown />
            <Button variant="outline" size="icon" className="h-10 w-10 rounded-full" onClick={handleRefresh}>
            <RefreshCw className="h-5 w-5" />
            <span className="sr-only">Refresh Data</span>
            </Button>

            <AlertDialog>
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
                  <AlertDialogTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Log out</span>
                      </DropdownMenuItem>
                  </AlertDialogTrigger>
              </DropdownMenuContent>
              </DropdownMenu>
              <AlertDialogContent>
                  <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                      <AlertDialogDescription>
                          Are you sure you want to log out? You will need to re-authenticate to log back in.
                      </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
                  </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
        </div>
      )}
    </header>
  );
}

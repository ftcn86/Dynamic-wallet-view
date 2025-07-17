
"use client"

import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getNotifications } from '@/services/piService';
import type { Notification, NotificationType } from '@/data/schemas';
import { Button } from '@/components/ui/button';
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
import { formatDistanceToNowStrict } from 'date-fns';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';


// Solid SVG Icons
const BellIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="hsl(var(--primary))" {...props}>
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
);

const LogOutIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" fill="hsl(var(--destructive))" />
        <polyline points="16 17 21 12 16 7" stroke="hsl(var(--destructive))" strokeWidth="2"/>
        <line x1="21" y1="12" x2="9" y2="12" stroke="hsl(var(--destructive))" strokeWidth="2"/>
    </svg>
);

const RefreshCwIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M21 2v6h-6" />
        <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
        <path d="M3 22v-6h6" />
        <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
    </svg>
);

const UserCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
        <circle cx="12" cy="12" r="10" fill="hsl(var(--primary))"/>
        <circle cx="12" cy="10" r="3" fill="hsl(var(--primary-foreground))" />
        <path d="M7 18.662V19a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-.338a4 4 0 0 0-3.12-3.953h-1.76a4 4 0 0 0-3.12 3.953Z" fill="hsl(var(--primary-foreground))" />
    </svg>
);

const AwardIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
        <circle cx="12" cy="8" r="7" fill="currentColor"/>
        <polyline points="8.21 13.89 7 23 12 17 17 23 15.79 13.88" fill="currentColor"/>
    </svg>
);

const UsersIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" fill="currentColor"/>
        <circle cx="8.5" cy="7" r="4" fill="currentColor"/>
        <path d="M20 21v-2a4 4 0 0 0-3-3.87" fill="currentColor"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75" fill="currentColor"/>
    </svg>
);

const MegaphoneIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
        <path d="M3 11h18a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H3a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1Z" fill="currentColor"/>
        <path d="M11 11V3a1 1 0 0 1 2 0v8" stroke="currentColor" strokeWidth="2" />
    </svg>
);

const SettingsIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l-.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" fill="currentColor"/>
        <circle cx="12" cy="12" r="3" fill="#fff" />
    </svg>
);

const MessageSquareIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="currentColor"/>
    </svg>
);

const notificationIcons: Record<NotificationType, React.ElementType> = {
    node_update: SettingsIcon,
    badge_earned: AwardIcon,
    team_update: UsersIcon,
    announcement: MegaphoneIcon,
    team_message: MessageSquareIcon,
};

const notificationColors: Record<NotificationType, string> = {
    node_update: 'text-yellow-500',
    badge_earned: 'text-blue-500',
    team_update: 'text-green-500',
    announcement: 'text-primary',
    team_message: 'text-fuchsia-500',
};


function NotificationsDropdown() {
    const { user, dataVersion } = useAuth(); // Listen for data changes
    const router = useRouter();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchNotifications() {
            if (user) {
                setIsLoading(true);
                const fetchedNotifications = await getNotifications();
                setNotifications(fetchedNotifications);
                setIsLoading(false);
            }
        }
        fetchNotifications();
    }, [user, dataVersion]); // Re-fetch when dataVersion changes

    const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);
    
    const handleNotificationClick = (notification: Notification) => {
        // Mark as read locally
        setNotifications(notifications.map(n => n.id === notification.id ? {...n, read: true} : n));
        if (notification.link) {
            router.push(notification.link);
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full">
                    <BellIcon className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge variant="destructive" className="absolute top-1.5 right-1.5 h-5 w-5 p-0 flex items-center justify-center text-xs">
                           {unreadCount}
                        </Badge>
                    )}
                    <span className="sr-only">Notifications</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 md:w-96" align="end">
                <DropdownMenuLabel className="flex justify-between items-center">
                    <span>Notifications</span>
                    {unreadCount > 0 && <Badge variant="secondary">{unreadCount} New</Badge>}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isLoading ? (
                    <div className="p-2 space-y-2">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                ) : notifications.length > 0 ? (
                    <div className="max-h-80 overflow-y-auto">
                    {notifications.map(notification => {
                        const Icon = notificationIcons[notification.type];
                        const iconColor = notificationColors[notification.type];
                        return (
                             <DropdownMenuItem
                                key={notification.id}
                                className="flex items-start gap-3 cursor-pointer"
                                onSelect={() => handleNotificationClick(notification)}
                             >
                                {!notification.read && <span className="h-2 w-2 rounded-full bg-primary mt-2.5 shrink-0" />}
                                <div className={cn("mt-1.5 shrink-0", notification.read && "ml-4")}>
                                    <Icon className={cn("h-5 w-5", iconColor)} />
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-sm">{notification.title}</p>
                                    <p className="text-xs text-muted-foreground">{notification.description}</p>
                                    <p className="text-xs text-muted-foreground/80 mt-1">
                                        {formatDistanceToNowStrict(new Date(notification.date), { addSuffix: true })}
                                    </p>
                                </div>
                            </DropdownMenuItem>
                        )
                    })}
                    </div>
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
  const { user, logout, refreshData } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleRefresh = () => {
    refreshData();
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
            <RefreshCwIcon className="h-5 w-5" />
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
                  <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
                  <UserCircleIcon className="mr-2 h-4 w-4" />
                  <span>Profile & Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <AlertDialogTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <LogOutIcon className="mr-2 h-4 w-4" />
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

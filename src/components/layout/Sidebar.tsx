"use client"

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Network,
  UserCircle,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldQuestion,
  DollarSign,
  HelpCircle,
  FileText,
  ShieldCheck,
  MessageSquare,
  Heart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { useAuth } from '@/contexts/AuthContext';
import { SidebarNavLink } from './SidebarNavLink';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { PI_TEAM_CHAT_URL } from '@/lib/constants';


export function Sidebar() {
  const { user, logout: authLogout } = useAuth();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = useIsMobile();

  const performLogout = () => {
    authLogout();
    router.push('/login');
  };

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const handleNavigation = () => {
    if (isMobile && !isCollapsed) {
      setIsCollapsed(true);
    }
  };

  const handleOpenChat = () => {
    window.open(PI_TEAM_CHAT_URL, '_blank');
    handleNavigation(); 
  };

  if (!user) return null;

  return (
    <div
      className={cn(
        "flex h-screen flex-col border-r bg-card transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex h-16 items-center border-b px-4 shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-lg" onClick={handleNavigation}>
          <ShieldQuestion className="h-7 w-7 text-primary" />
          {!isCollapsed && <span className="font-headline">Dynamic Pi Wallet View</span>}
        </Link>
        <Button variant="ghost" size="icon" className={cn("ml-auto h-8 w-8", isCollapsed && "mx-auto my-1")} onClick={toggleSidebar}>
          {isCollapsed ? <ChevronRight className="h-5 w-5 text-muted-foreground" /> : <ChevronLeft className="h-5 w-5 text-muted-foreground" />}
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </div>

      <nav className="flex-grow px-4 py-4 space-y-1 overflow-y-auto">
        <SidebarNavLink href="/dashboard" icon={<LayoutDashboard className="text-primary/90" />} isCollapsed={isCollapsed} onNavigate={handleNavigation}>
          Dashboard
        </SidebarNavLink>
        <SidebarNavLink href="/dashboard/team" icon={<Users className="text-primary/90" />} isCollapsed={isCollapsed} onNavigate={handleNavigation}>
          Team Insights
        </SidebarNavLink>
        <SidebarNavLink href="/dashboard/node" icon={<Network className="text-primary/90" />} isCollapsed={isCollapsed} onNavigate={handleNavigation}>
          Node Analysis
        </SidebarNavLink>
        <SidebarNavLink href="/dashboard/donate" icon={<Heart className="text-pink-500" />} isCollapsed={isCollapsed} onNavigate={handleNavigation}>
          Donate
        </SidebarNavLink>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-primary/10",
                isCollapsed && "justify-center"
              )}
            >
              <MessageSquare className="h-5 w-5 text-accent" />
              {!isCollapsed && <span className="truncate">Team Chat</span>}
              {isCollapsed && <span className="sr-only">Team Chat</span>}
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Open Team Chat?</AlertDialogTitle>
              <AlertDialogDescription>
                You are about to be redirected to the official Pi Team Chat in a new tab. Do you want to continue?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleOpenChat}>
                Open Chat
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </nav>

      <div className={cn("px-4 py-4", isCollapsed && "px-2 py-2")}>
         <div className={cn(
            "rounded-lg bg-muted p-3 text-center text-sm text-muted-foreground",
             isCollapsed && "p-2 flex justify-center items-center" 
            )}>
            {isCollapsed ? <DollarSign className="h-5 w-5 text-green-500" /> : "Your Ad Here"}
         </div>
      </div>
      
      <div className="mt-auto border-t p-4 shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className={cn("flex h-auto w-full items-center gap-2 p-2 text-left", isCollapsed && "justify-center p-0 aspect-square")}>
              <Avatar className="h-9 w-9">
                <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="person face" />
                <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="flex flex-col truncate">
                  <span className="text-sm font-medium truncate">{user.name}</span>
                  <span className="text-xs text-muted-foreground truncate">{user.username}</span>
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align={isCollapsed ? "center" : "end"} className="w-56">
            <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile" className="flex items-center gap-2" onClick={handleNavigation}>
                <UserCircle className="h-4 w-4 text-primary" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings" className="flex items-center gap-2" onClick={handleNavigation}>
                <Settings className="h-4 w-4 text-primary" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/legal/help" className="flex items-center gap-2" onClick={handleNavigation}>
                <HelpCircle className="h-4 w-4 text-accent" />
                <span>Help & Support</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/legal/terms" className="flex items-center gap-2" onClick={handleNavigation}>
                <FileText className="h-4 w-4 text-accent" />
                <span>Terms of Service</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/legal/privacy" className="flex items-center gap-2" onClick={handleNavigation}>
                <ShieldCheck className="h-4 w-4 text-accent" />
                <span>Privacy Policy</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm text-destructive focus:bg-destructive/10 hover:bg-destructive/10 outline-none relative select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                  <LogOut className="h-4 w-4 text-destructive" />
                  <span>Logout</span>
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to log out? You will need to re-authenticate with your Pi Network account to log back in.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      handleNavigation(); 
                      performLogout();
                    }}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Logout
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

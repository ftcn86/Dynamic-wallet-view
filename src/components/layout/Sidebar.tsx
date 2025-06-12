
"use client"

import Image from 'next/image';
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
import { useTranslation } from '@/hooks/useTranslation';
import { SidebarNavLink } from './SidebarNavLink';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { PI_TEAM_CHAT_URL } from '@/lib/constants';


export function Sidebar() {
  const { user, logout: authLogout } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = useIsMobile();

  const performLogout = () => {
    // Logic for PI_PULSE_DEVICE_LOGIN_ENABLED_HINT_KEY removed as feature is removed
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
          {!isCollapsed && <span className="font-headline">{t('appName')}</span>}
        </Link>
        <Button variant="ghost" size="icon" className={cn("ml-auto h-8 w-8", isCollapsed && "mx-auto my-1")} onClick={toggleSidebar}>
          {isCollapsed ? <ChevronRight className="h-5 w-5 text-muted-foreground" /> : <ChevronLeft className="h-5 w-5 text-muted-foreground" />}
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </div>

      <nav className="flex-grow px-4 py-4 space-y-1 overflow-y-auto">
        <SidebarNavLink href="/dashboard" icon={<LayoutDashboard className="text-primary/90" />} isCollapsed={isCollapsed} onNavigate={handleNavigation}>
          {t('sidebar.dashboard')}
        </SidebarNavLink>
        <SidebarNavLink href="/dashboard/team" icon={<Users className="text-primary/90" />} isCollapsed={isCollapsed} onNavigate={handleNavigation}>
          {t('sidebar.team')}
        </SidebarNavLink>
        <SidebarNavLink href="/dashboard/node" icon={<Network className="text-primary/90" />} isCollapsed={isCollapsed} onNavigate={handleNavigation}>
          {t('sidebar.node')}
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
              {!isCollapsed && <span className="truncate">{t('sidebar.chat')}</span>}
              {isCollapsed && <span className="sr-only">{t('sidebar.chat')}</span>}
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('sidebar.chatRedirect.title')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('sidebar.chatRedirect.description')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('sidebar.chatRedirect.cancelButton')}</AlertDialogCancel>
              <AlertDialogAction onClick={handleOpenChat}>
                {t('sidebar.chatRedirect.confirmButton')}
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
            {isCollapsed ? <DollarSign className="h-5 w-5 text-green-500" /> : t('sidebar.adPlaceholder')}
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
                <span>{t('sidebar.profile')}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings" className="flex items-center gap-2" onClick={handleNavigation}>
                <Settings className="h-4 w-4 text-primary" />
                <span>{t('sidebar.settings')}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/legal/help" className="flex items-center gap-2" onClick={handleNavigation}>
                <HelpCircle className="h-4 w-4 text-accent" />
                <span>{t('legal.helpTitle')}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/legal/terms" className="flex items-center gap-2" onClick={handleNavigation}>
                <FileText className="h-4 w-4 text-accent" />
                <span>{t('legal.termsTitle')}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/legal/privacy" className="flex items-center gap-2" onClick={handleNavigation}>
                <ShieldCheck className="h-4 w-4 text-accent" />
                <span>{t('legal.privacyTitle')}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm text-destructive focus:bg-destructive/10 hover:bg-destructive/10 outline-none relative select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                  <LogOut className="h-4 w-4 text-destructive" />
                  <span>{t('sidebar.logout')}</span>
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t('sidebar.logoutConfirm.title')}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t('sidebar.logoutConfirm.description')}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t('sidebar.logoutConfirm.cancelButton')}</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      handleNavigation(); 
                      performLogout();
                    }}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {t('sidebar.logoutConfirm.confirmButton')}
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

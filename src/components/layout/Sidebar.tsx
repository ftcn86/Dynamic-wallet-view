
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
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { SidebarNavLink } from './SidebarNavLink';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

export function Sidebar() {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = useIsMobile();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const handleNavigation = () => {
    if (isMobile && !isCollapsed) {
      setIsCollapsed(true);
    }
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
          {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </div>

      <nav className="flex-grow px-4 py-4 space-y-1 overflow-y-auto">
        <SidebarNavLink href="/dashboard" icon={<LayoutDashboard />} isCollapsed={isCollapsed} onNavigate={handleNavigation}>
          {t('sidebar.dashboard')}
        </SidebarNavLink>
        <SidebarNavLink href="/dashboard/team" icon={<Users />} isCollapsed={isCollapsed} onNavigate={handleNavigation}>
          {t('sidebar.team')}
        </SidebarNavLink>
        <SidebarNavLink href="/dashboard/node" icon={<Network />} isCollapsed={isCollapsed} onNavigate={handleNavigation}>
          {t('sidebar.node')}
        </SidebarNavLink>
      </nav>

      <div className={cn("px-4 py-4", isCollapsed && "px-2 py-2")}>
         <div className={cn(
            "rounded-lg bg-muted p-3 text-center text-sm text-muted-foreground",
             isCollapsed && "p-2"
            )}>
            {isCollapsed ? <DollarSign className="h-5 w-5 mx-auto" /> : t('sidebar.adPlaceholder')}
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
                <UserCircle className="h-4 w-4" />
                <span>{t('sidebar.profile')}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings" className="flex items-center gap-2" onClick={handleNavigation}>
                <Settings className="h-4 w-4" />
                <span>{t('sidebar.settings')}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/legal/help" className="flex items-center gap-2" onClick={handleNavigation}>
                <HelpCircle className="h-4 w-4" />
                <span>{t('legal.helpTitle')}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/legal/terms" className="flex items-center gap-2" onClick={handleNavigation}>
                <FileText className="h-4 w-4" />
                <span>{t('legal.termsTitle')}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/legal/privacy" className="flex items-center gap-2" onClick={handleNavigation}>
                <ShieldCheck className="h-4 w-4" />
                <span>{t('legal.privacyTitle')}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => { handleNavigation(); handleLogout(); }} className="flex items-center gap-2 text-destructive focus:text-destructive focus:bg-destructive/10">
              <LogOut className="h-4 w-4" />
              <span>{t('sidebar.logout')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

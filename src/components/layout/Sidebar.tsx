
"use client"

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  Network,
  UserCircle,
  Settings,
  ShieldQuestion,
  MessageSquare,
  Heart,
  FileText,
  ShieldCheck,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  const { user } = useAuth();
  const router = useRouter();
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = useState(isMobile);

  useEffect(() => {
    setIsCollapsed(isMobile);
  }, [isMobile]);

  const handleNavigation = () => {
    if (isMobile && !isCollapsed) {
      // setIsCollapsed(true);
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
        "hidden lg:flex h-screen flex-col border-r bg-card transition-all duration-300 ease-in-out w-64"
      )}
    >
      <div className="flex h-20 items-center border-b px-6 shrink-0">
        <Link href="/dashboard" className="flex flex-col" onClick={handleNavigation}>
          <span className="text-xl font-bold text-foreground font-headline">Dynamic Wallet View</span>
          <span className="text-sm text-muted-foreground">Analytics & Portfolio Tracker</span>
        </Link>
      </div>

      <nav className="flex-grow px-4 py-4 space-y-2">
        <SidebarNavLink href="/dashboard" icon={<LayoutDashboard />} onNavigate={handleNavigation}>
          Dashboard
        </SidebarNavLink>
        <SidebarNavLink href="/dashboard/profile" icon={<UserCircle />} onNavigate={handleNavigation}>
          Profile
        </SidebarNavLink>
        {/* These items are in the design but not yet implemented */}
        <SidebarNavLink href="#" icon={<FileText />} onNavigate={handleNavigation} disabled>
          Transactions
        </SidebarNavLink>
        <SidebarNavLink href="#" icon={<ShieldCheck />} onNavigate={handleNavigation} disabled>
          Security Circles
        </SidebarNavLink>
        <SidebarNavLink href="/dashboard/node" icon={<Network />} onNavigate={handleNavigation}>
          Node
        </SidebarNavLink>
        <SidebarNavLink href="/dashboard/donate" icon={<Heart />} onNavigate={handleNavigation}>
          Donate
        </SidebarNavLink>
        <SidebarNavLink href="/dashboard/settings" icon={<Settings />} onNavigate={handleNavigation}>
          Settings
        </SidebarNavLink>
        <SidebarNavLink href="/legal/help" icon={<HelpCircle />} onNavigate={handleNavigation}>
          Help
        </SidebarNavLink>
      </nav>

      <div className="mt-auto border-t p-4 shrink-0">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="person face" />
            <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col truncate">
            <span className="text-sm font-medium truncate">{user.name}</span>
            <span className="text-xs text-muted-foreground truncate">{user.username}</span>
          </div>
        </div>
         <div className="text-xs text-muted-foreground mt-4 space-y-1">
          <p><Link href="/legal/terms" className="hover:text-primary">Terms of Use</Link> · <Link href="/legal/privacy" className="hover:text-primary">Privacy Policy</Link></p>
          <p>Licensed under PIOS · Third-Party Service</p>
        </div>
      </div>
    </div>
  );
}

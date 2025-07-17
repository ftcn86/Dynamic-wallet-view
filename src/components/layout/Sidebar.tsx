
"use client"

import Link from 'next/link';
import {
  Home,
  Users,
  Settings,
  MessageSquare,
  Gift,
  HelpCircle,
  Shield,
  Coins,
  Network,
  Blocks,
  BarChart2,
} from 'lucide-react';
import {
  Sidebar as RootSidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarNavLink } from './SidebarNavLink';
import { cn } from '@/lib/utils';
import { PI_TEAM_CHAT_URL } from '@/lib/constants';
import { useRouter } from 'next/navigation';
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


export function Sidebar() {
  const { user, logout } = useAuth();
  const { state } = useSidebar();
  const router = useRouter();

  const handleOpenChat = () => {
    window.open(PI_TEAM_CHAT_URL, '_blank');
  };

  if (!user) return null;

  return (
    <RootSidebar>
        <SidebarHeader>
            <Link href="/dashboard" className="flex items-center gap-3">
                <Blocks className="h-8 w-8 text-primary shrink-0" />
                <span className={cn(
                    "text-xl font-bold text-foreground font-headline transition-opacity duration-200",
                    state === 'collapsed' ? 'opacity-0' : 'opacity-100'
                )}>
                    PiPulse
                </span>
            </Link>
        </SidebarHeader>

        <SidebarContent>
            <SidebarMenu>
                <p className={cn(
                    "px-4 py-2 text-xs font-semibold uppercase text-muted-foreground/80 transition-opacity duration-200",
                    state === 'collapsed' ? 'text-center' : ''
                )}>
                    {state === 'collapsed' ? 'M' : 'Menu'}
                </p>
                <SidebarMenuItem>
                    <SidebarNavLink href="/dashboard" icon={<Home className="text-primary"/>}>
                        Dashboard
                    </SidebarNavLink>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                    <SidebarNavLink href="/dashboard/team" icon={<Users className="text-primary"/>}>
                        Security & Team
                    </SidebarNavLink>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                    <SidebarNavLink href="/dashboard/node" icon={<Network className="text-primary"/>}>
                        Node Analysis
                    </SidebarNavLink>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarNavLink href="/dashboard/transactions" icon={<Coins className="text-primary"/>}>
                        Transactions
                    </SidebarNavLink>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                    <SidebarNavLink href="/dashboard/donate" icon={<Gift className="text-primary"/>}>
                        Donate
                    </SidebarNavLink>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                    <SidebarNavLink href="/dashboard/settings" icon={<Settings className="text-primary"/>}>
                        Settings
                    </SidebarNavLink>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <SidebarMenuButton tooltip="Team Chat" className="w-full justify-start">
                                <MessageSquare className="text-primary"/>
                                <span className={cn(state === 'collapsed' && 'hidden')}>Team Chat</span>
                            </SidebarMenuButton>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Open Team Chat?</AlertDialogTitle>
                            <AlertDialogDescription>
                                You are about to be redirected to an external chat application. Do you want to continue?
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleOpenChat}>Open Chat</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                    <SidebarNavLink href="/legal/help" icon={<HelpCircle className="text-primary"/>}>
                        Help Center
                    </SidebarNavLink>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarContent>

        <SidebarFooter>
            <div className={cn(
                "text-xs text-muted-foreground space-y-1 transition-opacity duration-200",
                state === 'collapsed' ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'
            )}>
                <p><Link href="/legal/terms" className="hover:text-primary">Terms</Link> · <Link href="/legal/privacy" className="hover:text-primary">Privacy</Link></p>
                <p>Licensed under PIOS · Not an official Pi App</p>
            </div>
        </SidebarFooter>
    </RootSidebar>
  );
}

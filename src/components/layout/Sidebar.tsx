
"use client"

import Link from 'next/link';
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
import { useTranslation } from '@/hooks/useTranslation';

// Solid SVG Icons
const HomeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="hsl(var(--primary))" {...props}>
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" stroke="hsl(var(--primary-foreground))" strokeWidth="2" />
    </svg>
);

const UsersIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="hsl(var(--primary))" {...props}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="8.5" cy="7" r="4" />
        <path d="M20 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

const SettingsIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="hsl(var(--primary))" {...props}>
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
        <circle cx="12" cy="12" r="3" fill="hsl(var(--primary-foreground))" />
    </svg>
);

const MessageSquareIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="hsl(var(--primary))" {...props}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
);

const GiftIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="hsl(var(--primary))" {...props}>
        <path d="M20 12v10H4V12" stroke="hsl(var(--primary-foreground))" strokeWidth="1.5" />
        <path d="M2 7h20v5H2z" stroke="hsl(var(--primary-foreground))" strokeWidth="1.5" />
        <path d="M12 22V7" stroke="hsl(var(--primary-foreground))" strokeWidth="1.5" />
        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" stroke="hsl(var(--primary-foreground))" strokeWidth="1.5" />
        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" stroke="hsl(var(--primary-foreground))" strokeWidth="1.5" />
    </svg>
);

const HelpCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="hsl(var(--primary))" {...props}>
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="hsl(var(--primary-foreground))" strokeWidth="1.5" fill="none"/>
        <line x1="12" y1="17" x2="12.01" y2="17" stroke="hsl(var(--primary-foreground))" strokeWidth="1.5" fill="none"/>
    </svg>
);

const CoinsIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="hsl(var(--primary))" {...props}>
        <circle cx="8" cy="8" r="6" />
        <path d="M18.09 10.72A6 6 0 1 1 10.72 18.09" />
        <path d="m14 6-3.1 3.1" stroke="hsl(var(--primary-foreground))" strokeWidth="1.5" />
        <path d="m6 14 3.1-3.1" stroke="hsl(var(--primary-foreground))" strokeWidth="1.5" />
        <path d="M14 14.8V18" stroke="hsl(var(--primary-foreground))" strokeWidth="1.5" />
        <path d="M6 10.2V6" stroke="hsl(var(--primary-foreground))" strokeWidth="1.5" />
    </svg>
);

const NetworkIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="hsl(var(--primary))" {...props}>
        <rect x="2" y="2" width="7" height="7" rx="2" ry="2"/>
        <rect x="15" y="2" width="7" height="7" rx="2" ry="2"/>
        <rect x="2" y="15" width="7" height="7" rx="2" ry="2"/>
        <rect x="15" y="15" width="7" height="7" rx="2" ry="2"/>
        <path d="M9 5.5H15" stroke="hsl(var(--primary-foreground))" strokeWidth="1.5" />
        <path d="M5.5 9V15" stroke="hsl(var(--primary-foreground))" strokeWidth="1.5" />
        <path d="M9 18.5H15" stroke="hsl(var(--primary-foreground))" strokeWidth="1.5" />
        <path d="M18.5 9V15" stroke="hsl(var(--primary-foreground))" strokeWidth="1.5" />
    </svg>
);

const BlocksIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="hsl(var(--primary))" {...props}>
        <rect x="7" y="7" width="10" height="10" rx="2" ry="2"/>
        <path d="M3 7V5a2 2 0 0 1 2-2h2"/>
        <path d="M17 3h2a2 2 0 0 1 2 2v2"/>
        <path d="M21 17v2a2 2 0 0 1-2 2h-2"/>
        <path d="M7 21H5a2 2 0 0 1-2-2v-2"/>
    </svg>
);

export function Sidebar() {
  const { user } = useAuth();
  const { state } = useSidebar();
  const { t } = useTranslation();

  const handleOpenChat = () => {
    window.open(PI_TEAM_CHAT_URL, '_blank');
  };

  if (!user) return null;

  return (
    <RootSidebar>
        <SidebarHeader>
            <Link href="/dashboard" className="flex items-center gap-3">
                <BlocksIcon className="h-8 w-8 shrink-0" />
                <span className={cn(
                    "text-lg font-bold text-foreground font-headline transition-opacity duration-200",
                    state === 'collapsed' ? 'opacity-0' : 'opacity-100'
                )}>
                    {t('appName')}
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
                    <SidebarNavLink href="/dashboard" icon={<HomeIcon />}>
                        Dashboard
                    </SidebarNavLink>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                    <SidebarNavLink href="/dashboard/team" icon={<UsersIcon />}>
                        Security & Team
                    </SidebarNavLink>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                    <SidebarNavLink href="/dashboard/node" icon={<NetworkIcon />}>
                        Node Analysis
                    </SidebarNavLink>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarNavLink href="/dashboard/transactions" icon={<CoinsIcon />}>
                        Transactions
                    </SidebarNavLink>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                    <SidebarNavLink href="/dashboard/donate" icon={<GiftIcon />}>
                        Donate
                    </SidebarNavLink>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                    <SidebarNavLink href="/dashboard/settings" icon={<SettingsIcon />}>
                        Settings
                    </SidebarNavLink>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <SidebarMenuButton tooltip="Team Chat" className="w-full justify-start">
                                <MessageSquareIcon />
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
                    <SidebarNavLink href="/legal/help" icon={<HelpCircleIcon />}>
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

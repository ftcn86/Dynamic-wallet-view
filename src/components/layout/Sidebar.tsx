
"use client"

import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  Network,
  UserCircle,
  Settings,
  ShieldQuestion,
  MessageSquare,
  Heart,
  HelpCircle,
  LogOut,
  Shield,
  Coins
} from 'lucide-react';
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
import { PI_TEAM_CHAT_URL } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';

export function Sidebar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleOpenChat = () => {
    window.open(PI_TEAM_CHAT_URL, '_blank');
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!user) return null;

  const avatarFallback = user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : '?';

  return (
    <div
      className={cn(
        "hidden lg:flex h-screen flex-col justify-between border-r bg-card transition-all duration-300 ease-in-out w-64"
      )}
    >
      <div>
        <div className="flex h-20 items-center border-b px-6 shrink-0">
          <Link href="/dashboard" className="flex items-center gap-3">
             <ShieldQuestion className="h-8 w-8 text-primary" />
             <span className="text-xl font-bold text-foreground font-headline">Dynamic Wallet View</span>
          </Link>
        </div>

        <nav className="flex-grow px-4 py-4 space-y-1">
          <p className="px-4 py-2 text-xs font-semibold uppercase text-muted-foreground/80">Menu</p>
          <SidebarNavLink href="/dashboard" icon={<LayoutDashboard />}>
            Dashboard
          </SidebarNavLink>
          <SidebarNavLink href="/dashboard/team" icon={<Users />}>
            Team Insights
          </SidebarNavLink>
          <SidebarNavLink href="/dashboard/node" icon={<Network />}>
            Node Analysis
          </SidebarNavLink>
          <SidebarNavLink href="/dashboard/donate" icon={<Heart />}>
            Donate
          </SidebarNavLink>
          <SidebarNavLink href="/dashboard/transactions" icon={<Coins />} disabled={true}>
            Transactions
          </SidebarNavLink>
          <SidebarNavLink href="/dashboard/security" icon={<Shield />} disabled={true}>
            Security Circle
          </SidebarNavLink>
        </nav>
      </div>

      <div className="mt-auto border-t p-4 shrink-0">
        <div className="text-xs text-muted-foreground mb-4 space-y-1">
            <p><Link href="/legal/terms" className="hover:text-primary">Terms of Use</Link> · <Link href="/legal/privacy" className="hover:text-primary">Privacy Policy</Link></p>
            <p>Licensed under PIOS · Not an official Pi App</p>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
                <MessageSquare className="h-5 w-5 mr-3" />
                Team Chat
            </Button>
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

        <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground" onClick={() => router.push('/legal/help')}>
            <HelpCircle className="h-5 w-5 mr-3" />
            Help Center
        </Button>
        <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground" onClick={handleLogout}>
            <LogOut className="h-5 w-5 mr-3" />
            Logout
        </Button>
      </div>
    </div>
  );
}

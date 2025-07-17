
"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import React from 'react';
import { SidebarMenuButton } from '@/components/ui/sidebar';

interface SidebarNavLinkProps {
  href: string;
  children: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}

export function SidebarNavLink({ href, children, icon, disabled = false }: SidebarNavLinkProps) {
  const pathname = usePathname();
  const isActive = !disabled && (pathname === href || (href !== '/dashboard' && pathname.startsWith(href)));

  if (disabled) {
    return (
        <SidebarMenuButton asChild disabled={true} tooltip={{children: "This feature is coming soon!"}}>
            <span className="w-full">
                {icon}
                <span className="truncate">{children}</span>
            </span>
        </SidebarMenuButton>
    );
  }

  return (
    <SidebarMenuButton asChild isActive={isActive} tooltip={{children}}>
        <Link href={href}>
            {icon}
            <span className="truncate">{children}</span>
        </Link>
    </SidebarMenuButton>
  );
}

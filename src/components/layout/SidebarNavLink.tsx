
"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import React from 'react';

interface SidebarNavLinkProps {
  href: string;
  children: ReactNode;
  icon?: ReactNode;
  isCollapsed?: boolean;
  onNavigate?: () => void; // New prop
}

export function SidebarNavLink({ href, children, icon, isCollapsed, onNavigate }: SidebarNavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-primary/10",
        isActive && "bg-primary/10 text-primary font-medium",
        isCollapsed && "justify-center"
      )}
      aria-current={isActive ? "page" : undefined}
      onClick={onNavigate} // Call onNavigate when the link is clicked
    >
      {icon && React.cloneElement(icon as React.ReactElement, { className: "h-5 w-5" })}
      {!isCollapsed && <span className="truncate">{children}</span>}
      {isCollapsed && <span className="sr-only">{children}</span>}
    </Link>
  );
}

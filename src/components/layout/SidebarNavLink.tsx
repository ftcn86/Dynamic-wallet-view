"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SidebarNavLinkProps {
  href: string;
  children: ReactNode;
  icon?: ReactNode;
  isCollapsed?: boolean;
}

export function SidebarNavLink({ href, children, icon, isCollapsed }: SidebarNavLinkProps) {
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
    >
      {icon && React.cloneElement(icon as React.ReactElement, { className: "h-5 w-5" })}
      {!isCollapsed && <span className="truncate">{children}</span>}
      {isCollapsed && <span className="sr-only">{children}</span>}
    </Link>
  );
}

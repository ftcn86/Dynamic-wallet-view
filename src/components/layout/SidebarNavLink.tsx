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
  onNavigate?: () => void;
  disabled?: boolean;
}

export function SidebarNavLink({ href, children, icon, isCollapsed, onNavigate, disabled = false }: SidebarNavLinkProps) {
  const pathname = usePathname();
  const isActive = !disabled && (pathname === href || (href !== '/dashboard' && pathname.startsWith(href)));

  const linkClasses = cn(
    "flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium transition-all",
    isCollapsed && "justify-center",
    disabled 
      ? "text-muted-foreground/50 cursor-not-allowed" 
      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
    isActive && !disabled && "bg-gradient-to-r from-primary via-primary to-accent text-white shadow-md hover:text-white"
  );

  const content = (
    <>
      {icon && React.cloneElement(icon as React.ReactElement, { className: "h-5 w-5 shrink-0" })}
      {!isCollapsed && <span className="truncate">{children}</span>}
      {isCollapsed && <span className="sr-only">{children}</span>}
    </>
  );

  if (disabled) {
    return (
      <div className={linkClasses} onClick={onNavigate}>
        {content}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className={linkClasses}
      aria-current={isActive ? "page" : undefined}
      onClick={onNavigate}
    >
      {content}
    </Link>
  );
}


"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SidebarNavLinkProps {
  href: string;
  children: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}

export function SidebarNavLink({ href, children, icon, disabled = false }: SidebarNavLinkProps) {
  const pathname = usePathname();
  const isActive = !disabled && (pathname === href || (href !== '/dashboard' && pathname.startsWith(href)));

  const linkClasses = cn(
    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium transition-all",
    disabled 
      ? "text-muted-foreground/50 cursor-not-allowed" 
      : "text-muted-foreground hover:bg-muted/80 hover:text-foreground",
    isActive && !disabled && "bg-gradient-to-r from-primary via-primary to-accent text-primary-foreground shadow-md hover:text-primary-foreground"
  );

  const content = (
    <>
      {icon && React.cloneElement(icon as React.ReactElement, { className: "h-5 w-5 shrink-0" })}
      <span className="truncate">{children}</span>
    </>
  );

  if (disabled) {
    return (
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger className="w-full">
            <div className={linkClasses}>
              {content}
            </div>
          </TooltipTrigger>
          <TooltipContent side="right" align="center">
            <p>This feature is coming soon!</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Link
      href={href}
      className={linkClasses}
      aria-current={isActive ? "page" : undefined}
    >
      {content}
    </Link>
  );
}


"use client";

import React from 'react';
import { Badge as UiBadge } from '@/components/ui/badge';
import type { KycStatus } from '@/data/schemas';
import { cn } from '@/lib/utils';

// Solid SVG Icons
const ShieldCheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="currentColor"/>
        <path d="m9 12 2 2 4-4" stroke="#fff" strokeWidth="2" />
    </svg>
);

const ShieldAlertIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="currentColor"/>
        <line x1="12" y1="8" x2="12" y2="12" stroke="#fff" strokeWidth="2" />
        <line x1="12" y1="16" x2="12.01" y2="16" stroke="#fff" strokeWidth="2" />
    </svg>
);

const ShieldXIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="currentColor"/>
        <line x1="15" y1="9" x2="9" y2="15" stroke="#fff" strokeWidth="2" />
        <line x1="9" y1="9" x2="15" y2="15" stroke="#fff" strokeWidth="2" />
    </svg>
);


interface KycStatusBadgeProps {
  status: KycStatus | undefined;
  className?: string;
}

const statusConfig = {
    completed: { variant: 'success', icon: ShieldCheckIcon, text: "Completed" },
    pending: { variant: 'warning', icon: ShieldAlertIcon, text: "Pending" },
    not_completed: { variant: 'secondary', icon: ShieldXIcon, text: "Not Completed" }
} as const;


export function KycStatusBadge({ status, className }: KycStatusBadgeProps) {
  if (!status || !statusConfig[status]) return null;

  const { variant, icon: IconComponent, text } = statusConfig[status];

  return (
    <UiBadge variant={variant} className={cn("flex items-center gap-1.5 capitalize", className)}>
      <IconComponent className="h-3.5 w-3.5" />
      {text}
    </UiBadge>
  );
}

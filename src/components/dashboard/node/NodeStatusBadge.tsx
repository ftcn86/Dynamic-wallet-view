
"use client";

import React from 'react';
import { Badge as UiBadge } from '@/components/ui/badge';
import type { NodeStatus } from '@/data/schemas';
import { cn } from '@/lib/utils';

// Solid SVG Icons
const CheckCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" stroke="#fff" strokeWidth="2"/>
    </svg>
);

const ClockIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" stroke="#fff" strokeWidth="1.5" />
    </svg>
);

const ZapIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
);


interface NodeStatusBadgeProps {
  status: NodeStatus | undefined;
  className?: string;
}

const statusConfig = {
    online: { variant: 'success', icon: CheckCircleIcon, text: "Online" },
    synchronizing: { variant: 'warning', icon: ClockIcon, text: "Syncing" },
    offline: { variant: 'destructive', icon: ZapIcon, text: "Offline" }
} as const;

export function NodeStatusBadge({ status, className }: NodeStatusBadgeProps) {
  if (!status || !statusConfig[status]) return null;

  const { variant, icon: IconComponent, text } = statusConfig[status];

  return (
    <UiBadge variant={variant} className={cn("flex items-center gap-1.5 capitalize text-lg px-3 py-1", className)}>
      <IconComponent className="h-4 w-4" />
      {text}
    </UiBadge>
  );
}

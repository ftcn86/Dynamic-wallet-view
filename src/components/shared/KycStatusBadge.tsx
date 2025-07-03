"use client";

import React from 'react';
import { Badge as UiBadge } from '@/components/ui/badge';
import type { KycStatus } from '@/data/schemas';
import { ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react';

interface KycStatusBadgeProps {
  status: KycStatus | undefined;
}

const statusConfig = {
    completed: { variant: 'success', icon: ShieldCheck, text: "Completed" },
    pending: { variant: 'warning', icon: ShieldAlert, text: "Pending" },
    not_completed: { variant: 'secondary', icon: ShieldX, text: "Not Completed" }
} as const;


export function KycStatusBadge({ status }: KycStatusBadgeProps) {
  if (!status || !statusConfig[status]) return null;

  const { variant, icon: IconComponent, text } = statusConfig[status];

  return (
    <UiBadge variant={variant} className="flex items-center gap-1.5">
      <IconComponent className="h-3.5 w-3.5" />
      {text}
    </UiBadge>
  );
}

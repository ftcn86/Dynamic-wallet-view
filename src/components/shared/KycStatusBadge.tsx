
"use client";

import React from 'react';
import { Badge as UiBadge } from '@/components/ui/badge';
import { useTranslation } from '@/hooks/useTranslation';
import type { KycStatus } from '@/data/schemas';
import { ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react';

interface KycStatusBadgeProps {
  status: KycStatus | undefined;
}

export function KycStatusBadge({ status }: KycStatusBadgeProps) {
  const { t } = useTranslation();
  if (!status) return null;

  let variant: 'success' | 'warning' | 'secondary' = 'secondary';
  let IconComponent: React.ElementType = ShieldX;

  switch (status) {
    case 'completed':
      variant = 'success';
      IconComponent = ShieldCheck;
      break;
    case 'pending':
      variant = 'warning';
      IconComponent = ShieldAlert;
      break;
    case 'not_completed':
      variant = 'secondary';
      IconComponent = ShieldX;
      break;
  }

  return (
    <UiBadge variant={variant} className="flex items-center gap-1.5">
      <IconComponent className="h-3.5 w-3.5" />
      {t(`teamInsights.kycStatusValues.${status}`)}
    </UiBadge>
  );
}

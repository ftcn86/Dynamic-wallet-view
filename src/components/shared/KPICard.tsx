
import React, { type ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string;
  icon: ReactNode;
  footerValue?: string;
  change?: string;
  badgeText?: string;
  badgeVariant?: "default" | "secondary" | "destructive" | "success" | "warning" | "info" | "outline" | null | undefined;
}

export function KPICard({ title, value, icon, footerValue, change, badgeText, badgeVariant = 'default' }: KPICardProps) {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-4 flex flex-col justify-between h-full">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              {React.cloneElement(icon as React.ReactElement, { className: "h-5 w-5 text-primary" })}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{title}</p>
              <p className="text-2xl font-bold text-foreground">{value}</p>
            </div>
          </div>
          {badgeText && <Badge variant={badgeVariant}>{badgeText}</Badge>}
        </div>
        <div className="flex items-end justify-between mt-2">
          {footerValue ? (
            <p className="text-xs text-muted-foreground">{footerValue}</p>
          ) : <div />}
          {change && (
            <p className="text-xs font-semibold text-green-500 flex items-center">{change}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

import React, { type ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ArrowUp } from 'lucide-react';

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
    <Card className="shadow-sm hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {React.cloneElement(icon as React.ReactElement, { className: "h-4 w-4 text-muted-foreground" })}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        <div className="flex items-center text-xs text-muted-foreground gap-2">
            <span>{footerValue}</span>
            {change && (
                <span className="flex items-center text-green-500 font-semibold">
                    <ArrowUp className="h-3 w-3 mr-0.5" />
                    {change}
                </span>
            )}
        </div>
        {badgeText && <Badge variant={badgeVariant} className="mt-2">{badgeText}</Badge>}
      </CardContent>
    </Card>
  );
}


import React, { type ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: ReactNode; // Icon should be passed with its desired color
  change?: string; 
  changeColor?: 'text-green-600' | 'text-red-600';
  className?: string;
}

export function KPICard({ title, value, icon, change, changeColor, className }: KPICardProps) {
  return (
    <Card className={cn("shadow-lg hover:shadow-xl transition-shadow", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {/* Clone the icon, but only enforce size. Color is controlled by the passed icon's className. */}
        {React.isValidElement(icon) ? React.cloneElement(icon, { 
          // @ts-ignore next-line
          className: cn("h-5 w-5", icon.props.className) 
        }) : null}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className={cn("text-xs text-muted-foreground", changeColor)}>
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

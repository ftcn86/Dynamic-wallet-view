import type { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  change?: string; // e.g., "+5.2%"
  changeColor?: 'text-green-600' | 'text-red-600'; // Example, can be more robust
  className?: string;
}

export function KPICard({ title, value, icon, change, changeColor, className }: KPICardProps) {
  return (
    <Card className={cn("shadow-lg hover:shadow-xl transition-shadow", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {React.cloneElement(icon as React.ReactElement, { className: "h-5 w-5 text-muted-foreground" })}
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

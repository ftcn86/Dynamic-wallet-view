
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '../ui/skeleton';

export function KPICard() {
  return (
    <Card className="shadow-sm hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-8 w-8 rounded-md" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-7 w-1/2 mb-2" />
        <Skeleton className="h-4 w-1/3" />
      </CardContent>
    </Card>
  );
}

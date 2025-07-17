
"use client"

import * as React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebar } from '../ui/sidebar';

export function MobileSidebar({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { setOpenMobile } = useSidebar();

  return (
    <Sheet onOpenChange={setOpenMobile}>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className={cn("w-72 p-0", className)}>
        <SheetHeader className="sr-only">
          <SheetTitle>Main Navigation</SheetTitle>
          <SheetDescription>A list of links to navigate the application.</SheetDescription>
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  );
}

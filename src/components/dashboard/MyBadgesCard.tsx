
"use client"

import { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '../ui/skeleton';
import { Award, CheckCircle } from 'lucide-react';
import type { Badge } from '@/data/schemas';
import { format, parseISO } from 'date-fns';

function BadgeItem({ badge }: { badge: Badge }) {
  const earnedDate = badge.earnedDate ? format(parseISO(badge.earnedDate), "MMMM dd, yyyy") : '';

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="group relative flex cursor-pointer flex-col items-center space-y-2 rounded-lg border bg-card p-4 text-center transition-all hover:bg-muted/50 hover:shadow-md">
          <Image
            src={badge.iconUrl}
            alt={badge.name}
            width={64}
            height={64}
            className={`rounded-lg transition-all duration-300 ${!badge.earned ? 'grayscale opacity-50' : 'group-hover:scale-110'}`}
            data-ai-hint={badge.dataAiHint || 'badge icon'}
          />
          <p className="w-full truncate text-sm font-medium">{badge.name}</p>
          {!badge.earned && <div className="absolute inset-0 rounded-lg bg-black/20" />}
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="text-center items-center">
            <Image
                src={badge.iconUrl}
                alt={badge.name}
                width={96}
                height={96}
                className="rounded-lg mb-4"
                data-ai-hint={badge.dataAiHint || 'badge icon'}
            />
          <DialogTitle className="text-2xl">{badge.name}</DialogTitle>
          <DialogDescription>{badge.description}</DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          {badge.earned && earnedDate && (
             <div className="flex items-center justify-center text-sm text-green-600 bg-green-500/10 rounded-full px-4 py-2">
                <CheckCircle className="mr-2 h-4 w-4" />
                <span>Earned on {earnedDate}</span>
             </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}


export function MyBadgesCard() {
  const { user } = useAuth();
  
  if (!user) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const sortedBadges = [...user.badges].sort((a, b) => {
    if (a.earned === b.earned) return 0;
    return a.earned ? -1 : 1;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <Award className="h-6 w-6 text-primary" />
          My Badges
        </CardTitle>
        <CardDescription>
          View your earned badges and discover new ones to unlock.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {sortedBadges.map((badge) => (
            <BadgeItem key={badge.id} badge={badge} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

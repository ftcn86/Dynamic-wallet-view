
"use client";

import { useEffect } from 'react'; 
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'; 
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { FileTextIcon, ShieldCheckIcon, LogOutIcon, CheckCircleIcon } from '@/components/shared/icons';

export default function AcceptTermsPage() {
  const { user, setUser, logout, isLoading } = useAuth(); 
  const router = useRouter();

  useEffect(() => {
    if (isLoading) {
      return; 
    }

    if (user && user.termsAccepted) {
      router.replace('/dashboard');
    } else if (!user) { 
      router.replace('/login');
    }
  }, [user, isLoading, router]);

  const handleAccept = () => {
    if (user) {
      setUser({ ...user, termsAccepted: true });
      router.push('/dashboard');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (isLoading || (user && user.termsAccepted) || (!isLoading && !user)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <LoadingSpinner size={48} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <FileTextIcon className="h-8 w-8"/>
          </div>
          <CardTitle className="text-2xl font-headline">Review Our Terms</CardTitle>
          <CardDescription>Before you continue, please review and accept our Terms of Service and Privacy Policy.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            By clicking 'I Accept & Continue', you acknowledge that you have read, understood, and agree to be bound by our Terms of Service and Privacy Policy. You can review these documents by clicking the links below.
          </p>
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3 justify-center">
            <Button variant="link" asChild className="justify-start sm:justify-center">
              <Link href="/legal/terms">
                <FileTextIcon className="mr-2 h-4 w-4" /> Terms of Service
              </Link>
            </Button>
            <Button variant="link" asChild className="justify-start sm:justify-center">
              <Link href="/legal/privacy">
                <ShieldCheckIcon className="mr-2 h-4 w-4" /> Privacy Policy
              </Link>
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:justify-between">
          <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                    <LogOutIcon className="mr-2 h-4 w-4" /> Logout
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                  <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                      <AlertDialogDescription>
                          Are you sure you want to log out?
                      </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
                  </AlertDialogFooter>
              </AlertDialogContent>
          </AlertDialog>
          
          <Button onClick={handleAccept} className="w-full sm:w-auto">
            <CheckCircleIcon className="mr-2 h-4 w-4" /> I Accept & Continue
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

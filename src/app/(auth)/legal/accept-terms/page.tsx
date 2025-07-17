
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

// Solid SVG Icons
const FileTextIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" fill="hsl(var(--primary))"/>
    <polyline points="14 2 14 8 20 8" stroke="hsl(var(--primary-foreground))" strokeWidth="1.5"/>
    <line x1="16" y1="13" x2="8" y2="13" stroke="hsl(var(--primary-foreground))" strokeWidth="1.5"/>
    <line x1="16" y1="17" x2="8" y2="17" stroke="hsl(var(--primary-foreground))" strokeWidth="1.5"/>
    <line x1="10" y1="9" x2="8" y2="9" stroke="hsl(var(--primary-foreground))" strokeWidth="1.5"/>
  </svg>
);

const ShieldCheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="hsl(var(--primary))"/>
    <path d="m9 12 2 2 4-4" stroke="hsl(var(--primary-foreground))" strokeWidth="1.5"/>
  </svg>
);

const LogOutIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" fill="hsl(var(--destructive))" stroke="hsl(var(--destructive))"/>
    <polyline points="16 17 21 12 16 7" stroke="hsl(var(--destructive))" fill="none"/>
    <line x1="21" y1="12" x2="9" y2="12" stroke="hsl(var(--destructive))" fill="none"/>
  </svg>
);

const CheckCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" fill="hsl(var(--primary))" />
      <polyline points="22 4 12 14.01 9 11.01" strokeWidth="3" stroke="hsl(var(--primary-foreground))"/>
    </svg>
);


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
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <FileTextIcon size={36} />
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

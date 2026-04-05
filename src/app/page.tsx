
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppLogo } from '@/components/app-logo';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/patient/login');
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-secondary/50 p-4">
       <div className="absolute top-8">
            <AppLogo className="mx-auto text-5xl" />
        </div>
        <div className="space-y-4 text-center">
            <Skeleton className="h-8 w-64 mx-auto" />
            <Skeleton className="h-6 w-80 mx-auto" />
             <div className="grid grid-cols-1 gap-6 pt-8">
                <Skeleton className="h-32 w-80" />
            </div>
            <p className="text-muted-foreground pt-4">Redirecting to login...</p>
        </div>
    </div>
  );
}

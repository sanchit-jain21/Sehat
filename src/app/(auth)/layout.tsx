import { AppLogo } from '@/components/app-logo';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-secondary/50 p-4">
       <div className="absolute top-8 left-8">
            <AppLogo />
       </div>
       {children}
    </div>
  );
}

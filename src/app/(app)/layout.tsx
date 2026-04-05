
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  CalendarDays,
  FileText,
  HeartPulse,
  LayoutDashboard,
  LogOut,
  MapPin,
  MessageSquare,
  Mic,
  Pill,
  Settings,
  Languages,
  Siren,
  Video,
} from 'lucide-react';
import { AppLogo } from '@/components/app-logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const VoiceCommandButton = dynamic(() =>
  import('@/components/voice-command-button').then((mod) => mod.VoiceCommandButton),
  { ssr: false }
);


const navItems = [
  { href: '/dashboard', labelKey: 'dashboard' , icon: LayoutDashboard },
  { href: '/appointments', labelKey: 'appointments', icon: CalendarDays },
  { href: '/symptom-checker', labelKey: 'symptomChecker', icon: HeartPulse, badge: 'AI' },
  { href: '/doctor-chat', labelKey: 'chatDoctor', icon: MessageSquare },
  { href: '/health-records', labelKey: 'healthRecords', icon: FileText },
  { href: '/video-call', labelKey: 'videoCall', icon: Video },
  { href: '/voice-call', labelKey: 'voiceCall', icon: Mic },
  { href: '/medicine-finder', labelKey: 'medicineFinder', icon: Pill },
  { href: '/pharmacy-locator', labelKey: 'pharmacies', icon: MapPin },
  { href: '/ambulance-nearby', labelKey: 'ambulanceNearby', icon: Siren },
];

function AppSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useTranslation();
  const userImage = PlaceHolderImages.find((img) => img.id === 'user-avatar');


  const handleLogout = () => {
    // In a real app, you'd clear session/token here
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
    router.push('/patient/login');
  };


  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <AppLogo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(item.href)}
                tooltip={{ children: t(item.labelKey) }}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{t(item.labelKey)}</span>
                  {item.badge && (
                     <Badge variant="destructive" className={cn("ml-auto", state === "collapsed" && "hidden")}>{item.badge}</Badge>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="group/menu-item relative">
              <button className="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-data-[collapsible=icon]:!size-10 group-data-[collapsible=icon]:!p-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={userImage?.imageUrl} data-ai-hint={userImage?.imageHint} />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="flex flex-col truncate">
                  <span className="font-semibold">John Doe</span>
                  <span className="text-xs text-sidebar-foreground/70">
                    john.doe@email.com
                  </span>
                </div>
              </button>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="start" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

function AppHeader({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { t, i18n } = useTranslation();
  const pageTitle = navItems.find((item) => pathname.startsWith(item.href))?.labelKey || 'dashboard';

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };


  return (
    <div className="flex h-full flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
        <SidebarTrigger className="md:hidden" />
        <h1 className="text-lg font-semibold md:text-xl">{t(pageTitle)}</h1>
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Languages className="h-5 w-5" />
                <span className="sr-only">Change language</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => changeLanguage('en')}>English</DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage('hi')}>हिन्दी</DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage('pa')}>ਪੰਜਾਬੀ</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <VoiceCommandButton />
        </div>
      </header>
      <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <I18nextProvider i18n={i18n}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <AppHeader>{children}</AppHeader>
        </SidebarInset>
      </SidebarProvider>
    </I18nextProvider>
  );
}

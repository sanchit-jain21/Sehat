import { cn } from '@/lib/utils';
import { HeartPulse } from 'lucide-react';
import { useSidebar } from './ui/sidebar';

export function AppLogo({ className }: { className?: string }) {
  // The useSidebar hook can be used outside of the Sidebar component.
  // We use a try-catch block to prevent errors when the hook is used in a component that is not a child of SidebarProvider.
  let sidebar: ReturnType<typeof useSidebar> | undefined;
  try {
    sidebar = useSidebar();
  } catch (e) {}

  return (
    <div
      className={cn(
        'flex items-center gap-2.5 text-xl font-bold text-sidebar-foreground',
        className
      )}
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/90 text-primary-foreground">
        <HeartPulse className="h-5 w-5" />
      </div>
      <span
        className={cn(
          'truncate',
          sidebar?.state === 'collapsed'
            ? 'group-data-[collapsible=icon]/sidebar-wrapper:hidden'
            : ''
        )}
      >
        TELEMEDICINE
      </span>
    </div>
  );
}

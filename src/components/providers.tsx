"use client";

import { Sidebar, SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { MainSidebar } from "@/components/layout/main-sidebar";
import { MainHeader } from "@/components/layout/main-header";
import { useIsMobile } from "@/hooks/use-mobile";

export function Providers({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
      <Sidebar collapsible={!isMobile ? "icon" : "offcanvas"}>
        <MainSidebar />
      </Sidebar>
      <SidebarInset>
        <MainHeader />
        <div className="min-h-[calc(100vh-4rem)] flex-1 overflow-y-auto bg-background p-4 pt-0 sm:p-6 lg:p-8">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

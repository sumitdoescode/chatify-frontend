import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import SocketProvider from "@/contexts/SockerProvider";

export default async function MainLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <SocketProvider>
            <SidebarProvider className="h-full min-h-0 overflow-hidden">
                <AppSidebar />
                <SidebarInset className="min-h-0 overflow-hidden">
                    <div className="flex h-full min-h-0 items-stretch overflow-hidden">
                        <SidebarTrigger className="-ml-1" />
                        <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </SocketProvider>
    );
}

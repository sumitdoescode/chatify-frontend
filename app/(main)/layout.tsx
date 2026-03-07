import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import SocketProvider from "@/components/socket-provider";

export default async function MainLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <SocketProvider>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <div className="flex items-stretch">
                        <SidebarTrigger className="-ml-1" />
                        <div className="flex-1">{children}</div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </SocketProvider>
    );
}

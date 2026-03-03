import { NavUser } from "@/components/nav-user";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { GalleryVerticalEndIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Users from "./Users";
import Chats from "./Chats";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function AppSidebar() {
    const cookieStore = await cookies();

    const res = await fetch(`${process.env.BACKEND_URL}/api/users/me`, {
        headers: {
            Cookie: cookieStore.toString(),
        },
    });
    if (res.status === 401) {
        redirect("/login");
    }
    const { user } = await res.json();
    return (
        <Sidebar collapsible="offcanvas">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg">
                            <div className="flex items-center gap-2">
                                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                    <GalleryVerticalEndIcon />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-sm">Chatify</span>
                                    <span className="truncate text-xs">Realtime Messaging</span>
                                </div>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <Tabs defaultValue="chats" className="w-full mt-2 p-2">
                    <TabsList className="w-full bg-muted">
                        <TabsTrigger value="chats" className="flex-1">
                            Chats
                        </TabsTrigger>
                        <TabsTrigger value="users" className="flex-1">
                            Users
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="chats">
                        <Chats />
                    </TabsContent>
                    <TabsContent value="users">
                        <Users />
                    </TabsContent>
                </Tabs>
            </SidebarContent>

            <SidebarFooter>
                <NavUser user={user} />
            </SidebarFooter>
        </Sidebar>
    );
}

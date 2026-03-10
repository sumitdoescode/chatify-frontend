"use client";

import { NavUser } from "@/components/nav-user";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { GalleryVerticalEndIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Users from "./Users";
import Chats from "./Chats";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clearFrontendSessionCookie } from "@/lib/session-cookie";

type SidebarUser = {
    name: string;
    email: string;
    profileImage: string;
};

export function AppSidebar() {
    const router = useRouter();
    const [user, setUser] = useState<SidebarUser | null>(null);

    useEffect(() => {
        let ignore = false;

        const loadUser = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/me`, {
                    credentials: "include",
                });

                if (res.status === 401) {
                    clearFrontendSessionCookie();
                    router.replace("/login");
                    return;
                }

                if (!res.ok) {
                    throw new Error("Failed to fetch current user");
                }

                const data = await res.json();
                if (!ignore) {
                    setUser(data.user);
                }
            } catch (error) {
                console.log(error);
            }
        };

        loadUser();

        return () => {
            ignore = true;
        };
    }, [router]);

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

            {user ? (
                <SidebarFooter>
                    <NavUser user={user} />
                </SidebarFooter>
            ) : null}
        </Sidebar>
    );
}

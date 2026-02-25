"use client";

import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";
import { GalleryVerticalEndIcon, AudioLinesIcon, TerminalIcon, TerminalSquareIcon, BotIcon, BookOpenIcon, Settings2Icon, FrameIcon, PieChartIcon, MapIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// This is sample data.
const data = {
    teams: [
        {
            name: "Chatify",
            logo: <GalleryVerticalEndIcon />,
            plan: "Real-time messages",
        },
    ],
    projects: [
        {
            name: "Design Engineering",
            url: "#",
            icon: <FrameIcon />,
        },
        {
            name: "Sales & Marketing",
            url: "#",
            icon: <PieChartIcon />,
        },
        {
            name: "Travel",
            url: "#",
            icon: <MapIcon />,
        },
    ],
};

export function AppSidebar({ user }: { user: any }) {
    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <TeamSwitcher teams={data.teams} />
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
                    <TabsContent value="chats"></TabsContent>
                    <TabsContent value="users">
                        <NavProjects projects={data.projects} />
                    </TabsContent>
                </Tabs>
            </SidebarContent>

            <SidebarFooter>
                <NavUser user={user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}

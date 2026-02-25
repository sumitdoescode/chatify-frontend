"use client";

import * as React from "react";

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";

export function TeamSwitcher({
    teams,
}: {
    teams: {
        name: string;
        logo: React.ReactNode;
        plan: string;
    }[];
}) {
    const [activeTeam, setActiveTeam] = React.useState(teams[0]);
    if (!activeTeam) {
        return null;
    }
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <div className="flex items-center gap-2">
                    <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">{activeTeam.logo}</div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-sm">{activeTeam.name}</span>
                        <span className="truncate text-xs">{activeTeam.plan}</span>
                    </div>
                </div>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}

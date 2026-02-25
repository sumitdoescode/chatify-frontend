import React from "react";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { MessageCircleMore } from "lucide-react";

const page = () => {
    return (
        <div className="flex items-center justify-center min-h-screen -mt-10">
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <MessageCircleMore className="size-12" />
                    </EmptyMedia>
                    <EmptyTitle className="text-2xl font-medium">Select a chat</EmptyTitle>
                    <EmptyDescription className="text-base text-muted-foreground">Choose a user from the sidebar to start chatting or continue a previous conversation.</EmptyDescription>
                </EmptyHeader>
            </Empty>
        </div>
    );
};

export default page;

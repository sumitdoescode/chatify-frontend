"use client";

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "./ui/empty";
import { Users as UsersIcon } from "lucide-react";
import ChatsClient from "./ChatsClient";
import { useEffect, useState } from "react";

export interface IChat {
    _id: string;
    name: string;
    email: string;
    profileImage?: string;
    lastMessage?: string;
    lastMessageIsImage?: boolean;
    unreadCount?: number;
    createdAt?: string;
    otherParticipantId?: string;
}

const Chats = () => {
    const [chats, setChats] = useState<IChat[]>([]);

    useEffect(() => {
        let ignore = false;

        const loadChats = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chats`, {
                    credentials: "include",
                });
                if (!res.ok) {
                    throw new Error("Failed to fetch chats");
                }

                const data = await res.json();
                if (!ignore) {
                    setChats(data.chats ?? []);
                }
            } catch (error) {
                console.log(error);
            }
        };

        loadChats();

        return () => {
            ignore = true;
        };
    }, []);

    if (!chats.length) {
        return (
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <UsersIcon />
                    </EmptyMedia>
                    <EmptyTitle>No Users Yet</EmptyTitle>
                    <EmptyDescription>Our application currently doesn&apos;t have any users. Please try again later.</EmptyDescription>
                </EmptyHeader>
            </Empty>
        );
    }
    return <ChatsClient initialChats={chats} />;
};

export default Chats;

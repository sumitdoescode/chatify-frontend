"use client";

import { useEffect, useState } from "react";
import Chat from "./Chat";
import type { IChat } from "./Chats";
import { ItemGroup } from "@/components/ui/item";
import { useSocket } from "@/contexts/SockerProvider";

export default function ChatsClient({ initialChats }: { initialChats: IChat[] }) {
    const { socket } = useSocket();
    const [chats, setChats] = useState<IChat[]>(initialChats);

    useEffect(() => {
        setChats(initialChats);
    }, [initialChats]);

    useEffect(() => {
        if (!socket) return;

        const onUnreadUpdate = ({ chatId, unreadCount }: { chatId: string; unreadCount: number }) => {
            setChats((prev) => prev.map((chat) => (chat._id === chatId ? { ...chat, unreadCount } : chat)));
        };

        socket.on("unread:update", onUnreadUpdate);
        return () => {
            socket.off("unread:update", onUnreadUpdate);
        };
    }, [socket]);

    useEffect(() => {
        if (!socket) return;

        const onNewMessage = (message: any) => {
            setChats((prev) => {
                const chat = prev.find((item) => item._id === message.chat);
                if (!chat) return prev;

                const text = message.text?.trim() || "";
                const isImageOnly = Boolean(message.image) && !text;

                const updatedChat = {
                    ...chat,
                    lastMessage: text || (isImageOnly ? "Image" : ""),
                    lastMessageIsImage: isImageOnly,
                    createdAt: message.createdAt,
                };

                return [updatedChat, ...prev.filter((item) => item._id !== message.chat)];
            });
        };

        socket.on("message:new", onNewMessage);

        return () => {
            socket.off("message:new", onNewMessage);
        };
    }, [socket]);

    return (
        <ItemGroup className="mt-5 gap-1">
            {chats.map((chat) => (
                <Chat key={chat._id} {...chat} />
            ))}
        </ItemGroup>
    );
}

"use client";

import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { useSocket } from "@/contexts/SockerProvider";
import { Button } from "./ui/button";

interface IMessage {
    _id: string;
    sender: string;
    receiver: string;
    text?: string;
    image?: string;
    createdAt?: string;
    chat: string;
}

interface IPagination {
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

export function ChatContent({ chatId, messages, otherUserId, pagination }: { chatId: string; messages: IMessage[]; otherUserId: string; pagination: IPagination }) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const shouldScrollToBottomRef = useRef(true);

    const { socket } = useSocket();

    const [localMessages, setLocalMessages] = useState<IMessage[]>(messages);
    const [localPagination, setLocalPagination] = useState<IPagination>(pagination);
    const [loadingOlder, setLoadingOlder] = useState(false);

    useEffect(() => {
        shouldScrollToBottomRef.current = true;
        setLocalMessages(messages);
        setLocalPagination(pagination);
    }, [messages, pagination, chatId]);

    useEffect(() => {
        if (!scrollRef.current) return;

        if (!shouldScrollToBottomRef.current) {
            shouldScrollToBottomRef.current = true;
            return;
        }

        scrollRef.current.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [localMessages]);

    useEffect(() => {
        if (!socket) return;

        const onNewMessage = (msg: IMessage) => {
            if (String(msg.chat) !== chatId) return;
            shouldScrollToBottomRef.current = true;
            setLocalMessages((prev) => [...prev, msg]);
        };

        socket.on("message:new", onNewMessage);
        return () => {
            socket.off("message:new", onNewMessage);
        };
    }, [socket, chatId]);

    const loadOlderMessages = async () => {
        if (loadingOlder || !localPagination.hasNext) return;

        try {
            setLoadingOlder(true);

            const nextPage = localPagination.page + 1;
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chats/${chatId}/messages?page=${nextPage}&limit=${localPagination.limit}`, {
                credentials: "include",
            });

            if (!res.ok) return;

            const data = await res.json();

            shouldScrollToBottomRef.current = false;
            setLocalMessages((prev) => [...data.messages, ...prev]);
            setLocalPagination(data.pagination);
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingOlder(false);
        }
    };

    if (!localMessages.length) {
        return <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">No messages yet. Start the conversation.</div>;
    }

    return (
        <div ref={scrollRef} className="flex flex-col gap-4 p-4 overflow-y-auto flex-1">
            {localPagination.hasNext ? (
                <Button type="button" variant="secondary" className="mx-auto" disabled={loadingOlder} onClick={loadOlderMessages}>
                    {loadingOlder ? "Loading..." : "Load older messages"}
                </Button>
            ) : null}

            {localMessages.map((message) => {
                const isOwn = message.receiver === otherUserId;
                return (
                    <div key={message._id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-xs rounded-xl ${message.text && !message.image ? "px-3" : "px-1.5"} py-1.5 ${isOwn ? "bg-primary/90 text-primary-foreground" : "bg-muted text-foreground"}`}>
                            {message.image ? (
                                <a href={message.image} target="_blank" rel="noreferrer">
                                    <img src={message.image} alt="message attachment" className="mb-1 max-w-full max-h-80 rounded-xl border object-cover" loading="lazy" />
                                </a>
                            ) : null}

                            {message.text ? <p className="text-sm whitespace-pre-wrap wrap-break-word">{message.text}</p> : null}

                            <p className={`mt-1 text-[11px] ${isOwn ? "text-primary-foreground" : "text-muted-foreground"} text-right`}>{dayjs(message.createdAt).format("HH:mm")}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

"use client";

import { useEffect, useRef } from "react";
import dayjs from "dayjs";

interface IMessage {
    _id: string;
    sender: string;
    receiver: string;
    text?: string;
    image?: string;
    createdAt?: string;
}

export function ChatContent({ messages, otherUserId }: { messages: IMessage[]; otherUserId: string }) {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!scrollRef.current) return;
        scrollRef.current.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [messages]);

    if (!messages.length) {
        return <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">No messages yet. Start the conversation.</div>;
    }

    return (
        <div ref={scrollRef} className="flex flex-col gap-4 p-4 overflow-y-auto flex-1">
            {messages.map((message) => {
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

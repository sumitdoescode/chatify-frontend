"use client";

import { ChatContent } from "@/components/ChatContent";
import { ChatFooter } from "@/components/ChatFooter";
import { ChatHeader } from "@/components/ChatHeader";
import { clearFrontendSessionCookie } from "@/lib/session-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type User = {
    _id: string;
    name: string;
    email: string;
    profileImage?: string;
};

type Message = {
    _id: string;
    sender: string;
    receiver: string;
    text?: string;
    image?: string;
    createdAt?: string;
    chat: string;
};

type Pagination = {
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
};

const initialPagination: Pagination = {
    page: 1,
    limit: 50,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
};

export default function ChatPageClient({ chatId }: { chatId: string }) {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [receiverId, setReceiverId] = useState("");
    const [pagination, setPagination] = useState<Pagination>(initialPagination);

    useEffect(() => {
        let ignore = false;

        const loadChat = async () => {
            try {
                const chatRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chats/${chatId}`, {
                    credentials: "include",
                });

                if (chatRes.status === 401) {
                    clearFrontendSessionCookie();
                    router.replace("/login");
                    return;
                }

                if (!chatRes.ok) {
                    router.replace("/");
                    return;
                }

                const chatData = await chatRes.json();
                const otherParticipant = chatData?.chat?.otherParticipant ?? null;

                const messagesRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chats/${chatId}/messages?page=1&limit=50`, {
                    credentials: "include",
                });

                let nextMessages: Message[] = [];
                let nextPagination = initialPagination;
                if (messagesRes.ok) {
                    const messagesData = await messagesRes.json();
                    nextMessages = messagesData.messages ?? [];
                    nextPagination = messagesData.pagination ?? initialPagination;
                }

                if (!ignore) {
                    setUser(otherParticipant);
                    setReceiverId(otherParticipant?._id ?? "");
                    setMessages(nextMessages);
                    setPagination(nextPagination);
                }
            } catch (error) {
                console.log(error);
                router.replace("/");
            }
        };

        loadChat();

        return () => {
            ignore = true;
        };
    }, [chatId, router]);

    return (
        <div className="flex h-full min-h-0 flex-col overflow-hidden">
            <ChatHeader user={user} chatId={chatId} />
            <ChatContent key={chatId} chatId={chatId} messages={messages} otherUserId={receiverId} pagination={pagination} />
            <ChatFooter receiverId={receiverId} />
        </div>
    );
}

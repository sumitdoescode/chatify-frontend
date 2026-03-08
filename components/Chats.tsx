import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "./ui/empty";
import { Users as UsersIcon } from "lucide-react";
import { cookies } from "next/headers";
import ChatsClient from "./ChatsClient";

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

const Chats = async () => {
    const cookieStore = await cookies();

    let chats: IChat[] = [];
    try {
        const res = await fetch(`${process.env.BACKEND_URL}/api/chats`, {
            headers: {
                Cookie: cookieStore.toString(),
            },
        });
        if (!res.ok) {
            throw new Error("Failed to fetch chats");
        }
        const data = await res.json();
        chats = data.chats;
    } catch (error) {
        console.log(error);
        // toast("Failed to fetch chats");
    }

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

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "./ui/empty";
import { Users as UsersIcon } from "lucide-react";
import { cookies } from "next/headers";
import { ItemGroup } from "@/components/ui/item";
import Chat from "./Chat";

export interface IChat {
    _id: string;
    name: string;
    email: string;
    profileImage?: string;
    lastMessage?: string;
    unreadCount?: number;
    createdAt?: string;
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
    }

    if (!chats.length) {
        return (
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <UsersIcon />
                    </EmptyMedia>
                    <EmptyTitle>No Users Yet</EmptyTitle>
                    <EmptyDescription>Our application currently doesn't have any users. Please try again later.</EmptyDescription>
                </EmptyHeader>
            </Empty>
        );
    }
    return (
        <ItemGroup className="mt-5 gap-1">
            {chats.map((chat: IChat) => (
                <Chat key={chat._id} {...chat} />
            ))}
        </ItemGroup>
    );
};

export default Chats;

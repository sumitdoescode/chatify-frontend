"use client";

import { Avatar, AvatarFallback, AvatarImage, AvatarBadge } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { PlusIcon } from "lucide-react";
import { IUser } from "./Users";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useState } from "react";
import { Spinner } from "./ui/spinner";
import AvatarWithIndicator from "./AvatarWithIndicator";

const User = ({ _id, name, email, profileImage }: IUser) => {
    const router = useRouter();
    const [resolving, setResolving] = useState(false);

    const openChat = async () => {
        try {
            setResolving(true);
            const { data } = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chats/resolve`,
                { userId: _id },
                {
                    withCredentials: true,
                },
            );
            if (data?.chatId) {
                router.push(`/chat/${data.chatId}`);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setResolving(false);
        }
    };

    return (
        <Item key={_id} className="border border-border hover:bg-secondary cursor-pointer" onClick={openChat}>
            <ItemMedia>
                <AvatarWithIndicator otherParticipantId={_id} profileImage={profileImage} name={name} />
            </ItemMedia>
            <ItemContent>
                <ItemTitle className="text-base">{name}</ItemTitle>
                <ItemDescription className="-mt-1 text-xs">{email}</ItemDescription>
            </ItemContent>
            <ItemActions>
                <Button variant="ghost" size="icon" className="size-8" disabled={resolving}>
                    {resolving ? <Spinner className="size-6" /> : <PlusIcon className="size-6" />}
                </Button>
            </ItemActions>
        </Item>
    );
};

export default User;

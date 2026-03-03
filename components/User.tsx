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

const User = ({ _id, name, email, profileImage }: IUser) => {
    const router = useRouter();
    const [resolving, setResolving] = useState(false);

    const openChat = async () => {
        try {
            setResolving(true);
            const { data } = await axios.post(
                "http://localhost:8000/api/chats/resolve",
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
                <Avatar className="size-10">
                    <AvatarImage src={profileImage} />
                    <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                    <AvatarBadge className="bg-green-600 dark:bg-green-600" />
                </Avatar>
            </ItemMedia>
            <ItemContent>
                <ItemTitle className="text-sm">{name}</ItemTitle>
                <ItemDescription className="-mt-1 text-xs">{email}</ItemDescription>
            </ItemContent>
            <ItemActions>
                <Button variant="ghost" size="icon" className="size-8" disabled={resolving}>
                    {resolving ? <Spinner /> : <PlusIcon />}
                </Button>
            </ItemActions>
        </Item>
    );
};

export default User;

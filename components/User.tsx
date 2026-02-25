import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "./ui/empty";
import { Users as UsersIcon } from "lucide-react";
import { cookies } from "next/headers";
import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage, AvatarBadge } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemSeparator, ItemTitle } from "@/components/ui/item";
import { PlusIcon } from "lucide-react";
import { IUser } from "./Users";
const User = ({ _id, name, email, profileImage }: IUser) => {
    return (
        <Item key={_id} className="bg-secondary">
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
                <Button variant="ghost" size="icon" className="size-8">
                    <PlusIcon />
                </Button>
            </ItemActions>
        </Item>
    );
};

export default User;

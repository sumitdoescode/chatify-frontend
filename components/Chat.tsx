import { Avatar, AvatarFallback, AvatarImage, AvatarBadge } from "@/components/ui/avatar";
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Badge } from "@/components/ui/badge";
import { IChat } from "./Chats";
import Link from "next/link";
import dayjs from "dayjs";

const Chat = ({ _id, name, profileImage, lastMessage, unreadCount, createdAt }: IChat) => {
    return (
        <Link href={`/chat/${_id}`}>
            <Item key={_id} className="border border-border hover:bg-secondary cursor-pointer">
                <ItemMedia>
                    <Avatar className="size-12">
                        <AvatarImage src={profileImage} />
                        <AvatarFallback>{name?.charAt(0)}</AvatarFallback>
                        <AvatarBadge className="bg-green-600 dark:bg-green-600" />
                    </Avatar>
                </ItemMedia>

                <ItemContent>
                    <ItemTitle className="text-base">{name}</ItemTitle>
                    <ItemDescription className="-mt-1 text-xs line-clamp-1">{lastMessage?.slice(0, 30) + "..." || "No messages yet"}</ItemDescription>
                </ItemContent>

                <ItemActions className={`flex flex-col gap-0 items-end min-w-16`}>
                    <span className="text-xs text-muted-foreground">{dayjs(createdAt).format("HH:mm")}</span>
                    {Boolean(unreadCount) && (
                        <Badge variant="secondary" className="font-mono rounded-full bg-white text-black border border-black min-w-6 h-6 px-1.5 justify-center">
                            {unreadCount}
                        </Badge>
                    )}
                </ItemActions>
            </Item>
        </Link>
    );
};

export default Chat;

"use client";
import { Avatar, AvatarFallback, AvatarImage, AvatarBadge } from "@/components/ui/avatar";
import { useSocket } from "@/contexts/SockerProvider";

interface props {
    profileImage?: string;
    name: string;
    otherParticipantId?: string;
}

const AvatarWithIndicator = ({ profileImage, name, otherParticipantId }: props) => {
    const { onlineUsersId } = useSocket();
    const isOnline = onlineUsersId.includes(otherParticipantId!);
    return (
        <Avatar className="size-12">
            <AvatarImage src={profileImage} />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
            {isOnline && <AvatarBadge className="bg-green-600 dark:bg-green-600" />}
        </Avatar>
    );
};

export default AvatarWithIndicator;

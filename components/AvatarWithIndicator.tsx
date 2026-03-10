"use client";
import { Avatar, AvatarFallback, AvatarImage, AvatarBadge } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useSocket } from "@/contexts/SockerProvider";

interface props {
    profileImage?: string;
    name: string;
    otherParticipantId?: string;
    avatarClassName?: string;
    imageLoading?: "eager" | "lazy";
    imageFetchPriority?: "high" | "low" | "auto";
}

const AvatarWithIndicator = ({ profileImage, name, otherParticipantId, avatarClassName, imageLoading = "lazy", imageFetchPriority = "auto" }: props) => {
    const { onlineUsersId } = useSocket();
    const isOnline = otherParticipantId ? onlineUsersId.includes(otherParticipantId) : false;

    return (
        <Avatar className={cn("size-12", avatarClassName)}>
            <AvatarImage src={profileImage} alt={name} loading={imageLoading} fetchPriority={imageFetchPriority} decoding="async" referrerPolicy="no-referrer" />
            <AvatarFallback>{name.trim().charAt(0).toUpperCase()}</AvatarFallback>
            {isOnline && <AvatarBadge className="bg-green-600 dark:bg-green-600" />}
        </Avatar>
    );
};

export default AvatarWithIndicator;

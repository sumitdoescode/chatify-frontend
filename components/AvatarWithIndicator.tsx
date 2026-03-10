"use client";
import { Avatar, AvatarFallback, AvatarBadge } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useSocket } from "@/contexts/SockerProvider";
import Image from "next/image";
import { useState } from "react";

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
    const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
    const [failedSrc, setFailedSrc] = useState<string | null>(null);
    const isLoaded = Boolean(profileImage) && loadedSrc === profileImage;
    const hasError = Boolean(profileImage) && failedSrc === profileImage;
    const showFallback = !profileImage || !isLoaded;

    return (
        <Avatar className={cn("size-12", avatarClassName)}>
            {profileImage && !hasError ? (
                <Image
                    key={profileImage}
                    src={profileImage}
                    alt={name}
                    fill
                    sizes="48px"
                    loading={imageLoading}
                    fetchPriority={imageFetchPriority}
                    referrerPolicy="no-referrer"
                    onLoad={() => setLoadedSrc(profileImage)}
                    onError={() => setFailedSrc(profileImage)}
                    className={cn("rounded-full object-cover transition-opacity", isLoaded ? "opacity-100" : "opacity-0")}
                />
            ) : null}
            <AvatarFallback className={showFallback ? undefined : "opacity-0"}>{name.trim().charAt(0).toUpperCase()}</AvatarFallback>
            {isOnline && <AvatarBadge className="bg-green-600 dark:bg-green-600" />}
        </Avatar>
    );
};

export default AvatarWithIndicator;

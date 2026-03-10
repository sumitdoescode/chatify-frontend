"use client";
import { IUser } from "./Users";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { useState } from "react";
import { Spinner } from "./ui/spinner";
import AvatarWithIndicator from "./AvatarWithIndicator";

export function ChatHeader({ user, chatId }: { user: IUser | null; chatId?: string }) {
    const router = useRouter();
    const [deleting, setDeleting] = useState(false);

    const deleteChat = async () => {
        if (!chatId) return;
        try {
            setDeleting(true);
            await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chats/${chatId}`, {
                withCredentials: true,
            });
            toast.success("Chat deleted");
            router.push("/");
            router.refresh();
        } catch (error) {
            console.log(error);
            toast.error("Failed to delete chat");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="flex items-center justify-between p-4 border-b bg-background">
            <div className="flex items-center gap-3">
                <AvatarWithIndicator
                    otherParticipantId={user?._id}
                    profileImage={user?.profileImage}
                    name={user?.name ?? "?"}
                    avatarClassName="size-12"
                    imageLoading="eager"
                    imageFetchPriority="high"
                />

                <div>
                    <p className="text-base font-medium">
                        {user?.name} {user?.email ? <span className="text-[11px] text-muted-foreground font-normal">({user.email})</span> : null}
                    </p>
                </div>
            </div>

            {chatId && (
                <AlertDialog>
                    <AlertDialogTrigger
                        render={
                            <Button variant="destructive" size="icon" className={"p-4 rounded cursor-pointer"}>
                                <Trash2 className="size-5" />
                            </Button>
                        }
                    />
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete this chat?</AlertDialogTitle>
                            <AlertDialogDescription>This will permanently delete this chat and all messages.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={deleteChat} disabled={deleting}>
                                {deleting ? (
                                    <>
                                        Deleting...
                                        <Spinner />
                                    </>
                                ) : (
                                    "Delete"
                                )}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </div>
    );
}

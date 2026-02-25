import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { X } from "lucide-react";
import { IUser } from "./Users";

export function ChatHeader({ user }: { user: IUser }) {
    return (
        <div className="flex items-center justify-between p-4 border-b bg-background">
            <div className="flex items-center gap-3">
                <Avatar>
                    <AvatarImage src={user?.profileImage} />
                    <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                </Avatar>

                <div>
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">Online</p>
                </div>
            </div>

            {/* <button className="p-1 rounded-md hover:bg-muted">
                <X className="w-4 h-4" />
            </button> */}
        </div>
    );
}

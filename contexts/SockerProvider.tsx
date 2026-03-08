"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
    socket: Socket | null;
    onlineUsersId: string[];
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    onlineUsersId: [],
});

export default function SocketProvider({ children }: { children: React.ReactNode }) {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [onlineUsersId, setOnlineUsersId] = useState<string[]>([]);

    useEffect(() => {
        const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL!, {
            withCredentials: true,
        });
        socket.on("getOnlineUsers", (users: string[]) => {
            setOnlineUsersId(users);
        });
        setSocket(socket);

        return () => {
            socket.disconnect();
        };
    }, []);

    return <SocketContext.Provider value={{ socket, onlineUsersId }}>{children}</SocketContext.Provider>;
}

export function useSocket() {
    return useContext(SocketContext);
}

"use client";
import { io } from "socket.io-client";
import React, { useEffect } from "react";

export default function SocketProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL!, {
            withCredentials: true,
        });

        socket.on("connect", () => {
            console.log("Connected to server");
        });

        socket.on("getOnlineUsers", (userSocketMap) => {
            console.log("online users are", userSocketMap);
        });

        // when the componennt unmounts disconnect the socket
        return () => {
            socket.disconnect();
        };
    }, []);

    return children;
}

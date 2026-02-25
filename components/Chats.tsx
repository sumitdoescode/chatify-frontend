import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { MessageCircleMore } from "lucide-react";

const Chats = () => {
    const [chats, setChats] = useState([]);
    useEffect(() => {
        const fetchChats = async () => {
            try {
                const { data } = await axios.get("http://localhost:8000/api/chats", {
                    withCredentials: true,
                });
                setChats(data.chats);
            } catch (error) {
                console.log(error);
            }
        };
        fetchChats();
    }, []);

    if (!chats.length) {
        return (
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <MessageCircleMore />
                    </EmptyMedia>
                    <EmptyTitle>No Chats Yet</EmptyTitle>
                    <EmptyDescription>Go to Users to start chatting with others..</EmptyDescription>
                </EmptyHeader>
            </Empty>
        );
    }

    return (
        <div>
            {chats.map((chat: any) => (
                <div key={chat._id}>{chat.name}</div>
            ))}
        </div>
    );
};

export default Chats;

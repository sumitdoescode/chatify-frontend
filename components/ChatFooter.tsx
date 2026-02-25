"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageIcon, Send } from "lucide-react";
import axios from "axios";
import { useState } from "react";
import { Spinner } from "./ui/spinner";

export function ChatFooter({ receiverId }: { receiverId: string }) {
    const [message, setMessage] = useState("");
    const [sending, isSending] = useState(false);

    const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            isSending(true);
            const { data } = await axios.post(
                `http://localhost:8000/api/messages/${receiverId}`,
                {
                    text: message,
                },
                {
                    withCredentials: true,
                },
            );
            console.log(data);
            setMessage("");
        } catch (error) {
            console.log(error);
        } finally {
            isSending(false);
        }
    };
    return (
        <form onSubmit={sendMessage} className="flex items-center gap-2 p-3 border-t bg-background">
            <Input placeholder="Type your message..." className="flex-1" value={message} onChange={(e) => setMessage(e.target.value)} />

            {/* <Button variant="ghost" size="icon" disabled={sending}>
                <ImageIcon className="w-4 h-4" />
            </Button> */}

            <Button size="icon" type="submit" disabled={sending || !message.trim().length}>
                {sending ? <Spinner /> : <Send className="w-4 h-4" />}
            </Button>
        </form>
    );
}

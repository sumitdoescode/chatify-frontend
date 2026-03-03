"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageIcon, Send, X } from "lucide-react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Spinner } from "./ui/spinner";
import { useRouter } from "next/navigation";

export function ChatFooter({ receiverId }: { receiverId: string }) {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messageInputRef = useRef<HTMLInputElement>(null);
    const [message, setMessage] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [sending, isSending] = useState(false);

    useEffect(() => {
        if (!image) {
            setPreviewUrl(null);
            return;
        }

        const url = URL.createObjectURL(image);
        setPreviewUrl(url);
        messageInputRef.current?.focus();
        return () => URL.revokeObjectURL(url);
    }, [image]);

    useEffect(() => {
        messageInputRef.current?.focus();
    }, [receiverId]);

    const clearImage = () => {
        setImage(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!message.trim() && !image) return;

        try {
            isSending(true);

            const formData = new FormData();
            if (message.trim()) formData.append("text", message.trim());
            if (image) formData.append("image", image);

            await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/messages/${receiverId}`, formData, {
                withCredentials: true,
            });

            setMessage("");
            clearImage();
            router.refresh();
            messageInputRef.current?.focus();
        } catch (error: any) {
            console.log(error?.response?.data || error);
        } finally {
            isSending(false);
        }
    };

    return (
        <form onSubmit={sendMessage} className="flex flex-col gap-2 p-3 border-t bg-background">
            {previewUrl && (
                <div className="relative w-fit">
                    <img src={previewUrl} alt="Selected preview" className="max-h-32 max-w-40 rounded-md border object-cover" />
                    <Button type="button" size="icon" variant="secondary" className="absolute -right-2 -top-2 size-6 rounded-full" onClick={clearImage}>
                        <X className="size-3.5" />
                    </Button>
                </div>
            )}

            <div className="flex items-center gap-2">
                <Input ref={messageInputRef} placeholder="Type your message..." className="flex-1" value={message} onChange={(e) => setMessage(e.target.value)} />

                <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setImage(file);
                    }}
                />

                <Button type="button" variant="ghost" size="icon" disabled={sending} onClick={() => fileInputRef.current?.click()}>
                    <ImageIcon className="w-4 h-4" />
                </Button>

                <Button size="icon" type="submit" disabled={sending || (!message.trim().length && !image)}>
                    {sending ? <Spinner /> : <Send className="w-4 h-4" />}
                </Button>
            </div>
        </form>
    );
}

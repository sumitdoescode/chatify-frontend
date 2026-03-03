import { ChatContent } from "@/components/ChatContent";
import { ChatFooter } from "@/components/ChatFooter";
import { ChatHeader } from "@/components/ChatHeader";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const cookieStore = await cookies();
    const headers = { Cookie: cookieStore.toString() };

    let user: any = null;
    let messages: any[] = [];
    let receiverId = "";

    try {
        const chatRes = await fetch(`http://localhost:8000/api/chats/${id}`, { headers });
        if (!chatRes.ok) {
            notFound();
        }

        const chatData = await chatRes.json();
        user = chatData?.chat?.otherParticipant || null;
        receiverId = user?._id || "";

        const messagesRes = await fetch(`http://localhost:8000/api/chats/${id}/messages?page=1&limit=50`, { headers });
        if (messagesRes.ok) {
            const messagesData = await messagesRes.json();
            messages = messagesData.messages || [];
        }
    } catch (error) {
        console.log(error);
        notFound();
    }

    return (
        <div className="h-screen flex flex-col">
            <ChatHeader user={user} chatId={id} />
            <ChatContent messages={messages} otherUserId={receiverId} />
            <ChatFooter receiverId={receiverId} />
        </div>
    );
};

export default page;

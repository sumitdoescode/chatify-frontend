import { ChatContent } from "@/components/ChatContent";
import { ChatFooter } from "@/components/ChatFooter";
import { ChatHeader } from "@/components/ChatHeader";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const cookieStore = await cookies();
    const headers = { Cookie: cookieStore.toString() };

    let user = null;
    let messages: any[] = [];
    let receiverId = "";
    let pagination = {
        page: 1,
        limit: 50,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
    };

    try {
        const chatRes = await fetch(`${process.env.BACKEND_URL}/api/chats/${id}`, { headers });
        if (!chatRes.ok) {
            notFound();
        }

        const chatData = await chatRes.json();
        user = chatData?.chat?.otherParticipant || null;
        receiverId = user?._id || "";

        const messagesRes = await fetch(`${process.env.BACKEND_URL}/api/chats/${id}/messages?page=1&limit=50`, { headers });
        if (messagesRes.ok) {
            const messagesData = await messagesRes.json();
            messages = messagesData.messages || [];
            pagination = messagesData.pagination || pagination;
        }
    } catch (error) {
        console.log(error);
        notFound();
    }

    return (
        <div className="h-screen flex flex-col">
            <ChatHeader user={user} chatId={id} />
            <ChatContent key={id} chatId={id} messages={messages} otherUserId={receiverId} pagination={pagination} />
            <ChatFooter receiverId={receiverId} />
        </div>
    );
};

export default page;

import { ChatContent } from "@/components/ChatContent";
import { ChatFooter } from "@/components/ChatFooter";
import { ChatHeader } from "@/components/ChatHeader";
import { cookies } from "next/headers";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const cookieStore = await cookies();
    let data;
    try {
        const res = await fetch(`http://localhost:8000/api/users/${id}`, {
            headers: {
                Cookie: cookieStore.toString(),
            },
        });

        data = await res.json();
        console.log({ data });
    } catch (error) {
        console.log(error);
    }
    return (
        <div className="h-screen flex flex-col">
            <ChatHeader user={data?.user} />
            <ChatContent messages={[]} />
            <ChatFooter receiverId={id} />
        </div>
    );
};

export default page;

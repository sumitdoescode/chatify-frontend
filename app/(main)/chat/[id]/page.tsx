import ChatPageClient from "@/components/ChatPageClient";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    return <ChatPageClient chatId={id} />;
};

export default page;

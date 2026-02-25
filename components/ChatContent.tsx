import Image from "next/image";

function MessageBubble({ isOwn, children }: { isOwn?: boolean; children: React.ReactNode }) {
    return <div className={`max-w-xs w-fit px-4 py-2 rounded-2xl text-sm ${isOwn ? "ml-auto bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>{children}</div>;
}

export function ChatContent({ messages }: { messages: any[] }) {
    return (
        <div className="flex flex-col gap-4 p-4 overflow-y-auto flex-1">
            {/* Incoming */}
            <MessageBubble>Hey man!</MessageBubble>

            {/* Outgoing */}
            <MessageBubble isOwn>Yo sup?!</MessageBubble>

            {/* Image Message */}
            {/* <div className="ml-auto flex flex-col gap-2 items-end">
                <div className="rounded-xl overflow-hidden border bg-muted">
                    <Image src="/demo.jpg" alt="shared" width={200} height={200} className="object-cover" />
                </div>

                <MessageBubble isOwn>Look where i am at the moment! 😄</MessageBubble>
            </div> */}
        </div>
    );
}

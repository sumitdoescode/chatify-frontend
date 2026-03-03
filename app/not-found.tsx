import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { SearchX } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="flex min-h-screen items-center justify-center p-6">
            <Empty className="max-w-md border border-dashed">
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <SearchX className="size-5" />
                    </EmptyMedia>
                    <EmptyTitle className="text-xl">Page Not Found</EmptyTitle>
                    <EmptyDescription className="text-sm">The page you are looking for does not exist or was moved. Try going back to your chats.</EmptyDescription>
                </EmptyHeader>

                <EmptyContent className="flex-row justify-center">
                    <Link href="/">
                        <Button size={"lg"}>Go Home</Button>
                    </Link>
                </EmptyContent>
            </Empty>
        </div>
    );
}

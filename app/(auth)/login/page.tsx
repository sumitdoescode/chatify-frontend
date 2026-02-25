"use client";

import { LoginForm } from "@/components/login-form";
import { GalleryVerticalEndIcon } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
    return (
        <div className="flex flex-col p-4 min-h-svh">
            <div className="flex justify-center gap-2 md:justify-start">
                <Link href="/" className="flex items-center gap-2 font-medium">
                    <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                        <GalleryVerticalEndIcon className="size-4" />
                    </div>
                    Chatify
                </Link>
            </div>
            <div className="flex flex-1 items-center justify-center -mt-10">
                <div className="w-full max-w-xs">
                    <LoginForm />
                </div>
            </div>
        </div>
    );
}

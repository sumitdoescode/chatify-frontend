import React from "react";
import { ModeToggle } from "./ui/mode-toggle";
import Link from "next/link";

const Navbar = () => {
    return (
        <nav className="py-2 bg-neutral-950">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between">
                    <Link href="/">
                        <h1 className="text-2xl font-bold">Chatify</h1>
                    </Link>
                    <ModeToggle />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

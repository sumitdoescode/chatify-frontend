"use client";

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "./ui/empty";
import { Users as UsersIcon } from "lucide-react";
import { ItemGroup } from "@/components/ui/item";
import User from "./User";
import { useEffect, useState } from "react";

export interface IUser {
    _id: string;
    name: string;
    email: string;
    profileImage?: string;
}

const Users = () => {
    const [users, setUsers] = useState<IUser[]>([]);

    useEffect(() => {
        let ignore = false;

        const loadUsers = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`, {
                    credentials: "include",
                });
                if (!res.ok) {
                    throw new Error("Failed to fetch users");
                }

                const data = await res.json();
                if (!ignore) {
                    setUsers(data.users ?? []);
                }
            } catch (error) {
                console.log(error);
            }
        };

        loadUsers();

        return () => {
            ignore = true;
        };
    }, []);

    if (!users.length) {
        return (
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <UsersIcon />
                    </EmptyMedia>
                    <EmptyTitle>No Users Yet</EmptyTitle>
                    <EmptyDescription>Our application currently doesn&apos;t have any users. Please try again later.</EmptyDescription>
                </EmptyHeader>
            </Empty>
        );
    }
    return (
        <ItemGroup className="mt-5 gap-1">
            {users.map((user: IUser) => (
                <User key={user._id} {...user} />
            ))}
        </ItemGroup>
    );
};

export default Users;

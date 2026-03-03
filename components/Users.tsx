import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "./ui/empty";
import { Users as UsersIcon } from "lucide-react";
import { cookies } from "next/headers";
import { ItemGroup } from "@/components/ui/item";
import User from "./User";

export interface IUser {
    _id: string;
    name: string;
    email: string;
    profileImage?: string;
}

const Users = async () => {
    const cookieStore = await cookies();

    let users: IUser[] = [];
    try {
        const res = await fetch(`${process.env.BACKEND_URL}/api/users`, {
            headers: {
                Cookie: cookieStore.toString(),
            },
        });
        if (!res.ok) {
            throw new Error("Failed to fetch users");
        }
        const data = await res.json();
        users = data.users;
    } catch (error) {
        console.log(error);
    }

    if (!users.length) {
        return (
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <UsersIcon />
                    </EmptyMedia>
                    <EmptyTitle>No Users Yet</EmptyTitle>
                    <EmptyDescription>Our application currently doesn't have any users. Please try again later.</EmptyDescription>
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

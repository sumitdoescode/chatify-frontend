import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function MainLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const cookieStore = await cookies();

    const res = await fetch("http://localhost:8000/api/users/me", {
        headers: {
            Cookie: cookieStore.toString(),
        },
    });
    if (res.status === 401) {
        redirect("/login");
    }
    const data = await res.json();
    console.log(data);
    return (
        <SidebarProvider>
            <AppSidebar user={data.user} />
            <SidebarInset>
                <div className="flex items-stretch">
                    <SidebarTrigger className="-ml-1" />
                    <div className="flex-1">{children}</div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}

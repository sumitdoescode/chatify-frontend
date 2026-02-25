import { AppSidebar } from "@/components/app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
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
        <>
            <AppSidebar user={data.user} />
            <SidebarInset>
                <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <div className="flex-1">
                        <h1>Main page</h1>
                    </div>
                </div>
            </SidebarInset>
        </>
    );
}

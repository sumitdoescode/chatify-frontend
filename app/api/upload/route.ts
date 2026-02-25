import { put, del } from "@vercel/blob";
import { type NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

// POST => /api/upload
export async function POST(request: NextRequest) {
    try {
        // const session = await
        const formData = await request.formData();
        const profileImage = formData.get("profileImage") as File;
        const oldProfileImage = formData.get("oldProfileImage") as string;

        if (!profileImage) {
            return NextResponse.json({ success: false, message: "No file uploaded" }, { status: 400 });
        }

        const blob = await put(profileImage.name, profileImage, {
            access: "public",
            addRandomSuffix: true,
        });

        if (oldProfileImage) {
            await del(oldProfileImage);
        }

        return NextResponse.json({ success: true, profileImageUrl: blob.url }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: "Failed to upload image" }, { status: 500 });
    }
}

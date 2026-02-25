"use client";

import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { ChevronsUpDownIcon, UserRoundCog, Trash2, LogOutIcon } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { authClient } from "@/lib/auth-client";
import { Spinner } from "./ui/spinner";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import axios from "axios";
import { EditProfileSchema } from "@/schemas/user.schema";
import { flattenError } from "zod";
import { Field, FieldDescription, FieldGroup, FieldError } from "@/components/ui/field";

export function NavUser({ user }: { user: { name: string; email: string; profileImage: string } }) {
    console.log({ user });
    const router = useRouter();
    const { isMobile } = useSidebar();

    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isEditProfileDialogOpen, setIsEditProfileDialogOpen] = useState(false);
    const [isDeleteEmailSending, setIsDeleteEmailSending] = useState(false);
    const [isDeleteEmailSent, setIsDeleteEmailSent] = useState(false);
    const [isSavingProfile, setIsSavingProfile] = useState(false);

    const [editProfileForm, setEditProfileForm] = useState<{ name: string; profileImage: File | null; profileImagePreview: string | null }>({
        name: user?.name || "",
        profileImage: null,
        profileImagePreview: null,
    });
    const [errors, setErrors] = useState<{ name?: string[]; profileImage?: string[] }>({ name: [], profileImage: [] });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setEditProfileForm((prev) => ({
            ...prev,
            profileImage: file,
            profileImagePreview: URL.createObjectURL(file),
        }));
        if (errors.profileImage) {
            setErrors((prev) => ({ ...prev, profileImage: undefined }));
        }
    };

    const handleDialogClose = (open: boolean) => {
        if (!open) {
            setEditProfileForm({
                name: user.name,
                profileImage: null,
                profileImagePreview: null,
            });
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
        setIsEditProfileDialogOpen(open);
    };

    const deleteAccount = async () => {
        setIsDeleteEmailSending(true);
        await authClient.deleteUser({
            callbackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/register`,
        });
        setIsDeleteEmailSending(false);
        setIsDeleteEmailSent(true);
        toast.success("Check your email to delete your account");
    };

    const signOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/login");
                },
            },
        });
        toast.success("Logged out successfully");
    };

    const uploadImage = async () => {
        const formData = new FormData();
        formData.append("profileImage", editProfileForm.profileImage!);
        if (user.profileImage) {
            formData.append("oldProfileImage", user.profileImage);
        }

        const { data } = await axios.post("/api/upload", formData);
        return data.profileImageUrl;
    };

    const handleEditProfile = async () => {
        setErrors({});

        // client side validation
        const editProfileData: { name: string; profileImage?: File } = {
            name: editProfileForm.name || "",
        };
        if (editProfileForm.profileImage) {
            editProfileData.profileImage = editProfileForm.profileImage;
        }

        const result = EditProfileSchema.safeParse(editProfileData);
        if (!result.success) {
            setErrors(flattenError(result.error).fieldErrors);
            return;
        }

        try {
            setIsSavingProfile(true);
            if (editProfileForm.profileImage) {
                const profileImageUrl = await uploadImage();
                await authClient.updateUser({
                    name: result.data.name,
                    image: profileImageUrl,
                });
            } else {
                await authClient.updateUser({
                    name: result.data.name,
                });
            }

            toast.success("Profile edited successfully");
            router.refresh();
            setIsEditProfileDialogOpen(false);
        } catch (error) {
            toast.error("Failed to edit profile");
            console.log(error);
        } finally {
            setIsSavingProfile(false);
        }
    };

    return (
        <>
            <SidebarMenu>
                <SidebarMenuItem>
                    <DropdownMenu>
                        <DropdownMenuTrigger render={<SidebarMenuButton size="lg" className="aria-expanded:bg-muted" />}>
                            <Avatar className={"size-10"}>
                                <AvatarImage src={user?.profileImage} alt={user?.name} />
                                <AvatarFallback>{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>

                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{user?.name}</span>
                                <span className="truncate text-xs">{user?.email}</span>
                            </div>

                            <ChevronsUpDownIcon className="ml-auto size-4" />
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className="min-w-56 rounded-lg" side={isMobile ? "bottom" : "right"} align="end" sideOffset={4}>
                            <DropdownMenuGroup>
                                <DropdownMenuLabel className="p-0 font-normal">
                                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                        <Avatar className="size-9">
                                            <AvatarImage src={user?.profileImage} alt={user?.name} />
                                            <AvatarFallback>{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
                                        </Avatar>

                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-medium">{user?.name}</span>
                                            <span className="truncate text-xs">{user?.email}</span>
                                        </div>
                                    </div>
                                </DropdownMenuLabel>
                            </DropdownMenuGroup>

                            <DropdownMenuSeparator />

                            {/* logout */}
                            <DropdownMenuGroup>
                                <DropdownMenuItem onClick={signOut}>
                                    <LogOutIcon />
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuGroup>

                            <DropdownMenuSeparator />

                            {/* Edit Profile */}
                            <DropdownMenuGroup>
                                <DropdownMenuItem onClick={() => setIsEditProfileDialogOpen(true)}>
                                    <UserRoundCog />
                                    Edit Profile
                                </DropdownMenuItem>
                            </DropdownMenuGroup>

                            <DropdownMenuSeparator />

                            {/* Delete Account */}
                            <DropdownMenuItem variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
                                <Trash2 />
                                Delete Account
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarMenuItem>
            </SidebarMenu>

            {/* Delete Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Account</AlertDialogTitle>
                        <AlertDialogDescription>By clicking send, we will send you a link on your email to delete your account</AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={deleteAccount} disabled={isDeleteEmailSending || isDeleteEmailSent}>
                            {isDeleteEmailSent ? (
                                "Sent"
                            ) : isDeleteEmailSending ? (
                                <>
                                    Sending...
                                    <Spinner />
                                </>
                            ) : (
                                "Send"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* edit profile dialog */}
            <Dialog open={isEditProfileDialogOpen} onOpenChange={handleDialogClose}>
                <form>
                    <DialogContent className="sm:max-w-sm">
                        <DialogHeader>
                            <DialogTitle>Edit profile</DialogTitle>
                            <DialogDescription>Make changes to your profile here. Click save when you&apos;re done.</DialogDescription>
                        </DialogHeader>
                        <FieldGroup>
                            <Field>
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={editProfileForm.name}
                                    onChange={(e) => {
                                        setEditProfileForm((prev) => ({ ...prev, name: e.target.value }));
                                        if (errors?.name) {
                                            setErrors((prev) => ({ ...prev, name: undefined }));
                                        }
                                    }}
                                />
                                {errors?.name && <FieldError>{errors.name[0]}</FieldError>}
                            </Field>
                            <Field>
                                <Label htmlFor="profile-image">Profile Image</Label>
                                <div
                                    className="relative flex h-32 w-full cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/30 transition hover:bg-muted/50"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {editProfileForm.profileImagePreview || user?.profileImage ? (
                                        <Image src={editProfileForm.profileImagePreview ?? user.profileImage} alt="Profile preview" fill className="object-cover" />
                                    ) : (
                                        <>
                                            <ImageIcon className="size-8 text-muted-foreground/50" />
                                            <span className="text-xs text-muted-foreground">Click to upload image</span>
                                        </>
                                    )}

                                    {/* change image overlay */}
                                    {(editProfileForm.profileImagePreview || user?.profileImage) && (
                                        <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/40 opacity-0 transition hover:opacity-100">
                                            <ImageIcon className="size-4 text-white" />
                                            <span className="text-xs text-white">Change image</span>
                                        </div>
                                    )}
                                </div>

                                <Input ref={fileInputRef} id="profile-image" name="profileImage" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                                {errors?.profileImage && <FieldError>{errors.profileImage[0]}</FieldError>}
                            </Field>
                        </FieldGroup>
                        <DialogFooter>
                            <DialogClose render={<Button variant="outline">Cancel</Button>} />
                            <Button type="submit" disabled={isSavingProfile} onClick={handleEditProfile}>
                                {isSavingProfile ? (
                                    <>
                                        Saving...
                                        <Spinner />
                                    </>
                                ) : (
                                    "Save changes"
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </form>
            </Dialog>
        </>
    );
}

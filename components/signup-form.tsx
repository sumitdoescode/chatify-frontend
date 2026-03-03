"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Link from "next/link";
import { RegisterSchema } from "@/schemas/user.schema";
import { flattenError, z } from "zod";
import axios from "axios";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function SignupForm({ className, ...props }: React.ComponentProps<"div">) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });
    type ErrorType = {
        name?: string[];
        email?: string[];
        password?: string[];
    };
    const [errors, setErrors] = useState<ErrorType>({});
    const [loading, setLoading] = useState(false);

    const register = async (formData: z.infer<typeof RegisterSchema>) => {
        try {
            setLoading(true);
            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/register`, formData);
            if (data.success) {
                toast.success("Verify your email and login to continue");
                router.push("/login");
            }
        } catch (error: any) {
            console.log(error);
            setErrors(error.response?.data.errors);
        } finally {
            setLoading(false);
        }
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // client side validation
        const result = RegisterSchema.safeParse(formData);
        if (!result.success) {
            setErrors(flattenError(result.error).fieldErrors);
            return;
        }
        register(result.data);
    };
    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Create your account</CardTitle>
                    <CardDescription>Enter your email below to create your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="name">Name</FieldLabel>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="John"
                                    required
                                    value={formData.name}
                                    onChange={(e) => {
                                        setFormData({ ...formData, name: e.target.value });
                                        setErrors({ ...errors, name: undefined });
                                    }}
                                />
                                {errors?.name && errors?.name.map((error) => <FieldError key={error}>{error}</FieldError>)}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    value={formData.email}
                                    onChange={(e) => {
                                        setFormData({ ...formData, email: e.target.value });
                                        setErrors({ ...errors, email: undefined });
                                    }}
                                />
                                {errors?.email && errors?.email.map((error) => <FieldError key={error}>{error}</FieldError>)}
                            </Field>
                            <Field>
                                <Field className="">
                                    <Field>
                                        <FieldLabel htmlFor="password">Password</FieldLabel>
                                        <Input
                                            id="password"
                                            type="password"
                                            required
                                            value={formData.password}
                                            onChange={(e) => {
                                                setFormData({ ...formData, password: e.target.value });
                                                setErrors({ ...errors, password: undefined });
                                            }}
                                        />
                                    </Field>
                                </Field>
                                {errors?.password && errors?.password.map((error) => <FieldError key={error}>{error}</FieldError>)}
                                {!errors?.password && <FieldDescription>Must be at least 8 characters long.</FieldDescription>}
                            </Field>
                            <Field>
                                <Button type="submit" disabled={loading}>
                                    {loading ? "Creating..." : "Create Account"}
                                    {loading && <Spinner />}
                                </Button>
                                <FieldDescription className="text-center">
                                    Already have an account? <Link href="/login">Login</Link>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

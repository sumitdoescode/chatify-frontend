"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LoginSchema } from "@/schemas/user.schema";
import axios from "axios";
import { flattenError, z } from "zod";
import { Spinner } from "./ui/spinner";

export function LoginForm({ className, ...props }: React.ComponentProps<"form">) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    type ErrorType = {
        email?: string[];
        password?: string[];
    };
    const [errors, setErrors] = useState<ErrorType>({});
    const [loading, setLoading] = useState(false);

    const login = async (formData: z.infer<typeof LoginSchema>) => {
        try {
            setLoading(true);
            const { data } = await axios.post("http://localhost:8000/api/users/login", formData, { withCredentials: true });
            if (data.success) {
                toast.success("Login successful");
                // console.log(data);
                router.push("/");
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
        const result = LoginSchema.safeParse(formData);
        if (!result.success) {
            setErrors(flattenError(result.error).fieldErrors);
            return;
        }
        login(result.data);
    };
    return (
        <form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={handleSubmit}>
            <FieldGroup>
                <div className="flex flex-col items-center gap-1 text-center">
                    <h1 className="text-2xl font-bold">Login to your account</h1>
                    <p className="text-muted-foreground text-sm text-balance">Enter your email below to login to your account</p>
                </div>
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
                    <div className="flex items-center">
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
                            Forgot your password?
                        </a>
                    </div>
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
                    {errors?.password && errors?.password.map((error) => <FieldError key={error}>{error}</FieldError>)}
                </Field>
                <Field>
                    <Button type="submit" disabled={loading}>
                        {loading ? <Spinner /> : "Login"}
                    </Button>
                </Field>

                <Field>
                    <FieldDescription className="text-center">
                        Don&apos;t have an account?{" "}
                        <Link href="/register" className="underline underline-offset-4">
                            Register
                        </Link>
                    </FieldDescription>
                </Field>
            </FieldGroup>
        </form>
    );
}

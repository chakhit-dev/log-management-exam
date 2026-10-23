
"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

export function SignIn() {
    const router = useRouter()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    async function handleSubmit(formData: FormData) {
        setError("")
        setLoading(true)

        try {
            const email = formData.get("email")
            const password = formData.get("password")

            if (
                typeof email !== "string" ||
                typeof password !== "string"
            ) {
                setError("กรุณากรอกอีเมลและรหัสผ่าน")
                return
            }

            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            })

            if (!result || result.error) {
                setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง")
                return
            }

            router.push("/dashboard")
        } catch {
            setError("เกิดข้อผิดพลาด กรุณาลองใหม่")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>Login to your account</CardTitle>
                <CardDescription>
                    Enter your email below to login to your account
                </CardDescription>
            </CardHeader>

            <form action={handleSubmit}>
                <CardContent>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                            />
                        </div>

                        {error && (
                            <p className="text-sm text-red-500" role="alert">
                                {error}
                            </p>
                        )}
                    </div>
                </CardContent>

                <CardFooter className="flex-col gap-2">
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                    >
                        Login with Google
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}

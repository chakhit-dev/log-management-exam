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

            if (typeof email !== "string" || typeof password !== "string") {
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
            router.refresh()
        } catch {
            setError("เกิดข้อผิดพลาด กรุณาลองใหม่")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-[90vh] w-full flex-col items-center justify-center px-4 py-8 gap-6">
            <div className="w-full max-w-md rounded-xl border border-primary/20 bg-primary/5 p-5 text-center shadow-sm">
                <div className="flex items-center justify-center gap-2 mb-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                        Secure Audit & Log System
                    </span>
                </div>
                <h2 className="text-lg font-bold tracking-tight text-foreground">
                    Log Management Portal
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                    ระบบรวบรวม ตรวจสอบ และวิเคราะห์ Log ความปลอดภัย
                </p>
            </div>

            <Card className="w-full max-w-md border-border/60 shadow-xl shadow-black/5">
                <CardHeader className="space-y-1.5 text-center pt-6 pb-4">
                    <CardTitle className="text-xl font-bold tracking-tight">
                        Sign In to Dashboard
                    </CardTitle>
                    <CardDescription className="text-xs text-muted-foreground">
                        Authentication required to access system logs
                    </CardDescription>
                </CardHeader>

                <form action={handleSubmit}>
                    <CardContent className="space-y-5 pb-4">
                        {error && (
                            <div className="rounded-lg bg-destructive/15 p-3 text-sm font-medium text-destructive text-center" role="alert">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="admin@company.com"
                                required
                                className="h-11 px-3"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <a 
                                    href="/forgot-password" 
                                    className="text-xs text-muted-foreground hover:text-primary underline-offset-4 hover:underline"
                                >
                                    Forgot password?
                                </a>
                            </div>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="h-11 px-3"
                            />
                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-col gap-3 pt-2 pb-6">
                        <Button
                            type="submit"
                            className="h-11 w-full text-base font-medium shadow-sm transition-all"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    Authenticating...
                                </span>
                            ) : (
                                "Login"
                            )}
                        </Button>


                        <div className="mt-4 text-center text-xs text-muted-foreground">
                            Don&apos;t have an account?{" "}
                            <a 
                                href="/sign-up" 
                                className="font-medium text-primary hover:underline underline-offset-4"
                            >
                                Register system access
                            </a>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
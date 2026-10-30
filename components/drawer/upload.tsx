"use client"

import * as React from "react"
import { FileUp } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export function DrawerUpload() {
    const [file, setFile] = useState<File | null>(null)
    const [tenant, setTenant] = useState("default")
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")
    const [isSuccess, setIsSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!file) {
            setMessage("กรุณาเลือกไฟล์ก่อนอัพโหลด")
            setIsSuccess(false)
            return
        }

        setLoading(true)
        setMessage("")
        setIsSuccess(false)

        try {
            const formData = new FormData()
            formData.append("file", file)

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            })

            const data = await res.json()

            if (res.ok && data.status === "success") {
                setMessage(data.message || "อัพโหลดและบันทึก Log สำเร็จ")
                setIsSuccess(true)
                setFile(null)
            } else {
                setMessage(`เกิดข้อผิดพลาด: ${data.message || data.error || "ไม่สามารถอัปโหลดได้"}`)
                setIsSuccess(false)
            }
        } catch (err: any) {
            setMessage(`เกิดข้อผิดพลาดในการเชื่อมต่อ: ${err.message}`)
            setIsSuccess(false)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Drawer>
            <DrawerTrigger asChild>
                <div className='flex items-center gap-2.5 p-2.5 rounded-lg pl-4 text-neutral-600 hover:bg-black/5 hover:text-black cursor-pointer transition-all'>
                    <FileUp size={16} />
                    <div className='mt-0.5'>Upload</div>
                </div>
            </DrawerTrigger>

            <DrawerContent>
                <div className="mx-auto w-full max-w-md">
                    <DrawerHeader>
                        <DrawerTitle>อัพโหลด Log ไฟล์</DrawerTitle>
                        <DrawerDescription>นำเข้าไฟล์ Log เข้าสู่ระบบ ClickHouse ของคุณ</DrawerDescription>
                    </DrawerHeader>

                    <form onSubmit={handleSubmit} className="p-4 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="file">ไฟล์ Log (.json)</Label>
                            <Input
                                id="file"
                                type="file"
                                accept=".json,.txt,.log"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                required
                            />
                        </div>

                        {message && (
                            <p className={`text-sm font-medium ${isSuccess ? "text-green-600" : "text-destructive"}`}>
                                {message}
                            </p>
                        )}

                        <DrawerFooter className="px-0 pt-2">
                            <Button type="submit" disabled={loading} className="w-full">
                                {loading ? "กำลังอัพโหลดและบันทึก..." : "อัพโหลดไฟล์"}
                            </Button>
                            <DrawerClose asChild>
                                <Button variant="outline" type="button" className="w-full">
                                    Cancel
                                </Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </form>
                </div>
            </DrawerContent>
        </Drawer>
    )
}
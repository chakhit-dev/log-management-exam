import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface bodyTeant {
    id: number;
    name: string;
}

export async function POST(req: NextRequest) {
    try {
        const body: bodyTeant = await req.json();

        const tenant = await prisma.tenants.create({
            data: {
                id: body.id,
                name: body.name
            },
        });

        try {
            await fetch("http://localhost:8080/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    tenant: body.name,
                    source: "nextjs_api",
                    event_type: "tenant_created_success",
                    user: "admin_system",
                    status_code: 200
                }),
            });
        } catch (logError) {
            console.error("Failed to send log to Vector:", logError);
        }

        return NextResponse.json({
            id: Number(tenant.id),
            name: tenant.name
        }, { status: 200 });
    } catch (error: any) {

        try {
            await fetch("http://localhost:8080/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    tenant: "unknown",
                    source: "nextjs_api",
                    event_type: "tenant_created_error",
                    user: "admin_system",
                    status_code: 500
                }),
            });
        } catch (logError) {}

        return NextResponse.json(
            { error: error.message || "Internal Server Error" }, 
            { status: 500 }
        );
    }
}
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface MembershipData {
    email: string;
    tenant_id: number;
    role?: "TenantAdmin" | "Viewer";
}

export async function POST(req: NextRequest) {
    try {
        const body: MembershipData = await req.json();

        const user = await prisma.users.findUnique({
            where: {
                email: body.email,
            },
        });

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        const tenant = await prisma.tenants.findUnique({
            where: {
                id: body.tenant_id,
            },
        });

        if (!tenant) {
            return NextResponse.json(
                { message: "Tenant not found" },
                { status: 404 }
            );
        }

        const result = await prisma.tenant_memberships.create({
            data: {
                user_id: user.id,
                tenant_id: body.tenant_id,
                role: body.role ?? "Viewer",
            },
        });

        return NextResponse.json(
            {
                message: "Membership created successfully",
                data: result,
            },
            { status: 201 }
        );

    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
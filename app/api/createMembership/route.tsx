import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface MembershipData {
    email: string;
    tenant_id: number;
}

export async function POST(req: NextRequest) {
    try {
        const body: MembershipData = await req.json();

        const user = await prisma.users.findUnique({
            where: {
                email: body.email
            }
        });

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        const result = await prisma.tenant_memberships.create({
            data: {
                user: {
                    connect: {
                        id: user.id
                    }
                },
                tenant: {
                    connect: {
                        id: body.tenant_id
                    }
                },
                role: "Viewer"
            }
        });

        return NextResponse.json({
            message: "Membership created successfully",
            data: result
        }, { status: 201 });

    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
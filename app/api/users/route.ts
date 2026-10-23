import prisma from "@/lib/prisma";
import { saltAndHashPassword } from "@/utils/password";
import { NextRequest, NextResponse } from "next/server";

interface user {
    email: string;
    username: string;
    password: string;
}

export async function POST(req: NextRequest, res: NextResponse) {

    try {
        const body: user = await req.json();
        const hashpassed = await saltAndHashPassword(body.password);

        const user = await prisma.users.create({
            data: {
                username: body.username,
                email: body.email,
                password_hash: hashpassed,
            },
        });

        return NextResponse.json(user)
        
    } catch (error) {
        return NextResponse.json(error)
    }
}
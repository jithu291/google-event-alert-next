import { getUserByEmail } from "@/lib/user";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export async function GET(req: NextRequest) {
    try {

        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const user = await getUserByEmail(session.user.email);

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: {
                name: user.name,
                email: user.email,
                image: user.image,
                phoneNumber: user.phoneNumber || null,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        });

    } catch (error) {
        console.error('Error', error);
        return NextResponse.json(
            { error: 'Failed ' },
            { status: 500 }
        );
    }
}
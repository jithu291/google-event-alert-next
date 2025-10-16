import { updateUserPhone } from "@/lib/user";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
    try {

        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { phoneNumber } = body;

        if (!phoneNumber) {
            return NextResponse.json(
                { error: 'Phone number is required' },
                { status: 400 }
            );
        }

        const result = await updateUserPhone({
            email: session.user.email,
            phoneNumber: phoneNumber.trim(),
        });

        return NextResponse.json({
            success: true,
            message: 'Phone number updated successfully',
            data: result,
        });

    } catch (error) {
        console.error('Error', error);

        return NextResponse.json(
            { error: 'Failed to update' },
            { status: 500 }
        );
    }
}
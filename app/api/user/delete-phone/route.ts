import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function DELETE() {
    try {

        const session = await getServerSession(authOptions);
        const client = await clientPromise;
        const db = client.db();

        if (!session || !session.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }
        const result = await db.collection("users").updateOne(
            { email: session.user.email },
            { $set: { phoneNumber: "" } }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Phone number removed" }
        );
    } catch (error) {
        console.error("Error removing phone number:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
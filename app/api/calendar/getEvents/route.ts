import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getUserByEmail } from "@/lib/user";
import { fetchGoogleCalendarEvents } from "@/lib/googleCalendar";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const email = session.user.email;
        const user = await getUserByEmail(email);

        if (!user || !user.googleRefreshToken) {
            return NextResponse.json(
                { error: "Missing Google credentials" },
                { status: 400 }
            );
        }

        const events = await fetchGoogleCalendarEvents(email);

        return NextResponse.json({ success: true, events });
    } catch (error) {
        console.error("fetch failed:", error);
        return NextResponse.json(
            { error: "Failed to fetch Google Calendar events" },
            { status: 500 }
        );
    }
}

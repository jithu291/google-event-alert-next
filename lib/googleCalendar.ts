import { google } from "googleapis";
import { getUserByEmail, updateUserTokens } from "@/lib/user";

interface TokenData {
    email?: string |null| undefined;
    accessToken?: string;
    refreshToken?: string;
    tokenExpiry?: number;
}

export async function getValidAccessToken({
    email,
    accessToken,
    refreshToken,
    tokenExpiry,
}: TokenData): Promise<string> {
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID!,
        process.env.GOOGLE_CLIENT_SECRET!
    );

    const now = Date.now();
    const isExpired =
        !tokenExpiry || tokenExpiry * 1000 <= now + 60 * 1000;

    if (!isExpired && accessToken) {
        return accessToken;
    }

    try {
        oauth2Client.setCredentials({ refresh_token: refreshToken });
        const { credentials } = await oauth2Client.refreshAccessToken();

        const newAccess = credentials.access_token!;
        const newExpiry = credentials.expiry_date
            ? Math.floor(credentials.expiry_date / 1000)
            : undefined;

        await updateUserTokens(email, {
            googleAccessToken: newAccess,
            tokenExpiry: newExpiry,
        });

        console.log("new access token for :", email);
        return newAccess;
    } catch (err) {
        console.error("Failed", err);
        throw new Error("Failed to refresh access token");
    }
};

export async function fetchGoogleCalendarEvents(email: string) {
    try {
        const user = await getUserByEmail(email);
        if (!user) throw new Error("User not found");

        const accessToken = await getValidAccessToken({
            email: user.email,
            accessToken: user.googleAccessToken,
            refreshToken: user.googleRefreshToken,
            tokenExpiry: user.tokenExpiry,
        });

        const oauth2Client = new google.auth.OAuth2();
        oauth2Client.setCredentials({ access_token: accessToken });

        const calendar = google.calendar({ version: "v3", auth: oauth2Client });

        const now = new Date();
        const fiveMinutesLater = new Date(now.getTime() + 5 * 60 * 1000);

        const response = await calendar.events.list({
            calendarId: "primary",
            timeMin: now.toISOString(),
            timeMax: fiveMinutesLater.toISOString(),
            singleEvents: true,
            orderBy: "startTime",
        });

        const events = response.data.items || [];
        console.log(`Found ${events.length} events in next 5 min for ${email}`, events);

        return events.map((event) => ({
            id: event.id,
            summary: event.summary,
            start: event.start?.dateTime || event.start?.date,
            end: event.end?.dateTime || event.end?.date,
        }));
    } catch (error) {
        console.error("Error fetching Google Calendar events:", error);
        throw error;
    }
};

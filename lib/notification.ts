import clientPromise from "./mongodb";

interface NotificationInput {
    email: string;
    eventId: string;
    phoneNumber: string;
    status: "success" | "failed";
    notifiedAt?: Date;
}

export async function createNotification(data: NotificationInput) {
    try {
        const client = await clientPromise;
        const db = client.db();

        const now = new Date();

        const result = await db.collection("notifications").insertOne({
            ...data,
            notifiedAt: data.notifiedAt || now,
        });

        return result;
    } catch (error) {
        console.error("Error in createNotification:", error);
        throw error;
    }
}

export async function hasNotification(email: string, eventId: string) {
    try {
        const client = await clientPromise;
        const db = client.db();

        const record = await db
            .collection("notifications")
            .findOne({ email, eventId, status: "success" });

        return !!record;
    } catch (error) {
        console.error("Error in hasNotification:", error);
        throw error;
    }
}

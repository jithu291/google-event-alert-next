import 'dotenv/config';

import { Worker } from "bullmq";
import twilio from "twilio";
import { createNotification, hasNotification } from '../notification';

const connection = { host: "127.0.0.1", port: 6379 };
const client = twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);

export const reminderWorker = new Worker(
    "reminderQueue",
    async (job) => {
        try {
            const { phoneNumber, event, email } = job.data;

            const alreadyNotified = await hasNotification(email, event.id);
            if (alreadyNotified) {
                console.log(`Already notified ${email} for event ${event.summary}`);
                return;
            }

            console.log(`Calling.. ${phoneNumber} "${event.summary}"`);

            await client.calls.create({
                twiml: `<Response><Say>Reminder! Your event ${event.summary} is starting soon.</Say></Response>`,
                to: phoneNumber,
                from: process.env.TWILIO_PHONE_NUMBER!,
            });
            await createNotification({
                email,
                eventId: event.id,
                phoneNumber,
                status: "success",
            });
        } catch (err) {
            console.error("Error in reminderWorker:", err);
            await createNotification({
                email: job.data.email,
                eventId: job.data.event.id,
                phoneNumber: job.data.phoneNumber,
                status: "failed",
              });
        }
    },
    { connection }
);

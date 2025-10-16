import { Worker } from "bullmq";
import twilio from "twilio";

const connection = { host: "127.0.0.1", port: 6379 };
const client = twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);

export const reminderWorker = new Worker(
  "reminderQueue",
  async (job) => {
    try {
      const { phoneNumber, event } = job.data;

      console.log(`Sending call to ${phoneNumber} "${event.summary}"`);

      await client.calls.create({
        twiml: `<Response><Say>Reminder! Your event ${event.summary} is starting soon.</Say></Response>`,
        to: phoneNumber,
        from: process.env.TWILIO_PHONE_NUMBER!,
      });
    } catch (err) {
      console.error("Error in reminderWorker:", err);
    }
  },
  { connection }
);

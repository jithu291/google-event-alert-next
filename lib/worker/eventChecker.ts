import 'dotenv/config';

import { Worker } from "bullmq";
import { getAllUsers } from "@/lib/user";
import { fetchGoogleCalendarEvents } from "@/lib/googleCalendar";
import { reminderQueue } from "@/lib/queue";

const connection = { host: "127.0.0.1", port: 6379 };

export const eventCheckerWorker = new Worker(
  "eventCheckQueue",
  async () => {
    try {
      const users = await getAllUsers();

      for (const user of users) {
        try {
          const events = await fetchGoogleCalendarEvents(user.email);

          if (events.length > 0 && user.phoneNumber) {
            for (const event of events) {
              await reminderQueue.add("sendReminder", {
                email: user.email,
                phoneNumber: user.phoneNumber,
                event,
              });
            }
          }
        } catch (err) {
          console.error(`Error fetching events for ${user.email}:`, err);
        }
      }
    } catch (err) {
      console.error("Error in eventCheckerWorker:", err);
    }
  },
  { connection }
);

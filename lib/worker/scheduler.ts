import { Queue } from "bullmq";

const connection = { host: "127.0.0.1", port: 6379 };
const eventCheckQueue = new Queue("eventCheckQueue", { connection });

async function scheduleEventChecks() {
  await eventCheckQueue.add(
    "checkAllEvents",
    {},
    {
      repeat: { cron: "*/1 * * * *" },
      removeOnComplete: true,
      removeOnFail: true,
    }
  );
  console.log("Event scheduler started...");
}

scheduleEventChecks();

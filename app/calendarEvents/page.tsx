import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface Event {
  id: string;
  summary: string;
  start: string;
  end: string;
}

export default async function CalendarEventsPage() {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/calendar/getEvents`, {
    cache: "no-store",
  });
  const data = await res.json();
  const events: Event[] = data.success ? data.events : [];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Upcoming Google Calendar Events</h1>

      {events.length === 0 ? (
        <p className="text-center text-gray-500">No upcoming events in the next 5 minutes.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((event) => (
            <Card key={event.id} className="shadow-sm hover:shadow-md transition">
              <CardHeader>
                <CardTitle>{event.summary || "Untitled Event"}</CardTitle>
                <CardDescription>
                  {new Date(event.start).toLocaleString()} - {new Date(event.end).toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Event ID: {event.id}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

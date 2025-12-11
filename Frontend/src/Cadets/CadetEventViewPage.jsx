import React, { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function CadetEventViewPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/events`)
      .then(res => res.json())
      .then(data => setEvents(data));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <h1 className="text-2xl font-bold text-green-700 mb-4">ðŸ“… Upcoming Events</h1>
      <div className="grid gap-4">
        {events.length === 0 ? (
          <p className="text-gray-500">No events available.</p>
        ) : (
          events.map((event, idx) => (
            <div key={idx} className="bg-white p-4 rounded-xl shadow border border-gray-200">
              <h3 className="text-lg font-semibold text-blue-700">{event.title}</h3>
    <p className="text-sm text-gray-600">
      ðŸ“… {new Date(event.date).toLocaleDateString()} at ðŸ•’ {event.time}
    </p>
    <p className="text-sm text-gray-600">ðŸ“ {event.location}</p>
    <p className="text-sm text-gray-600">ðŸŸ¢ Status: {event.status}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

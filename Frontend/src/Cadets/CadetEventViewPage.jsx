import React, { useEffect, useState } from "react";

export default function CadetEventViewPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/events")
      .then(res => res.json())
      .then(data => setEvents(data));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <h1 className="text-2xl font-bold text-green-700 mb-4">📅 Upcoming Events</h1>
      <div className="grid gap-4">
        {events.length === 0 ? (
          <p className="text-gray-500">No events available.</p>
        ) : (
          events.map((event, idx) => (
            <div key={idx} className="bg-white p-4 rounded-xl shadow border border-gray-200">
              <h3 className="text-lg font-semibold text-blue-700">{event.title}</h3>
    <p className="text-sm text-gray-600">
      📅 {new Date(event.date).toLocaleDateString()} at 🕒 {event.time}
    </p>
    <p className="text-sm text-gray-600">📍 {event.location}</p>
    <p className="text-sm text-gray-600">🟢 Status: {event.status}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function CadetDashboardContent() {
    const [attendance, setAttendance] = useState(null);
    const [events, setEvents] = useState([]);
    const [videos, setVideos] = useState([]);
    const { user: cadet } = useAuth();

    useEffect(() => {
        if (!cadet) return;

        fetch(`http://localhost:5000/api/attendance/cadet/${cadet._id}`)
            .then(res => res.json())
            .then(data => setAttendance(data))
            .catch(err => console.error("Failed to fetch attendance:", err));

        fetch("http://localhost:5000/api/events/upcoming")
            .then(res => res.json())
            .then(data => setEvents(data))
            .catch(err => console.error("Failed to fetch events:", err));

        fetch("http://localhost:5000/api/videos")
            .then(res => res.json())
            .then(data => setVideos(data))
            .catch(err => console.error("Failed to fetch videos:", err));
    }, [cadet]);

    if (!cadet) return null;

    return (
        <div className="p-4 sm:p-6 max-w-7xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-blue-700 mb-4 sm:mb-6">
                🎖️ Welcome, {cadet?.name || "Cadet"}
            </h2>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 sm:mb-6">
                <div className="bg-white p-4 rounded-xl shadow text-center">
                    <p className="text-sm text-gray-500">Attendance</p>
                    <h3 className="text-xl sm:text-2xl font-bold text-green-600">
                        {attendance?.percentage ?? "—"}%
                    </h3>
                </div>
                <div className="bg-white p-4 rounded-xl shadow text-center">
                    <p className="text-sm text-gray-500">Upcoming Events</p>
                    <h3 className="text-xl sm:text-2xl font-bold">{events.length}</h3>
                </div>
                <div className="bg-white p-4 rounded-xl shadow text-center">
                    <p className="text-sm text-gray-500">Drill Videos</p>
                    <h3 className="text-xl sm:text-2xl font-bold">{videos.length}</h3>
                </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white p-4 sm:p-5 rounded-xl shadow mb-4 sm:mb-6">
                <h3 className="text-lg font-semibold mb-3">📅 Upcoming Events</h3>
                <div className="space-y-2">
                    {events.length > 0 ? events.map((event, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-gray-50 p-3 rounded-lg gap-2">
                            <div className="flex-1">
                                <p className="font-semibold">{event.title}</p>
                                <p className="text-sm text-gray-500">
                                    {new Date(event.date).toLocaleDateString()} at {event.time} — {event.location}
                                </p>
                            </div>
                            <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs self-start sm:self-center">
                                {event.type || "Event"}
                            </span>
                        </div>
                    )) : (
                        <p className="text-gray-500">No upcoming events</p>
                    )}
                </div>
            </div>

            {/* Training Videos */}
            <div className="bg-white p-4 sm:p-5 rounded-xl shadow">
                <h3 className="text-lg font-semibold mb-3">🎥 Recent Training Videos</h3>
                <div className="space-y-2">
                    {videos.length > 0 ? videos.map((video, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-gray-50 p-3 rounded-lg gap-2">
                            <div className="flex-1">
                                <p className="font-semibold">{video.title}</p>
                                <p className="text-sm text-gray-500">{video.level} • {video.duration}</p>
                            </div>
                            <button className="bg-orange-500 text-white px-3 py-1 rounded text-sm hover:bg-orange-600 self-start sm:self-center">
                                Watch
                            </button>
                        </div>
                    )) : (
                        <p className="text-gray-500">No videos available</p>
                    )}
                </div>
            </div>
        </div>
    );
}

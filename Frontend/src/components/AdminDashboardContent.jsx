import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AdminDashboardContent() {
    const [stats, setStats] = useState({});
    const [recentCadets, setRecentCadets] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);

    useEffect(() => {
        fetch(`${API_URL}/api/admin/stats`)
            .then(res => res.json())
            .then(data => setStats(data))
            .catch(err => console.error("Failed to fetch stats:", err));

        fetch(`${API_URL}/api/users/cadets`)
            .then(res => res.json())
            .then(data => setRecentCadets(data.slice(0, 3)))
            .catch(err => console.error("Failed to fetch cadets:", err));

        fetch(`${API_URL}/api/events/upcoming`)
            .then(res => res.json())
            .then(data => setUpcomingEvents(data))
            .catch(err => console.error("Failed to fetch events:", err));
    }, []);

    return (
        <div className="p-4 sm:p-6 max-w-7xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Dashboard</h2>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-4 sm:mb-6">
                {[
                    { label: "Total Cadets", value: stats.totalCadets },
                    { label: "Active Events", value: stats.activeEvents }
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white p-4 sm:p-5 rounded-xl shadow text-center">
                        <p className="text-sm text-gray-500">{stat.label}</p>
                        <h3 className="text-xl sm:text-2xl font-bold mt-2">{stat.value ?? "â€”"}</h3>
                    </div>
                ))}
            </div>

            {/* Comment Box */}
            <div className="bg-white p-4 sm:p-5 rounded-xl shadow mb-4 sm:mb-6">
                <h3 className="text-lg font-semibold mb-3">Comments</h3>
                <textarea
                    placeholder="Write your comment..."
                    className="w-full h-20 p-3 border border-gray-300 rounded-lg resize-none text-sm"
                />
                <button className="mt-3 px-4 py-2 bg-orange-400 text-white rounded-md text-sm hover:bg-orange-500">
                    Submit
                </button>
            </div>

            {/* Two Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Recent Cadets */}
                <div className="bg-white p-4 sm:p-5 rounded-xl shadow">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
                        <h3 className="text-lg font-semibold">Recent Cadets</h3>
                        <Link
                            to="/admin/cadet-management"
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm self-start sm:self-auto hover:bg-green-700"
                        >
                            View All
                        </Link>
                    </div>
                    <div className="space-y-2">
                        {recentCadets.map((cadet, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                                <span className="truncate">Cadet {cadet.name || cadet.regno}</span>
                                <span className="bg-green-600 text-white px-2 py-1 rounded text-xs flex-shrink-0 ml-2">Active</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Upcoming Events */}
                <div className="bg-white p-4 sm:p-5 rounded-xl shadow">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
                        <h3 className="text-lg font-semibold">Upcoming Events</h3>
                        <Link
                            to="/admin/events"
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm self-start sm:self-auto hover:bg-green-700"
                        >
                            Manage All
                        </Link>
                    </div>
                    <div className="space-y-2">
                        {upcomingEvents.map((event, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                                <span className="truncate">{event.title}</span>
                                <span className="bg-green-600 text-white px-2 py-1 rounded text-xs flex-shrink-0 ml-2">{event.status}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

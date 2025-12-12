import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.MODE === 'production'
  ? '' // Use relative paths in production
  : import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [recentCadets, setRecentCadets] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const { user: admin, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/api/admin/stats`)
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error("Failed to fetch stats:", err));

    fetch(`${API_URL}/api/users/cadets`)
      .then(res => res.json())
      .then(data => setRecentCadets(data.slice(0, 3))) // latest 3
      .catch(err => console.error("Failed to fetch cadets:", err));

    fetch(`${API_URL}/api/events/upcoming`)
      .then(res => res.json())
      .then(data => setUpcomingEvents(data))
      .catch(err => console.error("Failed to fetch events:", err));
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="flex font-sans bg-gray-100 min-h-screen">
      {/* Sidebar */}
      <aside className="w-[240px] bg-white border-r border-gray-300 flex flex-col justify-between">
        <div>
          <div className="flex items-center p-5 font-bold text-lg">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/NCC_India_Logo.svg/1024px-NCC_India_Logo.svg.png"
              alt="logo"
              className="w-9 mr-3"
            />
            Admin Portal
          </div>
          <div className="bg-green-50 mx-5 p-4 rounded-lg text-left">
            <h4 className="text-base font-semibold">{admin?.name || "Admin"}</h4>
            <p className="text-sm text-gray-500">{admin?.rank || "Commanding Officer"}</p>
          </div>
          <nav className="mt-5">
            {[
              { label: "Dashboard", to: "/admin", active: true },
              { label: "Manage Cadets", to: "/cadet-management" },
              { label: "Manage Events", to: "/update-event" },
              { label: "Drill Videos", to: "/upload-drill" },
              { label: "Attendance", to: "/attendance" },
              { label: "Query Box", to: "/query-box" }
            ].map((item, idx) => (
              <Link
                key={idx}
                to={item.to}
                className={`flex items-center px-5 py-3 mx-2 rounded-lg text-sm font-medium ${item.active ? "bg-orange-400 text-white" : "text-gray-800 hover:bg-orange-100"
                  }`}
              >

                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-gray-300">
          <button
            onClick={handleLogout}
            className="text-red-600 font-bold hover:underline"
          >
            Ã¢â€ Â©Ã¯Â¸Å½ Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>

        {/* Stat Cards */}
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5 mb-6">
          {[
            { label: "Total Cadets", value: stats.totalCadets },
            { label: "Active Events", value: stats.activeEvents }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white p-5 rounded-xl shadow text-center">
              <p className="text-sm text-gray-500">{stat.label}</p>
              <h3 className="text-2xl font-bold mt-2">{stat.value ?? "Ã¢â‚¬â€"}</h3>
            </div>
          ))}
        </div>



        {/* Comment Box */}
        <div className="bg-white p-5 rounded-xl shadow mb-6">
          <h3 className="text-lg font-semibold mb-3">Comments</h3>
          <textarea
            placeholder="Write your comment..."
            className="w-full h-20 p-3 border border-gray-300 rounded-lg resize-none text-sm"
          />
          <button className="mt-3 px-4 py-2 bg-orange-400 text-white rounded-md text-sm">Submit</button>
        </div>

        {/* Two Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Cadets */}
          <div className="bg-white p-5 rounded-xl shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Recent Cadets</h3>
              <Link to="/cadet-management" className="bg-green-600 text-white px-3 py-1 rounded text-sm">
                View All
              </Link>
            </div>
            {recentCadets.map((cadet, idx) => (
              <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg mb-2">
                <span>Cadet {cadet.name || cadet.regno}</span>
                <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">Active</span>
              </div>
            ))}
          </div>

          {/* Upcoming Events */}
          <div className="bg-white p-5 rounded-xl shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Upcoming Events</h3>
              <Link to="/update-event" className="bg-green-600 text-white px-3 py-1 rounded text-sm">
                Manage All
              </Link>
            </div>
            {upcomingEvents.map((event, idx) => (
              <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg mb-2">
                <span>{event.title}</span>
                <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">{event.status}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

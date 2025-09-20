import React from "react";
import { Link } from "react-router-dom";
import thumb1 from "../image/thumb1.jpg";
import thumb2 from "../image/thumb2.jpg";
import thumb3 from "../image/thumb3.jpg";

export default function CadetDashboard() {
  return (
    <div className="flex h-screen overflow-hidden font-sans text-gray-900 bg-white">
      {/* Sidebar */}
      <aside className="w-[270px] h-full border-r border-gray-200 bg-white flex flex-col px-4 py-6">
  {/* Header */}
  <div className="flex items-center gap-3 mb-6">
    <div className="w-9 h-9 rounded-full bg-green-900 text-white grid place-items-center font-bold text-sm">NCC</div>
    <h1 className="text-lg font-semibold">Cadet Portal</h1>
  </div>

  {/* Profile Card */}
  <div className="mb-6">
    <div className="border border-gray-200 rounded-xl flex items-center gap-3 bg-white p-3">
      <div className="w-11 h-11 rounded-full bg-green-100 text-green-700 grid place-items-center font-bold">CRK</div>
      <div>
        <div className="font-semibold">Cadet Raj Kumar</div>
        <div className="text-xs text-gray-500">Senior Under Officer</div>
      </div>
    </div>
  </div>

  {/* Navigation */}
  <nav className="flex flex-col gap-2 text-sm font-medium">
    <Link to="#" className="flex items-center gap-2 px-3 py-2 rounded-md text-green-700 bg-green-50 hover:bg-green-100 transition">
      🏠 Dashboard
    </Link>
    <Link to="#" className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition">
      ✔️ Attendance
    </Link>
    <Link to="/drill-videos" className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition">
      🎥 Drill Videos
    </Link>
    <Link to="#" className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition">
      💡 QueryBox
    </Link>
    <Link to="#" className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition">
      📅 Events
    </Link>
    <Link to="#" className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition">
      👤 Profile
    </Link>
  </nav>

  {/* Logout */}
  <div className="mt-auto pt-6 border-t border-gray-200">
    <Link to="/" className="flex items-center gap-2 text-red-600 px-3 py-2 rounded-md hover:bg-red-50 transition">
      ↩︎ Logout
    </Link>
  </div>
</aside>



      {/* Main */}
      <main className="flex items-center px-5 py-3 mx-2 rounded-lg text-sm font-medium ">
        

        <div className="p-6 min-w-[860px]">
          {/* Stat Cards */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl bg-white">
              <div className="w-11 h-11 rounded-full bg-green-50 text-green-700 grid place-items-center font-bold border border-green-100">✓</div>
              <div>
                <h3 className="text-sm text-gray-500 font-semibold mb-1">Attendance</h3>
                <div className="text-xl font-bold">92%</div>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 border border-orange-100 rounded-xl bg-orange-50">
              <div className="w-11 h-11 rounded-full bg-orange-50 text-orange-600 grid place-items-center font-bold border border-orange-100">🗓</div>
              <div>
                <h3 className="text-sm text-gray-500 font-semibold mb-1">Next Event</h3>
                <div className="text-xl font-bold">Drill Competition</div>
                <div className="text-sm text-gray-500 mt-1">March 15, 2024</div>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl bg-white">
              <div className="w-11 h-11 rounded-full bg-green-50 text-green-700 grid place-items-center font-bold border border-green-100">📹</div>
              <div>
                <h3 className="text-sm text-gray-500 font-semibold mb-1">Training Videos</h3>
                <div className="text-xl font-bold">3</div>
              </div>
            </div>
          </section>

          {/* Panels */}
          <section className="grid grid-cols-1 lg:grid-cols-[2fr_1.25fr] gap-6">
            {/* Upcoming Events */}
            <div className="p-5 border border-gray-200 rounded-xl bg-white">
              <h3 className="text-lg font-semibold mb-3">Upcoming Events</h3>

              <div className="event">
                <div className="w-2.5 h-2.5 rounded-full bg-green-600 mt-1.5"></div>
                <div>
                  <div className="font-semibold mb-1">Weapon Training</div>
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span>📅 March 18, 2024</span>
                    <span>🕒 07:00 AM</span>
                    <span>📍 Training Field</span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-100">Training</span>
                  </div>
                </div>
              </div>

              <div className="event">
                <div className="w-2.5 h-2.5 rounded-full bg-green-600 mt-1.5"></div>
                <div>
                  <div className="font-semibold mb-1">Republic Day Preparation</div>
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span>📅 March 20, 2024</span>
                    <span>🕕 06:00 AM</span>
                    <span>📍 Main Ground</span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-100">Preparation</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Training Videos */}
            <div className="p-5 border border-gray-200 rounded-xl bg-white">
              <h3 className="text-lg font-semibold mb-3">Recent Training Videos</h3>

              {[{ src: thumb1, title: "Basic Drill Movements", time: "15:30", level: "Beginner" },
                { src: thumb2, title: "Advanced Formation Drill", time: "22:15", level: "Advanced" },
                { src: thumb3, title: "Ceremonial Drill", time: "18:45", level: "Intermediate" }
              ].map((video, idx) => (
                <div key={idx} className="flex gap-3 items-center p-3 border border-gray-200 rounded-xl mb-3 bg-white">
                  <img src={video.src} alt={video.title} className="w-18 h-12 object-cover rounded-md border border-gray-200" />
                  <div>
                    <div className="font-semibold">{video.title}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                      {video.time}
                      <span className="text-xs px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">{video.level}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

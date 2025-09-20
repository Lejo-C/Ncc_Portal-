import { Link } from "react-router-dom";

export default function AdminDashboard() {
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
            <h4 className="text-base font-semibold">Major Sharma</h4>
            <p className="text-sm text-gray-500">Commanding Officer</p>
          </div>
          <nav className="mt-5">
  <Link to="/admin" className="flex items-center px-5 py-3 mx-2 rounded-lg text-sm font-medium bg-orange-400 text-white">
    Dashboard
  </Link>
  <Link to="/cadet-management" className="flex items-center px-5 py-3 mx-2 rounded-lg text-sm font-medium text-gray-800 hover:bg-orange-100">
    Manage Cadets
  </Link>
  <Link to="/admin/manage-events" className="flex items-center px-5 py-3 mx-2 rounded-lg text-sm font-medium text-gray-800 hover:bg-orange-100">
    Manage Events
  </Link>
  <Link to="/upload-drill" className="flex items-center px-5 py-3 mx-2 rounded-lg text-sm font-medium text-gray-800 hover:bg-orange-100">
    Drill Videos
  </Link>
  <Link to="/admin/attendance" className="flex items-center px-5 py-3 mx-2 rounded-lg text-sm font-medium text-gray-800 hover:bg-orange-100">
    Attendance
  </Link>
  <Link to="/admin/reports" className="flex items-center px-5 py-3 mx-2 rounded-lg text-sm font-medium text-gray-800 hover:bg-orange-100">
    Reports
  </Link>
</nav>

        </div>
        <div className="p-4 border-t border-gray-300">
          <Link to="/" className="text-red-600 font-bold hover:underline">
            ↩︎ Logout
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>
        
        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-6">
          {[
            { label: "Total Cadets", value: "245" },
            { label: "Active Events", value: "12" },
            { label: "Avg Attendance", value: "89%" },
            { label: "On Leave", value: "1" },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white p-5 rounded-xl shadow text-center">
              <p className="text-sm text-gray-500">{stat.label}</p>
              <h3 className="text-2xl font-bold mt-2">{stat.value}</h3>
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
              <button className="bg-green-600 text-white px-3 py-1 rounded text-sm">View All</button>
            </div>
            {["Raj Kumar", "Priya Singh", "Arjun Patel"].map((name, idx) => (
              <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg mb-2">
                <span>Cadet {name}</span>
                <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">Active</span>
              </div>
            ))}
          </div>

          {/* Upcoming Events */}
          <div className="bg-white p-5 rounded-xl shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Upcoming Events</h3>
              <button className="bg-green-600 text-white px-3 py-1 rounded text-sm">Manage All</button>
            </div>
            {[
              { title: "Annual Drill Competition", status: "Upcoming" },
              { title: "Weapon Training Session", status: "Upcoming" },
              { title: "Republic Day Parade Prep", status: "Planning" },
            ].map((event, idx) => (
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

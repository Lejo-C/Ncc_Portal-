import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function CadetAttendancePage() {
  const [attendance, setAttendance] = useState(null);
  const { user: cadet } = useAuth();

  useEffect(() => {
    if (!cadet) return;

    fetch(`${API_URL}/api/attendance/cadet/${cadet._id}`)
      .then(res => res.json())
      .then(data => setAttendance(data))
      .catch(err => console.error("Failed to fetch attendance:", err));
  }, [cadet]);

  if (!attendance) return <p className="p-6">Loading attendance...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">ðŸ“Š My Attendance</h1>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow text-center">
          <p className="text-sm text-gray-500">Total Days</p>
          <h3 className="text-xl font-bold">{attendance.totalDays}</h3>
        </div>
        <div className="bg-white p-4 rounded-xl shadow text-center">
          <p className="text-sm text-gray-500">Present</p>
          <h3 className="text-xl font-bold text-green-600">{attendance.presentDays}</h3>
        </div>
        <div className="bg-white p-4 rounded-xl shadow text-center">
          <p className="text-sm text-gray-500">Absent</p>
          <h3 className="text-xl font-bold text-red-600">{attendance.absentDays}</h3>
        </div>
        <div className="bg-white p-4 rounded-xl shadow text-center">
          <p className="text-sm text-gray-500">Percentage</p>
          <h3 className="text-xl font-bold">{attendance.percentage}%</h3>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-3">Attendance History</h3>
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-blue-100 text-left font-semibold">
            <tr>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {attendance.history.map((entry, idx) => (
              <tr key={idx} className="border-t">
                <td className="px-4 py-2">{new Date(entry.date).toLocaleDateString()}</td>
                <td className="px-4 py-2 capitalize">{entry.type}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${entry.present ? "bg-green-600 text-white" : "bg-red-600 text-white"
                    }`}>
                    {entry.present ? "Present" : "Absent"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

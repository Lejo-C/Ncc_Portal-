import React, { useEffect, useState } from "react";

const API_URL = import.meta.env.MODE === 'production'
  ? '' // Use relative paths in production
  : import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function AdminAttendancePage() {
  const [cadets, setCadets] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState("");
  const [type, setType] = useState("event");
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/users/cadets`)
      .then(res => res.json())
      .then(data => {
        setCadets(data);
        const initial = {};
        data.forEach(cadet => {
          initial[cadet._id] = true;
        });
        setAttendance(initial);
      });
  }, []);

  const total = cadets.length;
  const present = Object.values(attendance).filter(Boolean).length;
  const absent = total - present;
  const average = total ? Math.round((present / total) * 100) : 0;

  const handleToggle = (id) => {
    setAttendance(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      date,
      type,
      records: Object.entries(attendance).map(([cadetId, present]) => ({ cadetId, present }))
    };

    await fetch(`${API_URL}/api/attendance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    alert("âœ… Attendance submitted!");
  };

  const markAll = (value) => {
    const updated = {};
    cadets.forEach(c => updated[c._id] = value);
    setAttendance(updated);
  };

  const fetchHistory = async () => {
    const res = await fetch(`${API_URL}/api/attendance`);
    const data = await res.json();
    setAttendanceHistory(data);
    setShowHistoryModal(true);
    setSelectedRecord(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">Attendance Management</h1>

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Cadets", value: total },
          { label: "Present Today", value: present, color: "text-green-600" },
          { label: "Absent", value: absent, color: "text-red-600" },
          { label: "Average", value: `${average}%` }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-4 rounded-xl shadow text-center">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <h3 className={`text-xl font-bold ${stat.color || ""}`}>{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* View History Button */}
      <button
        onClick={fetchHistory}
        className="mb-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
      >
        View Previous Attendance
      </button>

      {/* Mark Attendance Form */}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="event">Event</option>
              <option value="parade">Parade</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 mb-4">
          <button type="button" onClick={() => markAll(true)} className="px-4 py-2 bg-green-600 text-white rounded-md text-sm">
            Mark All Present
          </button>
          <button type="button" onClick={() => markAll(false)} className="px-4 py-2 bg-gray-200 text-black rounded-md text-sm">
            Mark All Absent
          </button>
          <span className="text-sm text-gray-500 mt-2">Last updated: Today at 09:30 AM</span>
        </div>

        {/* Cadet Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow border border-gray-200">
            <thead className="bg-blue-100 text-left text-sm font-semibold text-gray-700">
              <tr>
                <th className="px-4 py-3">Cadet Name</th>
                <th className="px-4 py-3">Unit</th>
                <th className="px-4 py-3">Today's Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {cadets.map((cadet, idx) => (
                <tr key={idx} className="border-t border-gray-200 hover:bg-blue-50">
                  <td className="px-4 py-3 flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold text-white ${attendance[cadet._id] ? "bg-green-600" : "bg-red-600"
                      }`}>
                      {cadet.name?.split(" ").map(w => w[0]).join("").toUpperCase()}
                    </span>
                    {cadet.name}
                  </td>
                  <td className="px-4 py-3">{cadet.unit || ""}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${attendance[cadet._id] ? "bg-green-600 text-white" : "bg-red-600 text-white"
                      }`}>
                      {attendance[cadet._id] ? "Present" : "Absent"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => handleToggle(cadet._id)}
                      className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
                    >
                      {attendance[cadet._id] ? "Mark Absent" : "Mark Present"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button type="submit" className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Submit Attendance
        </button>
      </form>

      {/* Attendance History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-3xl relative max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-purple-700">Previous Attendance Records</h2>
            <button
              onClick={() => setShowHistoryModal(false)}
              className="absolute top-3 right-4 text-gray-500 hover:text-black text-lg"
            >
              âœ•
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {attendanceHistory.map((record, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedRecord(record)}
                  className="bg-gray-100 hover:bg-purple-100 p-3 rounded-lg text-left border"
                >
                  <h3 className="font-semibold text-gray-800">
                    {new Date(record.date).toLocaleDateString()}  {record.type.toUpperCase()}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {record.records.filter(r => r.present).length} Present
                  </p>
                </button>
              ))}
            </div>

            {selectedRecord && (
              <div className="border-t pt-4">
                <h3 className="text-md font-semibold text-gray-800 mb-2">
                  Attendance on {new Date(selectedRecord.date).toLocaleDateString()} ({selectedRecord.type})
                </h3>

                {/* Present Cadets */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-green-700 mb-1">âœ… Present Cadets:</h4>
                  <ul className="list-disc pl-5 text-sm text-gray-800 max-h-40 overflow-y-auto">
                    {selectedRecord.records
                      .filter(r => r.present)
                      .map((r, i) => (
                        <li key={i}>{r.cadetName || r.cadetId}</li>
                      ))}
                  </ul>
                </div>

                {/* Absent Cadets */}
                <div>
                  <h4 className="text-sm font-semibold text-red-700 mb-1">âŒ Absent Cadets:</h4>
                  <ul className="list-disc pl-5 text-sm text-gray-800 max-h-40 overflow-y-auto">
                    {selectedRecord.records
                      .filter(r => !r.present)
                      .map((r, i) => (
                        <li key={i}>{r.cadetName || r.cadetId}</li>
                      ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


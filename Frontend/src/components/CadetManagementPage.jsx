import React, { useEffect, useState } from "react";

export default function CadetManagementPage() {
  const [cadets, setCadets] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/users/cadets")
      .then(res => res.json())
      .then(data => setCadets(data));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <h1 className="text-2xl font-bold text-orange-700 mb-4">🧑‍✈️ Registered Cadets</h1>
      <p className="text-sm text-gray-600 mb-6">List of all cadets who have registered in the portal</p>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow border border-gray-200">
          <thead className="bg-orange-100 text-left text-sm font-semibold text-gray-700">
            <tr>
              <th className="px-4 py-3">Reg No</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Rank</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Registered On</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {cadets.map((cadet, idx) => (
              <tr key={idx} className="border-t border-gray-200 hover:bg-orange-50">
                <td className="px-4 py-3">{cadet.regno || "—"}</td>
                <td className="px-4 py-3">{cadet.name || "—"}</td>
                <td className="px-4 py-3">{cadet.rank || "—"}</td>
                <td className="px-4 py-3">{cadet.email || "—"}</td>
                <td className="px-4 py-3">{cadet.phone || "—"}</td>
                <td className="px-4 py-3">
                  {cadet.createdAt ? new Date(cadet.createdAt).toLocaleDateString() : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

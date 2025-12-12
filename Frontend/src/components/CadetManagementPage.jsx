import React, { useEffect, useState } from "react";

const API_URL = import.meta.env.MODE === 'production'
  ? '' // Use relative paths in production
  : import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function CadetManagementPage() {
  const [cadets, setCadets] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCadet, setNewCadet] = useState({ regno: "", name: "", password: "" });
  const [showRankModal, setShowRankModal] = useState(false);
  const [rankForm, setRankForm] = useState({ id: "", rank: "" });
  const [selectedCadet, setSelectedCadet] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);


  useEffect(() => {
    fetch(`${API_URL}/api/users/cadets`)
      .then(res => res.json())
      .then(data => setCadets(data));
  }, []);

  const handleDeleteCadet = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this cadet?");
    if (!confirm) return;

    await fetch(`${API_URL}/api/users/delete/${id}`, {
      method: "DELETE"
    });

    const updated = await fetch(`${API_URL}/api/users/cadets`).then(res => res.json());
    setCadets(updated);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();

    const existing = cadets.find(c => c.regno === newCadet.regno);
    if (existing) {
      setErrorMessage("Reg No already exists. Please use a unique Reg No.");
      return;
    }

    await fetch(`${API_URL}/api/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        regno: newCadet.regno,
        name: newCadet.name,
        password: newCadet.password,
        role: "cadet"
      })
    });

    const updated = await fetch(`${API_URL}/api/users/cadets`).then(res => res.json());
    setCadets(updated);
    setNewCadet({ regno: "", name: "", password: "" });
    setShowCreateModal(false);
    setErrorMessage("");
  };

  const handleRankSubmit = async (e) => {
    e.preventDefault();
    await fetch(`${API_URL}/api/users/update-rank/${rankForm.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rank: rankForm.rank })
    });
    const updated = await fetch(`${API_URL}/api/users/cadets`).then(res => res.json());
    setCadets(updated);
    setShowRankModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-orange-700">Registered Cadets</h1>
          <p className="text-sm text-gray-600">List of all cadets who have registered in the portal</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
        >
          + Create Cadet Account
        </button>
      </div>

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
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {cadets.map((cadet, idx) => (
              <tr key={idx} className="border-t border-gray-200 hover:bg-orange-50">
                <td className="px-4 py-3">{cadet.regno || ""}</td>
                <td className="px-4 py-3">{cadet.name || ""}</td>
                <td className="px-4 py-3">{cadet.rank || ""}</td>
                <td className="px-4 py-3">{cadet.email || ""}</td>
                <td className="px-4 py-3">{cadet.phone || ""}</td>
                <td className="px-4 py-3">
                  {cadet.createdAt ? new Date(cadet.createdAt).toLocaleDateString() : ""}
                </td>
                <td className="px-4 py-3 flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setSelectedCadet(cadet);
                      setShowProfileModal(true);
                    }}
                    className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => {
                      setRankForm({ id: cadet._id, rank: cadet.rank || "" });
                      setShowRankModal(true);
                    }}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Update Rank
                  </button>
                  <button
                    onClick={() => handleDeleteCadet(cadet._id)}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md relative">
            <h2 className="text-xl font-bold mb-4 text-orange-700">Create Cadet Account</h2>
            {errorMessage && (
              <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
                {errorMessage}
              </div>
            )}
            <form onSubmit={handleCreateSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Reg No</label>
                <input
                  type="text"
                  value={newCadet.regno}
                  onChange={(e) => setNewCadet({ ...newCadet, regno: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={newCadet.name}
                  onChange={(e) => setNewCadet({ ...newCadet, name: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={newCadet.password}
                  onChange={(e) => setNewCadet({ ...newCadet, password: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rank Update Modal */}
      {showRankModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md relative">
            <h2 className="text-xl font-bold mb-4 text-blue-700">Update Cadet Rank</h2>
            <form onSubmit={handleRankSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">New Rank</label>
                <input
                  type="text"
                  value={rankForm.rank}
                  onChange={(e) => setRankForm({ ...rankForm, rank: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowRankModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>


      )}
      {showProfileModal && selectedCadet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-2xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-bold mb-4 text-green-700">Cadet Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm text-gray-700">
              <div><strong>Reg No:</strong> {selectedCadet.regno}</div>
              <div><strong>Name:</strong> {selectedCadet.name}</div>
              <div><strong>Rank:</strong> {selectedCadet.rank}</div>
              <div><strong>Email:</strong> {selectedCadet.email}</div>
              <div><strong>Phone:</strong> {selectedCadet.phone}</div>
              <div><strong>Bank Account:</strong> {selectedCadet.bankAccount}</div>
              <div><strong>IFSC Code:</strong> {selectedCadet.ifsc}</div>
              <div><strong>DOB:</strong> {selectedCadet.dob ? new Date(selectedCadet.dob).toLocaleDateString() : ""}</div>
              <div><strong>Father's Name:</strong> {selectedCadet.fatherName}</div>
              <div><strong>Mother's Name:</strong> {selectedCadet.motherName}</div>
              <div className="sm:col-span-2"><strong>Address:</strong> {selectedCadet.address}</div>
            </div>
            <div className="mt-6 text-right">
              <button
                onClick={() => setShowProfileModal(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

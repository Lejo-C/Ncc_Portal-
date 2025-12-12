import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { updateProfile } from "../utils/api";

const API_URL = import.meta.env.MODE === 'production'
  ? '' // Use relative paths in production
  : import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function CadetDashboard() {
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactForm, setContactForm] = useState({
    phone: "",
    email: "",
    bankAccount: "",
    ifsc: "",
    dob: "",
    fatherName: "",
    motherName: "",
    address: ""
  });
  const [attendance, setAttendance] = useState(null);
  const [events, setEvents] = useState([]);
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();
  const { user: cadet, loading, logout, refreshUser } = useAuth();

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !cadet) {
      navigate("/cdt-login");
    }
  }, [loading, cadet, navigate]);

  useEffect(() => {
    if (!cadet) return;

    // Check if profile is incomplete
    if (
      !cadet?.phone ||
      !cadet?.email ||
      !cadet?.bankAccount ||
      !cadet?.dob ||
      !cadet?.fatherName ||
      !cadet?.motherName ||
      !cadet?.address
    ) {
      setContactForm({
        phone: cadet?.phone || "",
        email: cadet?.email || "",
        bankAccount: cadet?.bankAccount || "",
        ifsc: cadet?.ifsc || "",
        dob: cadet?.dob || "",
        fatherName: cadet?.fatherName || "",
        motherName: cadet?.motherName || "",
        address: cadet?.address || ""
      });
      setShowContactModal(true);
    }

    fetch(`${API_URL}/api/attendance/cadet/${cadet._id}`)
      .then(res => res.json())
      .then(data => setAttendance(data))
      .catch(err => console.error("Failed to fetch attendance:", err));

    fetch(`${API_URL}/api/events/upcoming`)
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(err => console.error("Failed to fetch events:", err));

    fetch(`${API_URL}/api/videos`)
      .then(res => res.json())
      .then(data => setVideos(data))
      .catch(err => console.error("Failed to fetch videos:", err));
  }, [cadet]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(contactForm);
      await refreshUser(); // Refresh user data from backend
      setShowContactModal(false);
    } catch (err) {
      console.error("Profile update failed:", err);
      alert("Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!cadet) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="flex h-screen font-sans text-gray-900 bg-gray-50">
      {/* Sidebar */}
      <aside className="w-[270px] h-full border-r border-gray-200 bg-white flex flex-col px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-full bg-green-900 text-white grid place-items-center font-bold text-sm">NCC</div>
          <h1 className="text-lg font-semibold">Cadet Portal</h1>
        </div>

        <div className="mb-6 cursor-pointer" onClick={() => navigate("/profile")}>
          <div className="border border-gray-200 rounded-xl flex items-center gap-3 bg-white p-3">
            <div className="w-11 h-11 rounded-full bg-green-100 text-green-700 grid place-items-center font-bold">
              {cadet?.name?.slice(0, 3).toUpperCase() || "NCC"}
            </div>
            <div>
              <div className="font-semibold">{cadet?.name || "Cadet"}</div>
              <div className="text-xs text-gray-500">{cadet?.rank || ""}</div>
            </div>
          </div>
        </div>

        <nav className="flex flex-col gap-2 text-sm font-medium">
          <Link to="#" className="flex items-center gap-2 px-3 py-2 rounded-md text-green-700 bg-green-50 hover:bg-green-100 transition">
            Dashboard
          </Link>
          <Link to="/cdt-attendance" className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition">
            Attendance
          </Link>
          <Link to="/drill-videos" className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition">
            Drill Videos
          </Link>
          <Link to="/query-box" className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition">
           QueryBox
          </Link>
          <Link to="/events" className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition">
            Events
          </Link>
          <Link to="/profile" className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition">
            Profile
          </Link>
        </nav>

        <div className="mt-auto pt-6 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 px-3 py-2 rounded-md hover:bg-red-50 transition w-full"
          >
            â†©ï¸Ž Logout
          </button>
        </div>
      </aside>

      {/* Main Dashboard Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <h2 className="text-2xl font-bold text-blue-700 mb-6">Welcome, {cadet?.name || "Cadet"}</h2>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow text-center">
            <p className="text-sm text-gray-500">Attendance</p>
            <h3 className="text-2xl font-bold text-green-600">
              {attendance?.percentage ?? ""}%
            </h3>
          </div>
          <div className="bg-white p-4 rounded-xl shadow text-center">
            <p className="text-sm text-gray-500">Upcoming Events</p>
            <h3 className="text-2xl font-bold">{events.length}</h3>
          </div>
          <div className="bg-white p-4 rounded-xl shadow text-center">
            <p className="text-sm text-gray-500">Drill Videos</p>
            <h3 className="text-2xl font-bold">{videos.length}</h3>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white p-5 rounded-xl shadow mb-6">
          <h3 className="text-lg font-semibold mb-3">Upcoming Events</h3>
          {events.map((event, idx) => (
            <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg mb-2">
              <div>
                <p className="font-semibold">{event.title}</p>
                <p className="text-sm text-gray-500">
                  {new Date(event.date).toLocaleDateString()} at {event.time} {event.location}
                </p>
              </div>
              <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
                {event.type || "Event"}
              </span>
            </div>
          ))}
        </div>

        {/* Training Videos */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-3">Recent Training Videos</h3>
          {videos.map((video, idx) => (
            <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg mb-2">
              <div>
                <p className="font-semibold">{video.title}</p>
                <p className="text-sm text-gray-500">{video.level} â€¢ {video.duration}</p>
              </div>
              <button className="bg-orange-500 text-white px-3 py-1 rounded text-sm hover:bg-orange-600">
                Watch
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-bold mb-4 text-green-700">Complete Your Profile</h2>
            <form
              onSubmit={handleProfileUpdate}
              className="grid gap-4"
            >
              <input
                type="text"
                placeholder="Phone"
                value={contactForm.phone}
                onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="email"
                placeholder="Email"
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                placeholder="Bank Account Number"
                value={contactForm.bankAccount}
                onChange={(e) => setContactForm({ ...contactForm, bankAccount: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                placeholder="IFSC Code"
                value={contactForm.ifsc}
                onChange={(e) => setContactForm({ ...contactForm, ifsc: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="date"
                placeholder="Date of Birth"
                value={contactForm.dob}
                onChange={(e) => setContactForm({ ...contactForm, dob: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                placeholder="Father's Name"
                value={contactForm.fatherName}
                onChange={(e) => setContactForm({ ...contactForm, fatherName: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                placeholder="Mother's Name"
                value={contactForm.motherName}
                onChange={(e) => setContactForm({ ...contactForm, motherName: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <textarea
                placeholder="Address"
                value={contactForm.address}
                onChange={(e) => setContactForm({ ...contactForm, address: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

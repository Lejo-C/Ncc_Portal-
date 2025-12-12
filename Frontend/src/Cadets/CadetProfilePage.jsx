import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { updateProfile } from "../utils/api";

const API_URL = import.meta.env.MODE === 'production'
  ? '' // Use relative paths in production
  : import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function CadetProfilePage() {
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    phone: ""
  });
  const { user: cadet, refreshUser } = useAuth();

  useEffect(() => {
    if (cadet) {
      setFormData({
        email: cadet.email || "",
        phone: cadet.phone || ""
      });
    }
  }, [cadet]);

  const handleSendEmailVerification = async () => {
    try {
      await fetch(`${API_URL}/api/users/send-email-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cadet.email })
      });
      alert("Verification email sent. Check your inbox.");
    } catch (err) {
      alert("Failed to send verification email.");
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      await refreshUser();
      setShowEditModal(false);
      alert("Profile updated successfully!");
    } catch (err) {
      alert("Failed to update profile: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-700">Cadet Profile</h1>
        <button
          onClick={() => setShowEditModal(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Edit Profile
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow border border-gray-200 max-w-3xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm text-gray-700">
          <div><span className="font-semibold">Reg No:</span> {cadet?.regno || ""}</div>
          <div><span className="font-semibold">Name:</span> {cadet?.name || ""}</div>
          <div><span className="font-semibold">Rank:</span> {cadet?.rank || ""}</div>
          <div><span className="font-semibold">Email:</span> {cadet?.email || "Not provided"}</div>
          <div><span className="font-semibold">Phone:</span> {cadet?.phone || "Not provided"}</div>
          <div><span className="font-semibold">Joined:</span> {cadet?.createdAt ? new Date(cadet.createdAt).toLocaleDateString() : ""}</div>
          <div><span className="font-semibold">Bank Account No:</span> {cadet?.bankAccount || ""}</div>
          <div><span className="font-semibold">IFSC Code:</span> {cadet?.ifsc || ""}</div>
          <div><span className="font-semibold">Date of Birth:</span> {cadet?.dob ? new Date(cadet.dob).toLocaleDateString() : ""}</div>
          <div><span className="font-semibold">Father's Name:</span> {cadet?.fatherName || ""}</div>
          <div><span className="font-semibold">Mother's Name:</span> {cadet?.motherName || ""}</div>
          <div className="sm:col-span-2"><span className="font-semibold">Address:</span> {cadet?.address || ""}</div>
        </div>
      </div>

      {!cadet?.isEmailVerified && cadet?.email && (
        <>
          <div className="mt-6 text-sm text-red-600 text-center">
            Your email is not verified. Please verify to unlock full access.
          </div>
          <div className="flex justify-center mt-2">
            <button
              onClick={() => setShowVerifyModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Verify Email
            </button>
          </div>
        </>
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-green-700">Edit Profile</h2>
            <form onSubmit={handleUpdateProfile}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="your.email@example.com"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="+91 XXXXXXXXXX"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Verify Email Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-blue-700">Verify Your Email</h2>
            <p className="text-sm mb-4">Click below to verify your email: <span className="font-medium">{cadet.email}</span></p>
            <button
              onClick={handleSendEmailVerification}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 w-full"
            >
              Send Verification Email
            </button>
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowVerifyModal(false)}
                className="text-sm text-gray-500 hover:underline"
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

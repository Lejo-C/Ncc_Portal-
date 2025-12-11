import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function CadetProfilePage() {
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const { user: cadet, refreshUser } = useAuth();

  const refreshCadet = async () => {
    await refreshUser();
  };

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

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <h1 className="text-2xl font-bold text-green-700 mb-6">ðŸ‘¤ Cadet Profile</h1>

      <div className="bg-white p-6 rounded-xl shadow border border-gray-200 max-w-3xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm text-gray-700">
          <div><span className="font-semibold">Reg No:</span> {cadet?.regno || "â€”"}</div>
          <div><span className="font-semibold">Name:</span> {cadet?.name || "â€”"}</div>
          <div><span className="font-semibold">Rank:</span> {cadet?.rank || "â€”"}</div>
          <div><span className="font-semibold">Email:</span> {cadet?.email || "â€”"}</div>
          <div><span className="font-semibold">Phone:</span> {cadet?.phone || "â€”"}</div>
          <div><span className="font-semibold">Joined:</span> {cadet?.createdAt ? new Date(cadet.createdAt).toLocaleDateString() : "â€”"}</div>
          <div><span className="font-semibold">Bank Account No:</span> {cadet?.bankAccount || "â€”"}</div>
          <div><span className="font-semibold">IFSC Code:</span> {cadet?.ifsc || "â€”"}</div>
          <div><span className="font-semibold">Date of Birth:</span> {cadet?.dob ? new Date(cadet.dob).toLocaleDateString() : "â€”"}</div>
          <div><span className="font-semibold">Father's Name:</span> {cadet?.fatherName || "â€”"}</div>
          <div><span className="font-semibold">Mother's Name:</span> {cadet?.motherName || "â€”"}</div>
          <div className="sm:col-span-2"><span className="font-semibold">Address:</span> {cadet?.address || "â€”"}</div>
        </div>
      </div>

      {!cadet?.isEmailVerified && (
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

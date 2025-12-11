import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function EmailVerificationPage() {
  const { token } = useParams();
  const [status, setStatus] = useState("Verifying...");

  useEffect(() => {
    fetch(`http://localhost:5000/api/users/verify-email/${token}`)
      .then(res => res.text())
      .then(msg => setStatus(msg))
      .catch(() => setStatus("❌ Verification failed. Try again or contact support."));
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans">
      <div className="bg-white p-6 rounded-xl shadow text-center">
        <h1 className="text-xl font-bold text-green-700 mb-4">Email Verification</h1>
        <p>{status}</p>
      </div>
    </div>
  );
}

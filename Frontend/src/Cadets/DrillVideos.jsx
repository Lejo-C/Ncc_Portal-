import React, { useEffect, useState } from "react";

export default function DrillVideosPage() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/drill-videos")
      .then(res => res.json())
      .then(data => setVideos(data));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-green-800">🎥 Drill Training Videos</h1>
        <p className="text-sm text-gray-600">Uploaded by seniors and ANOs for cadet reference</p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow hover:shadow-md transition p-4 border border-gray-200">
            <video controls src={video.videoUrl} className="w-full h-40 object-cover rounded-md mb-3" />
            <h3 className="text-lg font-semibold text-gray-800">{video.title}</h3>
            <div className="text-sm text-gray-500">👁️ {video.views} views</div>
            <button className="mt-3 px-4 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition">
              Watch Now
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}

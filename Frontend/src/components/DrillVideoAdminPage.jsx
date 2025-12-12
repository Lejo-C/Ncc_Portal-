import React, { useState, useEffect } from "react";

const API_URL = import.meta.env.MODE === 'production'
  ? '' // Use relative paths in production
  : import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function DrillVideoAdminPage() {
  const [videos, setVideos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: "", file: null });
  const [activeVideo, setActiveVideo] = useState(null);


  const totalViews = videos.reduce((sum, v) => sum + v.views, 0);

  useEffect(() => {
    fetch(`${API_URL}/api/drill-videos`)
      .then(res => res.json())
      .then(data => setVideos(data));
  }, []);

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/api/drill-videos/${id}`, {
      method: "DELETE",
    });

    const updated = await fetch(`${API_URL}/api/drill-videos`).then(res => res.json());
    setVideos(updated);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    // Upload video file to server
    const form = new FormData();
    form.append("file", formData.file);

    const uploadRes = await fetch(`${API_URL}/api/upload`, {
      method: "POST",
      body: form,
    });

    const { videoUrl } = await uploadRes.json();

    // Save metadata to MongoDB
    await fetch(`${API_URL}/api/drill-videos/upload`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: formData.title, videoUrl }),
    });

    const updated = await fetch(`${API_URL}/api/drill-videos`).then(res => res.json());
    setVideos(updated);

    setFormData({ title: "", file: null });
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-orange-700">Drill Video Management</h1>
          <p className="text-sm text-gray-600">Manage uploaded videos and add new training content</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition"
        >
          + Add Video
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow text-center">
          <p className="text-sm text-gray-500">Total Videos</p>
          <h3 className="text-xl font-bold">{videos.length}</h3>
        </div>
        <div className="bg-white p-4 rounded-xl shadow text-center">
          <p className="text-sm text-gray-500">Total Views</p>
          <h3 className="text-xl font-bold">{totalViews}</h3>
        </div>
      </div>

      {/* Video Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow p-4 border border-gray-200">
            <video controls src={video.videoUrl} className="w-full h-40 object-cover rounded-md mb-3" />
            <h3 className="text-lg font-semibold text-gray-800">{video.title}</h3>
            <div className="text-sm text-gray-500">{video.views} views</div>

            <button
              onClick={() => setActiveVideo(video.videoUrl)}
              className="mt-3 px-4 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Watch Now
            </button>


            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to delete this video?")) {
                  handleDelete(video._id);
                }
              }}
              className="mt-3 px-4 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Delete
            </button>
          </div>
        ))}
      </section>

      {activeVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-3xl relative">
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-2 right-2 text-red-600 font-bold text-xl"
            >
              Ã—
            </button>
            <video
              src={activeVideo}
              controls
              autoPlay
              className="w-full h-[400px] object-contain rounded"
            />
          </div>
        </div>
      )}


      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-orange-700">Upload New Drill Video</h2>
            <form onSubmit={handleUpload}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Video Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload File</label>
                <input
                  type="file"
                  name="file"
                  accept="video/*"
                  onChange={handleChange}
                  required
                  className="w-full"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

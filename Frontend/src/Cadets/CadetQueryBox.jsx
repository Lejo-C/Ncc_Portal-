import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function CadetQueryBox() {
  const [queries, setQueries] = useState([]);
  const [search, setSearch] = useState("");
  const [filterTag, setFilterTag] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");
  const { user: cadet } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [newQuery, setNewQuery] = useState({
    title: "",
    description: "",
    tags: ""
  });
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [activeQueryId, setActiveQueryId] = useState(null);



  useEffect(() => {
    fetch(`${API_URL}/api/query`)
      .then(res => res.json())
      .then(data => setQueries(data));
  }, []);

  const filteredQueries = queries
    .filter(q =>
      q.title.toLowerCase().includes(search.toLowerCase()) ||
      q.description.toLowerCase().includes(search.toLowerCase())
    )
    .filter(q => filterTag === "All" || q.tags.includes(filterTag))
    .sort((a, b) => {
      if (sortBy === "Newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "Most Viewed") return b.views - a.views;
      return b.answers.length - a.answers.length;
    });

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-700">ðŸ’¡ Doubts & Q&A</h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          + Ask a Question
        </button>

      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search doubts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
        />
        <select
          value={filterTag}
          onChange={(e) => setFilterTag(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md"
        >
          <option>All</option>
          <option>Drill & Ceremonies</option>
          <option>Examinations</option>
          <option>Eligibility</option>
          <option>Shoulder Arms</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md"
        >
          <option>Newest</option>
          <option>Most Viewed</option>
          <option>Most Answered</option>
        </select>
      </div>

      {/* Doubt Cards */}
      {filteredQueries.map((q, idx) => (
        <div key={idx} className="bg-white p-5 rounded-xl shadow mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-blue-700">{q.title}</h3>
            <span className={`px-2 py-1 rounded text-xs font-semibold ${q.status === "Solved" ? "bg-green-600 text-white" : "bg-yellow-500 text-white"
              }`}>
              {q.status}
            </span>
          </div>
          <p className="text-sm text-gray-700 mb-2">{q.description}</p>
          <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-2">
            {q.tags.map((tag, i) => (
              <span key={i} className="bg-gray-200 px-2 py-1 rounded">{tag}</span>
            ))}
          </div>
          <div className="text-xs text-gray-500 flex justify-between">
            <span>Posted by: {q.postedBy.name} ({q.postedBy.role})</span>
            <span>ðŸ‘ï¸ {q.views} views â€¢ ðŸ’¬ {q.answers.length} answers</span>
            <button
              onClick={() => {
                setActiveQueryId(q._id);
                setShowReplyModal(true);
              }}
              className="mt-2 px-4 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              ðŸ’¬ Reply
            </button>

          </div>
        </div>
      ))}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg relative">
            <h2 className="text-xl font-bold mb-4 text-green-700">Ask a New Question</h2>
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-4 text-gray-500 hover:text-black text-lg"
            >
              âœ•
            </button>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const payload = {
                  ...newQuery,
                  tags: newQuery.tags.split(",").map(tag => tag.trim()),
                  postedBy: {
                    name: cadet.name,
                    role: "Cadet",
                    cadetId: cadet._id
                  },
                  status: "Unsolved",
                  views: 0,
                  answers: []
                };

                const res = await fetch(`${API_URL}/api/query`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(payload)
                });

                const data = await res.json();
                setQueries(prev => [data.query, ...prev]);
                setNewQuery({ title: "", description: "", tags: "" });
                setShowModal(false);
              }}
              className="grid gap-4"
            >
              <input
                type="text"
                placeholder="Question Title"
                value={newQuery.title}
                onChange={(e) => setNewQuery({ ...newQuery, title: e.target.value })}
                required
                className="px-3 py-2 border border-gray-300 rounded-md"
              />
              <textarea
                placeholder="Describe your doubt..."
                value={newQuery.description}
                onChange={(e) => setNewQuery({ ...newQuery, description: e.target.value })}
                required
                className="px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                placeholder="Tags (comma separated)"
                value={newQuery.tags}
                onChange={(e) => setNewQuery({ ...newQuery, tags: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Post Question
              </button>
            </form>
          </div>
        </div>
      )}

      {showReplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg relative">
            <h2 className="text-xl font-bold mb-4 text-blue-700">Reply to Question</h2>
            <button
              onClick={() => setShowReplyModal(false)}
              className="absolute top-3 right-4 text-gray-500 hover:text-black text-lg"
            >
              âœ•
            </button>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const res = await fetch(`${API_URL}/api/query/answer/${activeQueryId}`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    responder: cadet.name,
                    text: replyText
                  })
                });
                const data = await res.json();
                setQueries(prev =>
                  prev.map(q => (q._id === data.query._id ? data.query : q))
                );
                setReplyText("");
                setShowReplyModal(false);
              }}
              className="grid gap-4"
            >
              <textarea
                placeholder="Type your reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                required
                className="px-3 py-2 border border-gray-300 rounded-md"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Submit Reply
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

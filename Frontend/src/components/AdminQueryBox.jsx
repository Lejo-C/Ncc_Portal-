import React, { useEffect, useState } from "react";

const API_URL = import.meta.env.MODE === 'production'
  ? '' // Use relative paths in production
  : import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function AdminQueryBox() {
  const [queries, setQueries] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [activeQueryId, setActiveQueryId] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/query`)
      .then(res => res.json())
      .then(data => setQueries(data));
  }, []);



  const handleReply = async (id) => {
    const res = await fetch(`${API_URL}/api/query/answer/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        responder: "Admin",
        text: replyText
      })
    });
    const data = await res.json();
    setQueries(prev =>
      prev.map(q => (q._id === data.query._id ? data.query : q))
    );
    setReplyText("");
    setActiveQueryId(null);
  };

  const markAsSolved = async (id) => {
    const res = await fetch(`${API_URL}/api/query/solve/${id}`, {
      method: "PUT"
    });
    const data = await res.json();
    setQueries(prev =>
      prev.map(q => (q._id === data.query._id ? data.query : q))
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">Admin QueryBox</h1>

      {queries.map((q, idx) => (
        <div key={idx} className="bg-white p-5 rounded-xl shadow mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-green-700">{q.title}</h3>
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
          <p className="text-xs text-gray-500 mb-2">Posted by: {q.postedBy.name} ({q.postedBy.role})</p>
          <p className="text-xs text-gray-500 mb-2">{q.views} views â€¢ {q.answers.length} answers</p>

          {/* Existing Answers */}
          {q.answers.map((ans, i) => (
            <div key={i} className="bg-gray-100 p-2 rounded mb-2 text-sm">
              <strong>{ans.responder}:</strong> {ans.text}
            </div>
          ))}

          {/* Reply Box */}
          {activeQueryId === q._id ? (
            <div className="mt-3">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your reply..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleReply(q._id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Submit Reply
                </button>
                <button
                  onClick={() => markAsSolved(q._id)}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Mark as Solved
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setActiveQueryId(q._id)}
              className="mt-2 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
            >
              Reply
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

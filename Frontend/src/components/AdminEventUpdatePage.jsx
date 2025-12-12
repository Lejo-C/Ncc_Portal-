import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.MODE === 'production'
  ? '' // Use relative paths in production
  : import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function AdminEventUpdatePage() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    participants: "",
    status: "Planning"
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editEvent, setEditEvent] = useState(null);



  useEffect(() => {
    fetch(`${API_URL}/api/events`)
      .then(res => res.json())
      .then(data => setEvents(Array.isArray(data) ? data : []))
      .catch(err => console.error("âŒ Failed to fetch events:", err));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    await fetch(`${API_URL}/api/events/${id}`, {
      method: "DELETE"
    });
    setEvents(prev => prev.filter(event => event._id !== id));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    // Ensure all required fields are present and valid
    if (
      !newEvent.title.trim() ||
      !newEvent.date ||
      !newEvent.time ||
      !newEvent.location.trim() ||
      isNaN(Number(newEvent.participants)) ||
      Number(newEvent.participants) < 0
    ) {
      alert("âŒ Please fill all required fields correctly.");
      return;
    }

    const payload = {
      ...newEvent,
      participants: Number(newEvent.participants)
    };

    try {
      const res = await fetch(`${API_URL}/api/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert("âŒ Failed to create event: " + (errorData.message || "Check required fields."));
        return;
      }

      const created = await res.json();
      if (created?.event) {
        setEvents(prev => [...prev, created.event]);
        setShowModal(false);
        setNewEvent({
          title: "",
          date: "",
          time: "",
          location: "",
          participants: "",
          status: "Planning"
        });
      }
    } catch (err) {
      alert("âŒ Error creating event.");
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-800">Manage Events</h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          + Create Event
        </button>
      </div>

      <div className="grid gap-4">
        {Array.isArray(events) &&
          events
            .filter(
              (e) =>
                e &&
                typeof e === "object" &&
                typeof e.title === "string" &&
                typeof e.date === "string" &&
                typeof e.location === "string" &&
                typeof e.status === "string"
            )
            .map((event, idx) => (
              <div key={event._id || idx} className="bg-white p-5 rounded-xl shadow border border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-semibold text-gray-800">{event.title}</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditEvent(event);        // sets the selected event
                        setShowEditModal(true);     // opens the modal
                      }}
                      className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                    >
                      Edit
                    </button>


                    <button
                      onClick={() => handleDelete(event._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-700">
                  <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                  <p><strong>Time:</strong> {event.time || ""}</p>
                  <p><strong>Location:</strong> {event.location || ""}</p>
                  <p><strong>Participants:</strong> {event.participants || ""}</p>
                  <p><strong>Status:</strong>
                    <span className={`ml-1 px-2 py-1 rounded text-xs font-semibold ${event.status === "Upcoming" ? "bg-green-600 text-white" :
                        event.status === "Planning" ? "bg-yellow-500 text-white" :
                          "bg-gray-400 text-white"
                      }`}>
                      {event.status}
                    </span>
                  </p>
                </div>
              </div>
            ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg relative">
            <h2 className="text-xl font-bold mb-4 text-blue-700">Create New Event</h2>
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-4 text-gray-500 hover:text-black text-lg"
            >
              âœ•
            </button>

            <form onSubmit={handleCreate} className="grid gap-4">
              <input
                type="text"
                placeholder="Event Title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                required
                className="px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="date"
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                required
                className="px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="time"
                value={newEvent.time}
                onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                required
                className="px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                placeholder="Location"
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                required
                className="px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="Participants"
                value={newEvent.participants}
                onChange={(e) => setNewEvent({ ...newEvent, participants: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md"
              />
              <select
                value={newEvent.status}
                onChange={(e) => setNewEvent({ ...newEvent, status: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="Planning">Planning</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Completed">Completed</option>
              </select>

              <button
                type="submit"
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Create Event
              </button>
            </form>
            {showEditModal && editEvent && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg relative">
                  <h2 className="text-xl font-bold mb-4 text-blue-700">Edit Event</h2>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="absolute top-3 right-4 text-gray-500 hover:text-black text-lg"
                  >
                    âœ•
                  </button>

                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const payload = {
                        ...editEvent,
                        participants: editEvent.participants ? Number(editEvent.participants) : 0
                      };

                      const res = await fetch(`${API_URL}/api/events/${editEvent._id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload)
                      });

                      const updated = await res.json();
                      if (updated?.event) {
                        setEvents(prev =>
                          prev.map(ev => (ev._id === updated.event._id ? updated.event : ev))
                        );
                        setShowEditModal(false);
                        setEditEvent(null);
                      } else {
                        alert("âŒ Failed to update event.");
                      }
                    }}
                    className="grid gap-4"
                  >
                    <input
                      type="text"
                      placeholder="Event Title"
                      value={editEvent.title}
                      onChange={(e) => setEditEvent({ ...editEvent, title: e.target.value })}
                      required
                      className="px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <input
                      type="date"
                      value={editEvent.date?.slice(0, 10)}
                      onChange={(e) => setEditEvent({ ...editEvent, date: e.target.value })}
                      required
                      className="px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <input
                      type="time"
                      value={editEvent.time}
                      onChange={(e) => setEditEvent({ ...editEvent, time: e.target.value })}
                      required
                      className="px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <input
                      type="text"
                      placeholder="Location"
                      value={editEvent.location}
                      onChange={(e) => setEditEvent({ ...editEvent, location: e.target.value })}
                      required
                      className="px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <input
                      type="number"
                      placeholder="Participants"
                      value={editEvent.participants}
                      onChange={(e) => setEditEvent({ ...editEvent, participants: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <select
                      value={editEvent.status}
                      onChange={(e) => setEditEvent({ ...editEvent, status: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="Planning">Planning</option>
                      <option value="Upcoming">Upcoming</option>
                      <option value="Completed">Completed</option>
                    </select>

                    <button
                      type="submit"
                      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Update Event
                    </button>
                  </form>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}

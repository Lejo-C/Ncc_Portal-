import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // ✅ Add useNavigate
import soldiers1 from "../image/soldiers1.jpg";
import soldiers2 from "../image/soldiers2.jpg";
import soldiers3 from "../image/soldiers3.jpg";

const slides = [{
    id: 0,
    image: soldiers1,
    title: "Excellence in Training",
    description: "Comprehensive NCC education and skill development for tomorrow's leaders",
  },
  {
    id: 1,
    image: soldiers2,
    title: "Leadership & Discipline",
    description: "Shaping strong leaders through discipline and commitment to the nation",
  },
  {
    id: 2,
    image: soldiers3,
    title: "Teamwork in Action",
    description: "Building trust, unity, and collaboration among Indian NCC cadets",
  },
];

const MainPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(false); // ✅ Add loading state
  const navigate = useNavigate(); // ✅ Add navigate hook

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Add loading handler
  const handleAccessClick = (path) => {
    setLoading(true);
    setTimeout(() => {
      navigate(path);
    }, 1000);
  };

  return (
    <div className="flex h-screen font-sans relative">
      {/* ✅ Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center z-50 text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-white border-opacity-50 mb-4" />
          <p className="text-lg font-semibold">Loading...</p>
        </div>
      )}

      {/* Left Section (Slider) */}
      <div className="flex-1 relative overflow-hidden text-white">
        {/* same slider code */}
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute top-0 w-full h-full flex flex-col justify-center items-center text-center px-5 transition-all duration-700 ${
              index === currentSlide ? "left-0" : index < currentSlide ? "-left-full" : "left-full"
            }`}
            style={{
              backgroundImage: `url(${slide.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="relative z-10">
              <h1 className="text-3xl mb-2">{slide.title}</h1>
              <p className="max-w-md text-base">{slide.description}</p>
            </div>
          </div>
        ))}

        {/* Dots */}
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full bg-white transition-opacity ${
                index === currentSlide ? "opacity-100" : "opacity-50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex-1 flex flex-col justify-center items-center bg-white p-10">
        <h2 className="text-2xl font-semibold mb-2">Welcome to PRIDE</h2>
        <p className="text-gray-600 mb-8">Choose your access level to continue</p>

        {/* ✅ Replace Link with button for Cadet Access */}
        <button
          onClick={() => handleAccessClick("/cdt-login")}
          className="w-full max-w-md mb-5 block text-left"
        >
          <div className="border-l-4 border-green-500 bg-white p-5 rounded-xl shadow hover:shadow-md transition">
            <h3 className="text-lg font-semibold mb-1">Cadet Access</h3>
            <p className="text-sm text-gray-700 mb-1">Access attendance, training videos, and events</p>
            <p className="text-xs">📌 Personal Dashboard | 🎥 Events & Training</p>
          </div>
        </button>

        {/* ✅ Replace Link with button for Admin Access */}
        <button
          onClick={() => handleAccessClick("/admin")}
          className="w-full max-w-md mb-5 block text-left"
        >
          <div className="border-l-4 border-orange-500 bg-white p-5 rounded-xl shadow hover:shadow-md transition">
            <h3 className="text-lg font-semibold mb-1">Administrator Access</h3>
            <p className="text-sm text-gray-700 mb-1">Manage cadets, events, and attendance records</p>
            <p className="text-xs">📝 Cadet Management | 📅 Event Planning</p>
          </div>
        </button>

        <div className="text-sm text-gray-600 mt-4">
          Having trouble accessing your account?{" "}
          <a href="#" className="text-green-600 font-bold hover:underline">
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default MainPage;

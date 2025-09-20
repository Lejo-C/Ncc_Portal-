import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import soldiers1 from "../image/soldiers1.jpg";
import soldiers2 from "../image/soldiers2.jpg";
import soldiers3 from "../image/soldiers3.jpg";

const slides = [
  {
    image: soldiers1,
    title: "Excellence in Training",
    description: "Comprehensive military education and skill development for tomorrow's leaders",
  },
  {
    image: soldiers2,
    title: "Leadership & Discipline",
    description: "Shaping strong leaders through discipline and commitment",
  },
  {
    image: soldiers3,
    title: "Teamwork in Action",
    description: "Building trust, unity, and collaboration among cadets",
  },
];

export default function CadetLogin() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [regno, setRegno] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ regno, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      if (data.role === "cadet") {
        navigate("/cdt-dashboard");
      } else if (data.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        setError("Unknown role");
      }
    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <div className="flex h-screen font-sans">
      {/* Left Section (Slider) */}
      <div className="flex-1 relative overflow-hidden text-white">
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

      {/* Right Section (Login Form) */}
      <div className="flex-1 flex justify-center items-center bg-white p-10">
        <div className="w-full max-w-md bg-white border border-gray-300 rounded-xl p-8 shadow">
          <h2 className="text-center text-2xl font-semibold mb-2">Cadet Login</h2>
          <p className="text-center text-gray-600 mb-5">Sign in to access your NCC cadet portal</p>

          <Link to="/" className="text-sm text-gray-700 hover:underline block mb-4">← Back to user selection</Link>

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm text-gray-700 mb-1">Reg no.</label>
              <input
                  type="text"
                  placeholder="TN20XXSDIAXXXXXXX"
                  value={regno}
                  onChange={(e) => setRegno(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-700 mb-1">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>

            <div className="flex justify-between items-center text-sm mb-5">
              <label className="flex items-center gap-2">
                <input type="checkbox" />
                Remember me
              </label>
              <a href="#" className="text-green-600 hover:underline">Forgot password?</a>
            </div>

            {error && <div className="text-red-600 text-sm mb-3">{error}</div>}

            <button type="submit" className="w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition">
              Sign in
            </button>
          </form>

          <div className="text-center text-sm text-gray-600 mt-4">
            Don’t have an account?{" "}
            <a href="#" className="text-green-600 font-bold hover:underline">Contact your administrator</a>
          </div>

          <div className="text-center text-xs text-gray-500 mt-5">
            By signing in, you agree to NCC’s{" "}
            <a href="#" className="text-green-600 hover:underline">Terms of Service</a> and{" "}
            <a href="#" className="text-green-600 hover:underline">Privacy Policy</a>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setToken } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import soldiers1 from "../image/soldiers1.jpg";
import soldiers2 from "../image/soldiers2.jpg";
import soldiers3 from "../image/soldiers3.jpg";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

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

export default function AdminLogin() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Admin login uses email
      const res = await fetch(`${API_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      setToken(data.token);
      await refreshUser();

      if (data.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        setError("Access denied: not an admin");
      }
    } catch (err) {
      setError("Server error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen font-sans">
      {/* Left Section (Slider) */}
      <div className="flex-1 relative overflow-hidden text-white">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute top-0 w-full h-full flex flex-col justify-center items-center text-center px-5 transition-all duration-700 ${index === currentSlide ? "left-0" : index < currentSlide ? "-left-full" : "left-full"
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
              className={`w-2.5 h-2.5 rounded-full bg-white transition-opacity ${index === currentSlide ? "opacity-100" : "opacity-50"
                }`}
            />
          ))}
        </div>
      </div>

      {/* Right Section (Login Form) */}
      <div className="flex-1 flex justify-center items-center bg-white p-10">
        <div className="w-full max-w-md bg-white border border-gray-300 rounded-xl p-8 shadow">
          <h2 className="text-center text-2xl font-semibold mb-2">Administrator Login</h2>
          <p className="text-center text-gray-600 mb-5">Sign in to access your NCC admin portal</p>

          <a href="/" className="text-sm text-gray-700 hover:underline block mb-4">â† Back to user selection</a>

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm text-gray-700 mb-1">Email address</label>
              <input
                type="email"
                placeholder="admin@ncc.gov.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
            Donâ€™t have an account?{" "}
            <a href="#" className="text-green-600 font-bold hover:underline">Contact your administrator</a>
          </div>

          <div className="text-center text-xs text-gray-500 mt-5">
            By signing in, you agree to NCCâ€™s{" "}
            <a href="#" className="text-green-600 hover:underline">Terms of Service</a> and{" "}
            <a href="#" className="text-green-600 hover:underline">Privacy Policy</a>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function CadetLayout() {
    const { user: cadet, loading, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    // Handle authentication redirect in useEffect to avoid infinite loop
    useEffect(() => {
        if (!loading && !cadet) {
            navigate("/cdt-login");
        }
    }, [cadet, loading, navigate]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    if (!cadet) {
        return null; // Will redirect via useEffect
    }

    const isActive = (path) => location.pathname === path;

    const NavLink = ({ to, icon, label }) => (
        <Link
            to={to}
            onClick={closeMobileMenu}
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition ${isActive(to)
                    ? "text-green-700 bg-green-50"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
        >
            <span className="text-lg">{icon}</span> {label}
        </Link>
    );

    return (
        <div className="flex h-screen font-sans text-gray-900 bg-gray-50 overflow-hidden">
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-green-600 text-white rounded-md shadow-lg"
                aria-label="Toggle menu"
            >
                {isMobileMenuOpen ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                )}
            </button>

            {/* Overlay for mobile */}
            {isMobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
                    onClick={closeMobileMenu}
                />
            )}

            {/* Sidebar - Responsive */}
            <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-[270px] h-full border-r border-gray-200 bg-white 
        flex flex-col px-4 py-6
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-9 h-9 rounded-full bg-green-900 text-white grid place-items-center font-bold text-sm">NCC</div>
                    <h1 className="text-lg font-semibold">Cadet Portal</h1>
                </div>

                {/* User Profile */}
                <div className="mb-6 cursor-pointer" onClick={() => { navigate("/cadet/profile"); closeMobileMenu(); }}>
                    <div className="border border-gray-200 rounded-xl flex items-center gap-3 bg-white p-3 hover:bg-gray-50 transition">
                        <div className="w-11 h-11 rounded-full bg-green-100 text-green-700 grid place-items-center font-bold text-sm">
                            {cadet?.name?.slice(0, 3).toUpperCase() || "NCC"}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="font-semibold truncate">{cadet?.name || "Cadet"}</div>
                            <div className="text-xs text-gray-500 truncate">{cadet?.rank || "—"}</div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex flex-col gap-2 text-sm font-medium flex-1 overflow-y-auto">
                    <NavLink to="/cadet/dashboard" icon="🏠" label="Dashboard" />
                    <NavLink to="/cadet/attendance" icon="✔️" label="Attendance" />
                    <NavLink to="/cadet/drill-videos" icon="🎥" label="Drill Videos" />
                    <NavLink to="/cadet/query-box" icon="💡" label="QueryBox" />
                    <NavLink to="/cadet/events" icon="📅" label="Events" />
                    <NavLink to="/cadet/profile" icon="👤" label="Profile" />
                </nav>

                {/* Logout */}
                <div className="mt-auto pt-6 border-t border-gray-200">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-red-600 px-3 py-2 rounded-md hover:bg-red-50 transition w-full"
                    >
                        <span className="text-lg">↩︎</span> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Area - Responsive */}
            <main className="flex-1 overflow-y-auto w-full lg:w-auto">
                <div className="pt-16 lg:pt-0">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

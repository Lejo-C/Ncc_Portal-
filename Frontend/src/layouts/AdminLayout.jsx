import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminLayout() {
    const { user: admin, loading, logout } = useAuth();
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
        if (!loading && (!admin || admin.role !== "admin")) {
            navigate("/admin-login");
        }
    }, [admin, loading, navigate]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    if (!admin || admin.role !== "admin") {
        return null; // Will redirect via useEffect
    }

    const isActive = (path) => location.pathname === path;

    const NavLink = ({ to, icon, label }) => (
        <Link
            to={to}
            onClick={closeMobileMenu}
            className={`flex items-center px-5 py-3 mx-2 rounded-lg text-sm font-medium ${isActive(to)
                ? "bg-orange-400 text-white"
                : "text-gray-800 hover:bg-orange-100"
                }`}
        >
            <span className="mr-2">{icon}</span>
            {label}
        </Link>
    );

    return (
        <div className="flex font-sans bg-gray-100 min-h-screen overflow-hidden">
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-orange-400 text-white rounded-md shadow-lg"
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
        w-[240px] bg-white border-r border-gray-300 
        flex flex-col justify-between min-h-screen
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
                <div className="overflow-y-auto">
                    <div className="flex items-center p-5 font-bold text-lg">
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/NCC_India_Logo.svg/1024px-NCC_India_Logo.svg.png"
                            alt="logo"
                            className="w-9 mr-3"
                        />
                        <span className="hidden sm:block">Admin Portal</span>
                        <span className="sm:hidden">Admin</span>
                    </div>
                    <div className="bg-green-50 mx-5 p-4 rounded-lg text-left">
                        <h4 className="text-base font-semibold truncate">{admin?.name || "Admin"}</h4>
                        <p className="text-sm text-gray-500 truncate">{admin?.rank || "Commanding Officer"}</p>
                    </div>
                    <nav className="mt-5">
                        <NavLink to="/admin/dashboard" icon="" label="Dashboard" />
                        <NavLink to="/admin/cadet-management" icon="" label="Manage Cadets" />
                        <NavLink to="/admin/events" icon="" label="Manage Events" />
                        <NavLink to="/admin/drill-videos" icon="" label="Drill Videos" />
                        <NavLink to="/admin/attendance" icon="" label="Attendance" />
                        <NavLink to="/admin/query-box" icon="" label="Query Box" />
                    </nav>
                </div>
                <div className="p-4 border-t border-gray-300">
                    <button
                        onClick={handleLogout}
                        className="text-red-600 font-bold hover:underline w-full text-left"
                    >
                        ↩︎ Logout
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

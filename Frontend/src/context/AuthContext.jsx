import React, { createContext, useState, useContext, useEffect } from "react";
import { getCurrentUser, logoutUser, getToken } from "../utils/api";

const AuthContext = createContext();

/**
 * Custom hook to use auth context
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
};

/**
 * AuthProvider component
 * Manages user authentication state globally
 * Replaces localStorage user data with API-fetched data
 */
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /**
     * Load current user from API on mount
     */
    useEffect(() => {
        loadUser();
    }, []);

    /**
     * Fetch current user from backend
     */
    const loadUser = async () => {
        try {
            const token = getToken();
            if (!token) {
                setLoading(false);
                return;
            }

            const userData = await getCurrentUser();
            setUser(userData);
            setError(null);
        } catch (err) {
            console.error("Failed to load user:", err);
            setError(err.message);
            // If token is invalid, clear it
            if (err.message.includes("token") || err.message.includes("Session")) {
                localStorage.removeItem("token");
            }
        } finally {
            setLoading(false);
        }
    };

    /**
     * Logout user
     */
    const logout = async () => {
        try {
            await logoutUser();
        } catch (err) {
            console.error("Logout error:", err);
        } finally {
            setUser(null);
            localStorage.removeItem("token");
        }
    };

    /**
     * Refresh user data (e.g., after profile update)
     */
    const refreshUser = async () => {
        setLoading(true);
        await loadUser();
    };

    const value = {
        user,
        loading,
        error,
        isAuthenticated: !!user,
        logout,
        refreshUser,
        setUser // For login to set user immediately
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;

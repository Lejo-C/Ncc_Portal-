// Use relative URL in production (same domain) or localhost in development
const API_BASE_URL = import.meta.env.PROD
    ? "/api"
    : "http://localhost:5000/api";


/**
 * Get authentication token from localStorage
 */
export const getToken = () => {
    return localStorage.getItem("token");
};

/**
 * Set authentication token in localStorage
 */
export const setToken = (token) => {
    localStorage.setItem("token", token);
};

/**
 * Remove authentication token from localStorage
 */
export const removeToken = () => {
    localStorage.removeItem("token");
};

/**
 * Get authorization headers
 */
const getAuthHeaders = () => {
    const token = getToken();
    return {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` })
    };
};

/**
 * Generic API request handler
 */
const apiRequest = async (endpoint, options = {}) => {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                ...getAuthHeaders(),
                ...options.headers
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "API request failed");
        }

        return data;
    } catch (error) {
        console.error(`API Error (${endpoint}):`, error);
        throw error;
    }
};

// ==================== AUTH API ====================

/**
 * Login user
 */
export const loginUser = async (regno, password) => {
    const data = await apiRequest("/users/login", {
        method: "POST",
        body: JSON.stringify({ regno, password })
    });

    if (data.token) {
        setToken(data.token);
    }

    return data;
};

/**
 * Logout user
 */
export const logoutUser = async () => {
    try {
        await apiRequest("/users/logout", {
            method: "POST"
        });
    } finally {
        removeToken();
    }
};

/**
 * Get current authenticated user (replaces localStorage.getItem("cadet"))
 */
export const getCurrentUser = async () => {
    return await apiRequest("/users/me");
};

/**
 * Update user profile
 */
export const updateProfile = async (profileData) => {
    return await apiRequest("/users/update-profile", {
        method: "PUT",
        body: JSON.stringify(profileData)
    });
};

/**
 * Register new user
 */
export const registerUser = async (userData) => {
    return await apiRequest("/users/register", {
        method: "POST",
        body: JSON.stringify(userData)
    });
};

// ==================== ATTENDANCE API ====================

/**
 * Get attendance records
 */
export const getAttendance = async () => {
    return await apiRequest("/attendance");
};

// ==================== EVENTS API ====================

/**
 * Get all events
 */
export const getEvents = async () => {
    return await apiRequest("/events");
};

/**
 * Register for event
 */
export const registerForEvent = async (eventId) => {
    return await apiRequest(`/events/${eventId}/register`, {
        method: "POST"
    });
};

// ==================== QUERIES API ====================

/**
 * Submit a query
 */
export const submitQuery = async (queryData) => {
    return await apiRequest("/query", {
        method: "POST",
        body: JSON.stringify(queryData)
    });
};

/**
 * Get user's queries
 */
export const getMyQueries = async () => {
    return await apiRequest("/query/my-queries");
};

export default {
    loginUser,
    logoutUser,
    getCurrentUser,
    updateProfile,
    registerUser,
    getAttendance,
    getEvents,
    registerForEvent,
    submitQuery,
    getMyQueries,
    getToken,
    setToken,
    removeToken
};

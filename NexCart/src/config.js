// API Configuration
// In production, we prefer the VITE_API_BASE_URL environment variable.
// If it's not set, we assume standard MERN deployment where /api is on the same origin.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export default API_BASE_URL;


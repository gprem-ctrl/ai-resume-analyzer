// API Configuration
const API_CONFIG = {
    // Auto-detect API URL based on environment
    getApiUrl() {
        // If we're on localhost, use localhost
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return 'http://localhost:3001';
        }
        // Otherwise, use the same origin (for production)
        return window.location.origin;
    }
};

// Export for use in script.js
window.API_CONFIG = API_CONFIG;

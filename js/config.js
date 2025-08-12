/**
 * Application Configuration
 * Centralized configuration for the gift application
 */

const CONFIG = {
    // API Configuration
    API: {
        // Development server (for testing)
        DEV_URL: 'http://localhost:3000/api',
        
        // Production server (replace with your actual production URL)
        PROD_URL: 'https://your-production-server.com/api',
        
        // Current environment - change this to 'production' when deploying
        ENVIRONMENT: 'development',
        
        // Request timeout in milliseconds
        TIMEOUT: 10000,
        
        // Get the current API URL based on environment
        getBaseURL() {
            return this.ENVIRONMENT === 'production' ? this.PROD_URL : this.DEV_URL;
        }
    },
    
    // Application settings
    APP: {
        NAME: 'ギフトループ',
        VERSION: '1.0.0',
        DEBUG: this.ENVIRONMENT === 'development'
    },
    
    // Local storage keys
    STORAGE_KEYS: {
        USER_DATA: 'userData',
        AUTH_TOKEN: 'authToken',
        IS_LOGGED_IN: 'isLoggedIn',
        REMEMBER_ME: 'rememberMe'
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} else {
    window.CONFIG = CONFIG;
}
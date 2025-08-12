/**
 * API Service for Gift Application
 * Handles all server communication
 */

class GiftApi {
    constructor() {
        // Use configuration for API settings
        this.baseURL = window.CONFIG ? window.CONFIG.API.getBaseURL() : 'http://localhost:3000/api';
        this.timeout = window.CONFIG ? window.CONFIG.API.TIMEOUT : 10000;
    }

    /**
     * Make HTTP request with error handling
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            timeout: this.timeout
        };

        const config = { ...defaultOptions, ...options };

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), config.timeout);

            const response = await fetch(url, {
                ...config,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('Request timeout. Please try again.');
            }
            
            if (error.message.includes('Failed to fetch')) {
                throw new Error('Network error. Please check your connection and try again.');
            }
            
            throw error;
        }
    }

    /**
     * Register a new user
     */
    async register(userData) {
        const { email, password, firstName, lastName, birthDate } = userData;
        
        // Validate required fields
        if (!email || !password || !firstName || !lastName || !birthDate) {
            throw new Error('すべての必須項目を入力してください。');
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error('有効なメールアドレスを入力してください。');
        }

        // Password validation
        if (password.length < 8) {
            throw new Error('パスワードは8文字以上で入力してください。');
        }

        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                email,
                password,
                firstName,
                lastName,
                birthDate
            })
        });
    }

    /**
     * Login user
     */
    async login(credentials) {
        const { email, password } = credentials;
        
        if (!email || !password) {
            throw new Error('メールアドレスとパスワードを入力してください。');
        }

        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
    }

    /**
     * Get user profile
     */
    async getUserProfile() {
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('認証が必要です。');
        }

        return this.request('/user/profile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }

    /**
     * Update user profile
     */
    async updateProfile(profileData) {
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('認証が必要です。');
        }

        return this.request('/user/profile', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(profileData)
        });
    }

    /**
     * Change password
     */
    async changePassword(passwordData) {
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('認証が必要です。');
        }

        return this.request('/user/change-password', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(passwordData)
        });
    }

    /**
     * Logout user
     */
    async logout() {
        const token = localStorage.getItem('authToken');
        if (!token) {
            return { success: true };
        }

        try {
            await this.request('/auth/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        } catch (error) {
            // Even if logout fails on server, we should clear local data
            console.warn('Logout request failed:', error);
        }

        // Clear local storage
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('rememberMe');

        return { success: true };
    }

    /**
     * Forgot password
     */
    async forgotPassword(email) {
        if (!email) {
            throw new Error('メールアドレスを入力してください。');
        }

        return this.request('/auth/forgot-password', {
            method: 'POST',
            body: JSON.stringify({ email })
        });
    }

    /**
     * Reset password
     */
    async resetPassword(token, newPassword) {
        if (!token || !newPassword) {
            throw new Error('必要な情報が不足しています。');
        }

        if (newPassword.length < 8) {
            throw new Error('パスワードは8文字以上で入力してください。');
        }

        return this.request('/auth/reset-password', {
            method: 'POST',
            body: JSON.stringify({ token, newPassword })
        });
    }
}

// Create global instance
const giftApi = new GiftApi();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GiftApi, giftApi };
} else {
    window.giftApi = giftApi;
}
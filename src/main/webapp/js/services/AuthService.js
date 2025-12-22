/**
 * Authentication Service
 * Handles login, register, logout, verification.
 */
class AuthService {
    constructor(apiService, storage) {
        this.api = apiService;
        this.storage = storage;
    }

    async login(email, password) {
        const response = await this.api.post('/login', { email, password });
        if (response.data && response.data.sessionId) {
            // Session is handled by cookie, but we might store user info
            // We need to fetch user profile after login if not returned
            await this.fetchCurrentUser();
        }
        return response;
    }

    async register(username, email, password) {
        return this.api.post('/register', { username, email, password });
    }

    async verify(email, code) {
        return this.api.post('/verify', { email, code });
    }

    async logout() {
        try {
            await this.api.post('/logout');
        } catch (e) {
            // Ignore error on logout
        } finally {
            this.storage.clearAuth();
            window.location.hash = '#/login';
        }
    }

    async fetchCurrentUser() {
        try {
            // Assuming /user/profile returns user info
            // Or we might need a specific endpoint
            // The prompt says "Users: /user/profile (GET/PUT)"
            const response = await this.api.get('/user/profile');
            if (response.data) {
                this.storage.setUser(response.data);
            }
            return response.data;
        } catch (e) {
            // If fetch fails, maybe not logged in
            this.storage.clearAuth();
            throw e;
        }
    }

    async requestPasswordReset(email) {
        return this.api.post('/forgot-password', { email });
    }

    async resetPassword(token, newPassword) {
        return this.api.post('/reset-password', { token, newPassword });
    }
}

/**
 * Base API Service
 * Handles all HTTP requests, headers, and error parsing.
 */
class ApiService {
    constructor(storage) {
        this.storage = storage;
        this.baseUrl = '/api';
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...options.headers
        };

        // Add CSRF token if available
        const csrfToken = this.storage.getCsrfToken();
        if (csrfToken) {
            headers['X-CSRF-TOKEN'] = csrfToken;
        }

        const config = {
            ...options,
            headers
        };

        try {
            const response = await fetch(url, config);
            
            // Handle 401 Unauthorized
            if (response.status === 401) {
                this.storage.clearAuth();
                // Redirect to login if not already there
                if (!window.location.hash.includes('#/login')) {
                    window.location.hash = '#/login';
                }
                throw new Error('Session expired. Please login again.');
            }

            // Parse JSON
            // Some endpoints might return empty body (e.g. 204)
            if (response.status === 204) {
                return null;
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || data.error || 'API Error');
            }

            return data;
        } catch (error) {
            // Don't log to console in production (per requirements), but we are in dev.
            // Requirement: "No console errors/warnings in production"
            // We'll rethrow for the caller to handle UI feedback
            throw error;
        }
    }

    get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }

    post(endpoint, body) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(body)
        });
    }

    put(endpoint, body) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body)
        });
    }

    delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }
}

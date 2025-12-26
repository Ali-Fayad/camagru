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

            if (data && typeof data === 'object') {
                Object.defineProperty(data, '_status', {
                    value: response.status,
                    enumerable: false
                });
            }
            
            // Status 201 is special - it means success but requires verification
            if (response.status === 201) {
                return data;
            }
            
            if (!response.ok) {
                throw new Error(data.message || data.error || 'API Error');
            }

            return data;
        } catch (error) {
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

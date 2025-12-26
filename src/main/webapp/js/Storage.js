/**
 * Storage Management
 * Single file requirement for managing all client-side storage.
 * Handles localStorage, sessionStorage, and memory fallback.
 */
class Storage {
    constructor() {
        this.memoryStorage = {};
        this.storageType = this.isLocalStorageAvailable() ? 'localStorage' : 'memory';
    }

    isLocalStorageAvailable() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }

    get(key) {
        if (this.storageType === 'localStorage') {
            const item = localStorage.getItem(key);
            try {
                return JSON.parse(item);
            } catch (e) {
                return item;
            }
        }
        return this.memoryStorage[key];
    }

    set(key, value) {
        const stringValue = typeof value === 'object' ? JSON.stringify(value) : value;
        if (this.storageType === 'localStorage') {
            localStorage.setItem(key, stringValue);
        } else {
            this.memoryStorage[key] = value;
        }
    }

    remove(key) {
        if (this.storageType === 'localStorage') {
            localStorage.removeItem(key);
        } else {
            delete this.memoryStorage[key];
        }
    }

    clear() {
        if (this.storageType === 'localStorage') {
            localStorage.clear();
        }
        this.memoryStorage = {};
    }

    // Auth specific helpers
    
    setUser(user) {
        this.set('user', user);
    }

    getUser() {
        return this.get('user');
    }

    isAuthenticated() {
        return !!this.getUser();
    }

    setCsrfToken(token) {
        this.set('csrf_token', token);
    }

    getCsrfToken() {
        return this.get('csrf_token');
    }

    clearCsrfToken() {
        this.remove('csrf_token');
    }

    clearAuth() {
        this.remove('user');
        this.remove('csrf_token');
    }
}

/**
 * Client-side Validation Utilities
 * Must match server-side validation rules.
 */
const Validators = {
    /**
     * Validate email format (RFC 5322 compliant)
     * Accepts temporary email domains and special characters
     */
    isValidEmail: (email) => {
        // RFC 5322 simplified pattern - accepts all valid email formats
        const re = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        return re.test(email) && email.length <= 254;
    },

    /**
     * Validate username: 3-20 chars, letters, numbers, underscores
     */
    isValidUsername: (username) => {
        const re = /^[a-zA-Z0-9_]{3,20}$/;
        return re.test(username);
    },

    /**
     * Validate password: Min 8 chars, 1 upper, 1 lower, 1 number
     */
    isValidPassword: (password) => {
        if (!password || password.length < 8) return false;
        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasDigit = /[0-9]/.test(password);
        return hasUpper && hasLower && hasDigit;
    },

    /**
     * Validate comment length: 1-500 chars
     */
    isValidComment: (content) => {
        return content && content.trim().length >= 1 && content.trim().length <= 500;
    },

    /**
     * Validate file type and size
     */
    isValidFile: (file) => {
        const validTypes = ['image/jpeg', 'image/png'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!validTypes.includes(file.type)) {
            return { valid: false, error: 'Only JPEG and PNG images are allowed.' };
        }

        if (file.size > maxSize) {
            return { valid: false, error: 'Image size must be less than 5MB.' };
        }

        return { valid: true };
    },
    
    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml: (unsafe) => {
        if (!unsafe) return '';
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
};

import { API_BASE_URL, API_ENDPOINTS } from "./constants.js";

const buildUrl = (endpoint) => {
    return `${API_BASE_URL}/${endpoint}`;
};

const request = async (endpoint, options = {}) => {
    const { method = "POST", body, headers = {} } = options;
    const config = {
        method,
        headers: {
            ...headers
        }
    };

    if (body instanceof FormData) {
        config.body = body;
    } else if (body !== undefined) {
        config.body = JSON.stringify(body);
        config.headers = {
            "Content-Type": "application/json",
            ...config.headers
        };
    }

    try {
        const response = await fetch(buildUrl(endpoint), config);
        const payload = await response.json().catch(() => ({}));
        return payload;
    } catch (error) {
        console.error("API request failed", endpoint, error);
        return {
            status: "error",
            message: "Network request failed"
        };
    }
};

export const Api = {
    login: (body) => request(API_ENDPOINTS.login, { body }),
    signup: (body) => request(API_ENDPOINTS.signup, { body }),
    updateUser: (body) => request(API_ENDPOINTS.updateUser, { body }),
    deleteUser: (body) => request(API_ENDPOINTS.deleteUser, { body }),
    verifyEmail: (body) => request(API_ENDPOINTS.verifyEmail, { body }),
    sendVerificationCode: (body) => request(API_ENDPOINTS.sendCode, { body }),
    getPosts: () => request(API_ENDPOINTS.getPosts, { method: "GET" }),
    addPost: (body) => request(API_ENDPOINTS.addPost, { body }),
    getStickers: () => request(API_ENDPOINTS.getStickers, { method: "GET" }),
    like: (body) => request(API_ENDPOINTS.like, { body }),
    comment: (body) => request(API_ENDPOINTS.comment, { body })
};

/**
 * Gallery Service
 * Handles gallery images, likes, and comments.
 */
class GalleryService {
    constructor(api) {
        this.api = api;
    }

    async getGalleryImages(cursor = null, limit = 12) {
        const params = new URLSearchParams();
        if (cursor) params.append('cursor', cursor);
        if (limit) params.append('limit', limit.toString());
        
        const queryString = params.toString();
        const endpoint = `/gallery${queryString ? '?' + queryString : ''}`;
        return this.api.get(endpoint);
    }

    async toggleLike(imageId) {
        return this.api.post(`/gallery/${imageId}/like`);
    }

    async getComments(imageId) {
        return this.api.get(`/gallery/${imageId}/comments`);
    }

    async postComment(imageId, content) {
        return this.api.post(`/gallery/${imageId}/comments`, { content });
    }
}
/**
 * Image Service
 * Handles image upload and management.
 */
class ImageService {
    constructor(api) {
        this.api = api;
    }

    async uploadImage(imageData, stickers, useWebcam = false, caption = null) {
        return this.api.post('/images/upload', {
            imageData,
            stickers,
            useWebcam,
            caption
        });
    }

    async deleteImage(imageId) {
        return this.api.delete(`/images/${imageId}`);
    }

    async getImage(imageId) {
        return this.api.get(`/images/${imageId}`);
    }
}
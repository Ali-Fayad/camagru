/**
 * Image Service
 * Handles image upload and management.
 */
class ImageService {
    constructor(api) {
        this.api = api;
    }

    async uploadImage(imageData, stickerIndex, useWebcam = false, caption = null) {
        return this.api.post('/images/upload', {
            imageData,
            stickerIndex,
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
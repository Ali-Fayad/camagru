/**
 * Image Service
 * Handles image upload and management.
 */
class ImageService {
    constructor(api) {
        this.api = api;
    }

    async uploadImage(imageData, stickerIndex, useWebcam = false) {
        return this.api.post('/images/upload', {
            imageData,
            stickerIndex,
            useWebcam
        });
    }

    async deleteImage(imageId) {
        return this.api.delete(`/images/${imageId}`);
    }

    async getImage(imageId) {
        return this.api.get(`/images/${imageId}`);
    }
}
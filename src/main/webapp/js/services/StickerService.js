/**
 * Sticker Service
 * Handles sticker loading and management.
 */
class StickerService {
    constructor(api) {
        this.api = api;
        this.stickers = null;
    }

    /**
     * Load stickers from API.
     */
    async getStickers() {
        if (!this.stickers) {
            const response = await this.api.get('/stickers');
            this.stickers = response.data || [];
        }
        return this.stickers;
    }

    getStickerById(id) {
        return this.stickers ? this.stickers.find(s => s.id === id) : null;
    }
}
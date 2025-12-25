/**
 * Stats Service
 * Handles user statistics API calls.
 */
class StatsService {
    constructor(api) {
        this.api = api;
    }

    /**
     * Get user statistics (image count, likes, comments).
     */
    async getUserStats() {
        return await this.api.get('/user/stats');
    }
}

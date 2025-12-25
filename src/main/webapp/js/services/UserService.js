/**
 * User Service
 * Handles user profile and settings.
 */
class UserService {
    constructor(api) {
        this.api = api;
    }

    async getProfile() {
        return this.api.get('/user/profile');
    }

    async updateProfile(data) {
        return this.api.put('/user/profile', data);
    }

    async changePassword(oldPassword, newPassword) {
        return this.api.put('/user/password', { oldPassword, newPassword });
    }

    async toggleNotifications(enabled) {
        return this.api.put('/user/notifications', { receiveNotifications: enabled });
    }
    
    async deleteAccount() {
        return this.api.delete('/user');
    }
}
package com.camagru.services;

import com.camagru.models.User;
import com.camagru.repositories.UserRepository;
import com.camagru.utils.PasswordUtil;
import com.camagru.utils.ValidationUtil;

import java.sql.SQLException;

/**
 * User service for user profile management.
 */
public class UserService {
    private final UserRepository userRepository;
    
    public UserService() {
        this.userRepository = new UserRepository();
    }
    
    /**
     * Get user by ID.
     */
    public User getUserById(Integer userId) throws SQLException {
        return userRepository.findById(userId);
    }
    
    /**
     * Update username.
     */
    public boolean updateUsername(Integer userId, String newUsername) throws SQLException {
        if (!ValidationUtil.isValidUsername(newUsername)) {
            throw new IllegalArgumentException("Invalid username format");
        }
        
        // Check if username already exists
        User existing = userRepository.findByUsername(newUsername);
        if (existing != null && !existing.getId().equals(userId)) {
            throw new IllegalArgumentException("Username already exists");
        }
        
        return userRepository.updateUsername(userId, newUsername);
    }
    
    /**
     * Update email.
     */
    public boolean updateEmail(Integer userId, String newEmail) throws SQLException {
        if (!ValidationUtil.isValidEmail(newEmail)) {
            throw new IllegalArgumentException("Invalid email format");
        }
        
        // Check if email already exists
        User existing = userRepository.findByEmail(newEmail);
        if (existing != null && !existing.getId().equals(userId)) {
            throw new IllegalArgumentException("Email already exists");
        }
        
        return userRepository.updateEmail(userId, newEmail);
    }
    
    /**
     * Change password.
     */
    public boolean changePassword(Integer userId, String oldPassword, String newPassword) throws SQLException {
        User user = userRepository.findById(userId);
        if (user == null) {
            throw new IllegalArgumentException("User not found");
        }
        
        // Verify old password
        if (!PasswordUtil.verifyPassword(oldPassword, user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid current password");
        }
        
        // Validate new password
        if (!ValidationUtil.isValidPassword(newPassword)) {
            throw new IllegalArgumentException("Password must be at least 8 characters with uppercase, lowercase, and number");
        }
        
        // Hash and update
        String newHash = PasswordUtil.hashPassword(newPassword);
        return userRepository.updatePassword(userId, newHash);
    }
    
    /**
     * Toggle comment notifications.
     */
    public boolean updateNotifications(Integer userId, boolean receiveNotifications) throws SQLException {
        return userRepository.updateNotifications(userId, receiveNotifications);
    }
    
    /**
     * Delete user account and all associated data.
     * Cascading deletes will handle images, comments, likes, and sessions.
     */
    public boolean deleteAccount(Integer userId) throws SQLException {
        return userRepository.deleteUser(userId);
    }
}

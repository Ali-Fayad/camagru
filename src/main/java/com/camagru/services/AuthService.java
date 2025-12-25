package com.camagru.services;

import com.camagru.config.AppConfig;
import com.camagru.models.Session;
import com.camagru.models.User;
import com.camagru.repositories.SessionRepository;
import com.camagru.repositories.UserRepository;
import com.camagru.utils.PasswordUtil;
import com.camagru.utils.ValidationUtil;

import java.security.MessageDigest;
import java.security.SecureRandom;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.Random;

/**
 * Authentication service.
 * Handles registration, login, verification, password reset.
 */
public class AuthService {
    private final UserRepository userRepository;
    private final SessionRepository sessionRepository;
    private final EmailService emailService;
    
    public AuthService() {
        this.userRepository = new UserRepository();
        this.sessionRepository = new SessionRepository();
        this.emailService = new EmailService();
    }
    
    /**
     * Register new user and send verification email.
     */
    public User register(String username, String email, String password) throws SQLException {
        // Validate inputs
        if (!ValidationUtil.isValidUsername(username)) {
            throw new IllegalArgumentException("Invalid username format");
        }
        if (!ValidationUtil.isValidEmail(email)) {
            throw new IllegalArgumentException("Invalid email format");
        }
        if (!ValidationUtil.isValidPassword(password)) {
            throw new IllegalArgumentException("Password must be at least 8 characters with uppercase, lowercase, and number");
        }
        
        // Check if email or username exists
        if (userRepository.findByEmail(email) != null) {
            throw new IllegalArgumentException("Email already exists");
        }
        if (userRepository.findByUsername(username) != null) {
            throw new IllegalArgumentException("Username already exists");
        }
        
        // Generate verification code
        String verificationCode = generateVerificationCode();
        Timestamp expiry = Timestamp.from(Instant.now().plusSeconds(AppConfig.VERIFICATION_EXPIRY_HOURS * 3600));
        
        // Hash password
        String passwordHash = PasswordUtil.hashPassword(password);
        
        // Create user
        User user = userRepository.create(username, email, passwordHash, verificationCode, expiry);
        
        // Send verification email
        emailService.sendVerificationEmail(email, username, verificationCode);
        
        return user;
    }
    
    /**
     * Verify user with 6-digit code and login.
     */
    public Session verifyAndLogin(String email, String code) throws SQLException {
        if (userRepository.verifyUser(email, code)) {
            User user = userRepository.findByEmail(email);
            String sessionId = generateSessionId(user.getId());
            return sessionRepository.create(sessionId, user.getId());
        }
        return null;
    }

    /**
     * Login user and create session.
     */
    public Session login(String email, String password) throws SQLException {
        User user = userRepository.findByEmail(email);
        
        if (user == null) {
            throw new IllegalArgumentException("Invalid credentials");
        }
        
        if (!user.isVerified()) {
            throw new IllegalArgumentException("Email not verified");
        }
        
        if (!PasswordUtil.verifyPassword(password, user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid credentials");
        }
        
        // Generate session ID
        String sessionId = generateSessionId(user.getId());
        
        // Create session in database
        Session session = sessionRepository.create(sessionId, user.getId());
        
        return session;
    }
    
    /**
     * Logout user (destroy session).
     */
    public boolean logout(String sessionId) throws SQLException {
        return sessionRepository.delete(sessionId);
    }
    
    /**
     * Request password reset.
     */
    public boolean requestPasswordReset(String email) throws SQLException {
        User user = userRepository.findByEmail(email);
        
        if (user == null) {
            // Don't reveal if email exists
            return true;
        }
        
        // Generate reset token
        String token = generateResetToken();
        Timestamp expiry = Timestamp.from(Instant.now().plusSeconds(AppConfig.RESET_TOKEN_EXPIRY_HOURS * 3600));
        
        // Save token
        userRepository.setResetToken(email, token, expiry);
        
        // Send reset email
        emailService.sendPasswordResetEmail(email, user.getUsername(), token);
        
        return true;
    }
    
    /**
     * Reset password with token.
     */
    public boolean resetPassword(String token, String newPassword) throws SQLException {
        if (!ValidationUtil.isValidPassword(newPassword)) {
            throw new IllegalArgumentException("Password must be at least 8 characters with uppercase, lowercase, and number");
        }
        
        String passwordHash = PasswordUtil.hashPassword(newPassword);
        
        return userRepository.resetPassword(token, passwordHash);
    }
    
    /**
     * Generate 6-digit verification code.
     * PHP equivalent: str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT)
     */
    private String generateVerificationCode() {
        Random random = new SecureRandom();
        int code = random.nextInt(1000000);
        return String.format("%06d", code);
    }
    
    /**
     * Generate secure session ID.
     * PHP equivalent: hash('sha256', uniqid() . $userId)
     */
    private String generateSessionId(Integer userId) {
        try {
            String data = userId + "_" + System.currentTimeMillis() + "_" + new SecureRandom().nextLong();
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(data.getBytes());
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            return String.valueOf(System.currentTimeMillis());
        }
    }
    
    /**
     * Generate secure reset token.
     * PHP equivalent: bin2hex(random_bytes(32))
     */
    private String generateResetToken() {
        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[32];
        random.nextBytes(bytes);
        StringBuilder hexString = new StringBuilder();
        for (byte b : bytes) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) hexString.append('0');
            hexString.append(hex);
        }
        return hexString.toString();
    }
}

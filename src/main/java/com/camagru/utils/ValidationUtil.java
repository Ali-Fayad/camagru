package com.camagru.utils;

import com.camagru.config.AppConfig;

import java.util.regex.Pattern;

/**
 * Input validation utility.
 * PHP equivalent: filter_var(), preg_match(), etc.
 */
public class ValidationUtil {
    
    private static final Pattern EMAIL_PATTERN = Pattern.compile(
        "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"
    );
    
    private static final Pattern USERNAME_PATTERN = Pattern.compile(
        "^[a-zA-Z0-9_]{" + AppConfig.USERNAME_MIN_LENGTH + "," + AppConfig.USERNAME_MAX_LENGTH + "}$"
    );
    
    /**
     * Validate email format.
     * PHP equivalent: filter_var($email, FILTER_VALIDATE_EMAIL)
     */
    public static boolean isValidEmail(String email) {
        if (email == null) {
            return false;
        }

        // Trim surrounding whitespace and remove invisible/control characters
        String normalized = email.trim().replaceAll("\\p{C}", "");
        if (normalized.isEmpty()) {
            return false;
        }

        return EMAIL_PATTERN.matcher(normalized).matches();
    }
    
    /**
     * Validate username: 3-20 chars, letters, numbers, underscores only.
     * PHP equivalent: preg_match('/^[a-zA-Z0-9_]{3,20}$/', $username)
     */
    public static boolean isValidUsername(String username) {
        if (username == null || username.isEmpty()) {
            return false;
        }
        return USERNAME_PATTERN.matcher(username).matches();
    }
    
    /**
     * Validate password: Min 8 chars, at least 1 uppercase, 1 lowercase, 1 number.
     * PHP equivalent: preg_match() with password rules
     */
    public static boolean isValidPassword(String password) {
        if (password == null || password.length() < AppConfig.PASSWORD_MIN_LENGTH) {
            return false;
        }
        
        boolean hasUpper = false;
        boolean hasLower = false;
        boolean hasDigit = false;
        
        for (char c : password.toCharArray()) {
            if (Character.isUpperCase(c)) hasUpper = true;
            if (Character.isLowerCase(c)) hasLower = true;
            if (Character.isDigit(c)) hasDigit = true;
        }
        
        return hasUpper && hasLower && hasDigit;
    }
    
    /**
     * Validate comment length: 1-500 chars.
     */
    public static boolean isValidComment(String content) {
        if (content == null) {
            return false;
        }
        int length = content.trim().length();
        return length >= AppConfig.COMMENT_MIN_LENGTH && length <= AppConfig.COMMENT_MAX_LENGTH;
    }
    
    /**
     * Validate sticker index: 0-14.
     */
    public static boolean isValidStickerIndex(Integer index) {
        return index != null && index >= 0 && index <= AppConfig.MAX_STICKER_INDEX;
    }
    
    /**
     * Sanitize HTML to prevent XSS.
     * PHP equivalent: htmlspecialchars()
     */
    public static String escapeHtml(String input) {
        if (input == null) {
            return null;
        }
        return input
            .replace("&", "&amp;")
            .replace("<", "&lt;")
            .replace(">", "&gt;")
            .replace("\"", "&quot;")
            .replace("'", "&#x27;")
            .replace("/", "&#x2F;");
    }
}

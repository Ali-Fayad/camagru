package com.camagru.config;

/**
 * Application-wide configuration constants.
 * PHP equivalent: define() or config array
 */
public class AppConfig {
    
    // Application URLs
    public static final String APP_URL = getEnv("APP_URL", "http://localhost:8080");
    
    // File upload configuration
    public static final String UPLOAD_DIR = getEnv("UPLOAD_DIR", "/uploads");
    public static final String STICKER_DIR = getEnv("STICKER_DIR", "/stickers");
    public static final long MAX_UPLOAD_SIZE = Long.parseLong(getEnv("MAX_UPLOAD_SIZE", "5242880")); // 5MB
    
    // Session configuration
    public static final int SESSION_TIMEOUT = Integer.parseInt(getEnv("SESSION_TIMEOUT", "1800")); // 30 minutes
    
    // Verification code configuration
    public static final int VERIFICATION_CODE_LENGTH = Integer.parseInt(getEnv("VERIFICATION_CODE_LENGTH", "6"));
    public static final int VERIFICATION_EXPIRY_HOURS = Integer.parseInt(getEnv("VERIFICATION_EXPIRY_HOURS", "24"));
    public static final int RESET_TOKEN_EXPIRY_HOURS = Integer.parseInt(getEnv("RESET_TOKEN_EXPIRY_HOURS", "1"));
    
    // Validation rules
    public static final int USERNAME_MIN_LENGTH = 3;
    public static final int USERNAME_MAX_LENGTH = 20;
    public static final int PASSWORD_MIN_LENGTH = 8;
    public static final int COMMENT_MIN_LENGTH = 1;
    public static final int COMMENT_MAX_LENGTH = 500;
    
    // Gallery pagination
    public static final int GALLERY_DEFAULT_LIMIT = 5;
    public static final int GALLERY_MAX_LIMIT = 20;
    
    // Sticker configuration
    public static final int MAX_STICKER_INDEX = 14; // 0-14 (15 stickers)
    
    // CSRF token length
    public static final int CSRF_TOKEN_LENGTH = 32;
    
    /**
     * Get environment variable with fallback.
     * PHP equivalent: getenv() ?: $default
     */
    private static String getEnv(String key, String defaultValue) {
        String value = System.getenv(key);
        return (value != null && !value.isEmpty()) ? value : defaultValue;
    }
}

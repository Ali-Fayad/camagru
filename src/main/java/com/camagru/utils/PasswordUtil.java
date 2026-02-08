package com.camagru.utils;

import org.mindrot.jbcrypt.BCrypt;

/**
 * Password utility using BCrypt.
 * PHP equivalent: password_hash() and password_verify()
 */
public class PasswordUtil {
    
    /**
     * Hash a plain text password using BCrypt.
     * PHP equivalent: password_hash($password, PASSWORD_BCRYPT)
     */
    public static String hashPassword(String plainPassword) {
        return BCrypt.hashpw(plainPassword, BCrypt.gensalt(10));
    }
    
    /**
     * Verify a plain text password against a hashed password.
     * PHP equivalent: password_verify($password, $hash)
     */
    public static boolean verifyPassword(String plainPassword, String hashedPassword) {
        try {
            return BCrypt.checkpw(plainPassword, hashedPassword);
        } catch (IllegalArgumentException e) {
            return false;
        }
    }
}

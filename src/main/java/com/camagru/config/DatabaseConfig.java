package com.camagru.config;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * Database configuration and connection management.
 * Uses PostgreSQL JDBC driver (equivalent to PHP PDO).
 */
public class DatabaseConfig {
    
    private static final String DB_URL = getEnv("DB_URL", "jdbc:postgresql://localhost:5432/camagru");
    private static final String DB_USER = getEnv("DB_USER", "camagru");
    private static final String DB_PASSWORD = getEnv("DB_PASSWORD", "camagrupwd");
    
    static {
        try {
            // Load PostgreSQL JDBC driver
            Class.forName("org.postgresql.Driver");
        } catch (ClassNotFoundException e) {
            throw new RuntimeException("PostgreSQL JDBC Driver not found", e);
        }
    }
    
    /**
     * Get a database connection.
     * PHP equivalent: new PDO()
     */
    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
    }
    
    /**
     * Close database connection safely.
     * PHP equivalent: $pdo = null;
     */
    public static void closeConnection(Connection conn) {
        if (conn != null) {
            try {
                conn.close();
            } catch (SQLException e) {
                // Silently ignore close errors
            }
        }
    }
    
    /**
     * Get environment variable with fallback.
     * PHP equivalent: getenv() with default
     */
    private static String getEnv(String key, String defaultValue) {
        String value = System.getenv(key);
        return (value != null && !value.isEmpty()) ? value : defaultValue;
    }
}

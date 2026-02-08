package com.camagru.utils;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

/**
 * File utility for file operations.
 * PHP equivalent: file_put_contents(), file_get_contents(), unlink(), etc.
 */
public class FileUtil {
    
    /**
     * Save base64-encoded image data to file.
     * PHP equivalent: file_put_contents($path, base64_decode($data))
     */
    public static String saveBase64Image(String base64Data, String directory) throws IOException {
        // Remove data:image/...;base64, prefix if present
        String imageData = base64Data;
        if (base64Data.contains(",")) {
            imageData = base64Data.split(",")[1];
        }
        
        // Decode base64
        byte[] imageBytes = Base64.getDecoder().decode(imageData);
        
        // Generate unique filename using SHA-256 hash
        String filename = generateHashedFilename(imageBytes) + ".jpg";
        
        // Ensure directory exists
        Path dirPath = Paths.get(directory);
        if (!Files.exists(dirPath)) {
            Files.createDirectories(dirPath);
        }
        
        // Write file
        Path filePath = dirPath.resolve(filename);
        Files.write(filePath, imageBytes);
        
        return filename;
    }
    
    /**
     * Read file as bytes.
     * PHP equivalent: file_get_contents($path)
     */
    public static byte[] readFileBytes(String filePath) throws IOException {
        return Files.readAllBytes(Paths.get(filePath));
    }
    
    /**
     * Delete file.
     * PHP equivalent: unlink($path)
     */
    public static boolean deleteFile(String filePath) {
        try {
            return Files.deleteIfExists(Paths.get(filePath));
        } catch (IOException e) {
            return false;
        }
    }
    
    /**
     * Generate SHA-256 hash of file content for unique filename.
     * PHP equivalent: hash('sha256', $data)
     */
    public static String generateHashedFilename(byte[] data) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(data);
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString().substring(0, 32); // First 32 chars
        } catch (NoSuchAlgorithmException e) {
            // Fallback to timestamp
            return String.valueOf(System.currentTimeMillis());
        }
    }
    
    /**
     * Check if file exists.
     * PHP equivalent: file_exists($path)
     */
    public static boolean fileExists(String filePath) {
        return Files.exists(Paths.get(filePath));
    }
    
    /**
     * Get file size.
     * PHP equivalent: filesize($path)
     */
    public static long getFileSize(String filePath) throws IOException {
        return Files.size(Paths.get(filePath));
    }
}

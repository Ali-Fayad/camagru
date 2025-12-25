package com.camagru.services;

/**
 * Notification service for sending email notifications
 * TODO: Implement actual SMTP email sending
 */
public class NotificationService {
    
    /**
     * Send plain text email notification
     * Currently logs to console - implement SMTP later
     */
    public void sendEmail(String to, String subject, String message) {
        // TODO: Implement actual email sending with JavaMail API
        // For now, just log it
        System.out.println("=== EMAIL NOTIFICATION ===");
        System.out.println("To: " + to);
        System.out.println("Subject: " + subject);
        System.out.println("Message: " + message);
        System.out.println("==========================");
    }
}

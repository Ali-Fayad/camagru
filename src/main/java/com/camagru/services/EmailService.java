package com.camagru.services;

import com.camagru.config.AppConfig;
import com.camagru.config.EmailConfig;
import jakarta.mail.Message;
import jakarta.mail.MessagingException;
import jakarta.mail.Session;
import jakarta.mail.Transport;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;

/**
 * Email service for sending emails.
 * PHP equivalent: mail() function or PHPMailer
 */
public class EmailService {
    
    /**
     * Send verification email with 6-digit code.
     * PHP equivalent: mail($to, $subject, $body, $headers)
     */
    public void sendVerificationEmail(String toEmail, String username, String verificationCode) {
        String subject = "Verify your Camagru account";
        String body = String.format(
            "Hi %s,\n\n" +
            "Thank you for registering with Camagru!\n\n" +
            "Your verification code is: %s\n\n" +
            "This code will expire in %d hours.\n\n" +
            "If you didn't create this account, please ignore this email.\n\n" +
            "Best regards,\n" +
            "The Camagru Team",
            username, verificationCode, AppConfig.VERIFICATION_EXPIRY_HOURS
        );
        
        sendEmail(toEmail, subject, body);
    }
    
    /**
     * Send password reset email.
     */
    public void sendPasswordResetEmail(String toEmail, String username, String resetToken) {
        String resetLink = AppConfig.APP_URL + "/reset-password?token=" + resetToken;
        
        String subject = "Reset your Camagru password";
        String body = String.format(
            "Hi %s,\n\n" +
            "You requested to reset your password for Camagru.\n\n" +
            "Click the link below to reset your password:\n" +
            "%s\n\n" +
            "This link will expire in %d hour(s).\n\n" +
            "If you didn't request this, please ignore this email.\n\n" +
            "Best regards,\n" +
            "The Camagru Team",
            username, resetLink, AppConfig.RESET_TOKEN_EXPIRY_HOURS
        );
        
        sendEmail(toEmail, subject, body);
    }
    
    /**
     * Send comment notification email.
     */
    public void sendCommentNotification(String toEmail, String recipientUsername, String commenterUsername, String commentText) {
        String subject = "New Comment on Your Post";
        String body = String.format(
            "Hi %s,\n\n" +
            "%s commented on your photo:\n\n" +
            "\"%s\"\n\n" +
            "Log in to Camagru to view and respond:\n" +
            "%s\n\n" +
            "Best regards,\n" +
            "The Camagru Team",
            recipientUsername, commenterUsername, commentText, AppConfig.APP_URL
        );
        
        sendEmail(toEmail, subject, body);
    }
    
    /**
     * Send like notification email.
     */
    public void sendLikeNotification(String toEmail, String recipientUsername, String likerUsername) {
        String subject = "New Like on Your Post";
        String body = String.format(
            "Hi %s,\n\n" +
            "%s liked your photo!\n\n" +
            "Log in to Camagru to view:\n" +
            "%s\n\n" +
            "Best regards,\n" +
            "The Camagru Team",
            recipientUsername, likerUsername, AppConfig.APP_URL
        );
        
        sendEmail(toEmail, subject, body);
    }
    
    /**
     * Send email using JavaMail.
     * PHP equivalent: mail() or SMTP send
     */
    private void sendEmail(String to, String subject, String body) {
        try {
            Session session = EmailConfig.getMailSession();
            
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(EmailConfig.getFromAddress()));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(to));
            message.setSubject(subject);
            message.setText(body);
            
            Transport.send(message);
        } catch (MessagingException e) {
            // Silently fail - email sending errors should not break the application
            // In production, this should be logged to a proper logging system
        }
    }
}

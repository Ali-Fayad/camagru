package com.camagru.config;

import jakarta.mail.Authenticator;
import jakarta.mail.PasswordAuthentication;
import jakarta.mail.Session;

import java.util.Properties;

/**
 * Email configuration for JavaMail.
 * PHP equivalent: mail() or PHPMailer configuration
 */
public class EmailConfig {
    
    private static final String SMTP_HOST = getEnv("SMTP_HOST", "smtp.gmail.com");
    private static final String SMTP_PORT = getEnv("SMTP_PORT", "587");
    private static final String SMTP_USER = getEnv("SMTP_USER", "your-email@gmail.com");
    private static final String SMTP_PASSWORD = getEnv("SMTP_PASSWORD", "your-app-password");
    private static final String SMTP_FROM = getEnv("SMTP_FROM", "noreply@camagru.com");
    
    /**
     * Get configured mail session.
     * PHP equivalent: Configuring mail() or PHPMailer
     */
    public static Session getMailSession() {
        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", SMTP_HOST);
        props.put("mail.smtp.port", SMTP_PORT);
        props.put("mail.smtp.ssl.trust", SMTP_HOST);
        
        return Session.getInstance(props, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(SMTP_USER, SMTP_PASSWORD);
            }
        });
    }
    
    public static String getFromAddress() {
        return SMTP_FROM;
    }
    
    private static String getEnv(String key, String defaultValue) {
        String value = System.getenv(key);
        return (value != null && !value.isEmpty()) ? value : defaultValue;
    }
}

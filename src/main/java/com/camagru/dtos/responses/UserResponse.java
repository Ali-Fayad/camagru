package com.camagru.dtos.responses;

/**
 * User response DTO (safe for client - no sensitive data)
 */
public class UserResponse {
    private Integer id;
    private String username;
    private String email;
    private boolean isVerified;
    private boolean receiveNotifications;

    public UserResponse() {}

    public UserResponse(Integer id, String username, String email, boolean isVerified, boolean receiveNotifications) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.isVerified = isVerified;
        this.receiveNotifications = receiveNotifications;
    }

    // Getters and setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public boolean isVerified() {
        return isVerified;
    }

    public void setVerified(boolean verified) {
        isVerified = verified;
    }

    public boolean isReceiveNotifications() {
        return receiveNotifications;
    }

    public void setReceiveNotifications(boolean receiveNotifications) {
        this.receiveNotifications = receiveNotifications;
    }
}

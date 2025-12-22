package com.camagru.dtos.responses;

import java.time.Instant;

/**
 * Generic API response wrapper
 */
public class ApiResponse {
    private boolean success;
    private String message;
    private Object data;
    private String error;
    private String code;
    private String timestamp;

    public ApiResponse() {
        this.timestamp = Instant.now().toString();
    }

    public ApiResponse(boolean success, String message) {
        this();
        this.success = success;
        this.message = message;
    }

    public ApiResponse(boolean success, String message, Object data) {
        this(success, message);
        this.data = data;
    }

    // Success factory methods
    public static ApiResponse success(String message) {
        return new ApiResponse(true, message);
    }

    public static ApiResponse success(String message, Object data) {
        return new ApiResponse(true, message, data);
    }

    // Error factory methods
    public static ApiResponse error(String message, String code) {
        ApiResponse response = new ApiResponse(false, null);
        response.setError(message);
        response.setCode(code);
        return response;
    }

    public static ApiResponse error(String message) {
        return error(message, "ERROR");
    }

    // Getters and setters
    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }
}

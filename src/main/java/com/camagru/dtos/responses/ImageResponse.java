package com.camagru.dtos.responses;

/**
 * Image response DTO with metadata
 */
public class ImageResponse {
    private Integer id;
    private Integer userId;
    private String username;
    private String imageUrl;
    private Integer stickerIndex;
    private Integer likeCount;
    private Integer commentCount;
    private Boolean isLikedByCurrentUser;
    private String createdAt;

    public ImageResponse() {}

    // Getters and setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Integer getStickerIndex() {
        return stickerIndex;
    }

    public void setStickerIndex(Integer stickerIndex) {
        this.stickerIndex = stickerIndex;
    }

    public Integer getLikeCount() {
        return likeCount;
    }

    public void setLikeCount(Integer likeCount) {
        this.likeCount = likeCount;
    }

    public Integer getCommentCount() {
        return commentCount;
    }

    public void setCommentCount(Integer commentCount) {
        this.commentCount = commentCount;
    }

    public Boolean getLikedByCurrentUser() {
        return isLikedByCurrentUser;
    }

    public void setLikedByCurrentUser(Boolean likedByCurrentUser) {
        isLikedByCurrentUser = likedByCurrentUser;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }
}

package com.camagru.dtos.requests;

/**
 * Image upload request DTO
 */
public class ImageUploadRequest {
    private String imageData;      // base64 encoded
    private Integer stickerIndex;
    private Boolean useWebcam;

    public ImageUploadRequest() {}

    public String getImageData() {
        return imageData;
    }

    public void setImageData(String imageData) {
        this.imageData = imageData;
    }

    public Integer getStickerIndex() {
        return stickerIndex;
    }

    public void setStickerIndex(Integer stickerIndex) {
        this.stickerIndex = stickerIndex;
    }

    public Boolean getUseWebcam() {
        return useWebcam;
    }

    public void setUseWebcam(Boolean useWebcam) {
        this.useWebcam = useWebcam;
    }
}

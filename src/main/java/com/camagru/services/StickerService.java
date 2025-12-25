package com.camagru.services;

import com.camagru.utils.StickerUtil;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Sticker service for sticker management.
 */
public class StickerService {
    
    /**
     * Get all available stickers with metadata.
     */
    public List<Map<String, Object>> getAllStickers() {
        List<String> stickerFiles = StickerUtil.listStickers();
        List<Map<String, Object>> stickers = new ArrayList<>();
        
        for (int i = 0; i < stickerFiles.size(); i++) {
            Map<String, Object> sticker = new HashMap<>();
            sticker.put("id", i);
            sticker.put("name", extractStickerName(stickerFiles.get(i)));
            sticker.put("url", "/stickers/" + stickerFiles.get(i));
            sticker.put("thumbnailUrl", "/stickers/" + getThumbnailName(stickerFiles.get(i)));
            stickers.add(sticker);
        }
        
        return stickers;
    }
    
    private String extractStickerName(String filename) {
        // Extract name from filename like "0_cat_ears.png" -> "Cat Ears"
        String namepart = filename.replaceFirst("^\\d+_", "").replaceFirst("\\.[^.]+$", "");
        String[] words = namepart.split("_");
        StringBuilder name = new StringBuilder();
        for (String word : words) {
            if (name.length() > 0) name.append(" ");
            name.append(word.substring(0, 1).toUpperCase()).append(word.substring(1));
        }
        return name.toString();
    }
    
    private String getThumbnailName(String filename) {
        // Convert "0_cat_ears.png" to "0_cat_ears_thumb.png"
        int dotIndex = filename.lastIndexOf('.');
        if (dotIndex > 0) {
            return filename.substring(0, dotIndex) + "_thumb" + filename.substring(dotIndex);
        }
        return filename + "_thumb";
    }
}

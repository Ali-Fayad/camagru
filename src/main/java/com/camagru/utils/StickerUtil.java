package com.camagru.utils;

import com.camagru.config.AppConfig;

import java.io.File;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Utility to manage sticker files stored in the webapp directory.
 */
public class StickerUtil {

    /**
     * Return the absolute path to the sticker directory.
     */
    public static String getStickerDirectory() {
        // First try catalina.base (for Tomcat)
        String catalinaBase = System.getProperty("catalina.base");
        if (catalinaBase != null && !catalinaBase.isEmpty()) {
            return catalinaBase + "/webapps/ROOT" + AppConfig.STICKER_DIR;
        }
        
        // Fallback to hardcoded Tomcat path
        File tomcatDir = new File("/usr/local/tomcat/webapps/ROOT" + AppConfig.STICKER_DIR);
        if (tomcatDir.exists()) {
            return tomcatDir.getAbsolutePath();
        }
        
        // Last resort: current directory
        return "." + AppConfig.STICKER_DIR;
    }

    /**
     * List sticker filenames (sorted) available in the sticker directory.
     */
    public static List<String> listStickers() {
        String dir = getStickerDirectory();
        File d = new File(dir);
        if (!d.exists() || !d.isDirectory()) {
            return List.of();
        }

        String[] files = d.list((f, name) -> {
            String lower = name.toLowerCase();
            boolean isImage = lower.endsWith(".png") || lower.endsWith(".jpg") || lower.endsWith(".jpeg");
            boolean isNotThumbnail = !lower.contains("_thumb");
            return isImage && isNotThumbnail;
        });

        if (files == null || files.length == 0) {
            return List.of();
        }

        return Arrays.stream(files)
            .sorted(Comparator.naturalOrder())
            .collect(Collectors.toList());
    }

    /**
     * Get full path for sticker by index. Returns null if index invalid.
     */
    public static String getStickerPathByIndex(int index) {
        List<String> stickers = listStickers();
        if (index < 0 || index >= stickers.size()) {
            return null;
        }
        return getStickerDirectory() + "/" + stickers.get(index);
    }
}

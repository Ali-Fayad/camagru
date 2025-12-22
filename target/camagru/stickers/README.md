# Stickers Directory

This directory should contain sticker PNG images with alpha channel for overlay on user images.

## Naming Convention

Stickers should follow this pattern:
- Main sticker: `{index}_{name}.png`
- Thumbnail: `{index}_{name}_thumb.png`

## Example Structure

```
stickers/
├── 0_cat_ears.png
├── 0_cat_ears_thumb.png
├── 1_glasses.png
├── 1_glasses_thumb.png
├── 2_mustache.png
├── 2_mustache_thumb.png
├── 3_crown.png
├── 3_crown_thumb.png
├── 4_heart.png
└── 4_heart_thumb.png
```

## Requirements

- Format: PNG with alpha channel (transparency)
- Recommended size: 512x512px for main, 128x128px for thumbnail
- Index: 0-based integer (0, 1, 2, ...)

## Adding Stickers

1. Create PNG image with transparency
2. Name following convention above
3. Place in this directory
4. Update sticker list in `ImageService.java` if needed

## Placeholder Note

This is a placeholder directory. Add actual PNG sticker images here for production use.
You can create stickers using:
- GIMP (free)
- Photoshop
- Online tools like Photopea

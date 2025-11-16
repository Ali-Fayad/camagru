<?php

require_once __DIR__ . "/../models/Image.php";
require_once __DIR__ . "/../models/User.php";

class PostController
{
    public static function getLatest($limit = 5, $offset = 0)
    {
        $image = new Image();
        $posts = $image->getLatest($limit, $offset);

        return [
            "status" => "success",
            "posts" => $posts,
            "count" => count($posts)
        ];
    }

    public static function add($data)
    {
        if (!isset($data['userId']) || !isset($data['image']) || !isset($data['caption'])) {
            return ["status" => "error", "message" => "Missing required fields"];
        }

        // Verify user exists
        $user = new User();
        $userData = $user->findById($data['userId']);

        if (!$userData) {
            return ["status" => "error", "message" => "User not found"];
        }

        if (!$userData['isVerified']) {
            return ["status" => "error", "message" => "User must be verified to post"];
        }

        // Handle sticker if provided
        $sticker = isset($data['sticker']) ? $data['sticker'] : null;
        $stickerPosition = isset($data['stickerPosition']) ? $data['stickerPosition'] : null;

        // Handle image upload and merging with sticker
        $imagePath = self::handleImageWithSticker(
            $data['image'], 
            $sticker, 
            $stickerPosition, 
            $data['userId']
        );

        if (!$imagePath) {
            return ["status" => "error", "message" => "Failed to process image"];
        }

        $image = new Image();
        return $image->create($data['userId'], $imagePath, $data['caption']);
    }

    /**
     * Handle image upload and merge with sticker
     * 
     * @param string $imageData Base64 image data or file path
     * @param string|null $stickerData Sticker identifier or base64 data
     * @param array|null $position Sticker position {x: number, y: number, scale: number}
     * @param int $userId User ID
     * @return string|false Image path or false on failure
     */
    private static function handleImageWithSticker($imageData, $stickerData, $position, $userId)
    {
        // Create uploads directory if it doesn't exist
        $uploadDir = __DIR__ . "/../uploads/images/";
        if (!file_exists($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        // Decode base64 image
        $mainImage = self::decodeBase64Image($imageData);
        if (!$mainImage) {
            return false;
        }

        // If no sticker, just save the main image
        if (!$stickerData) {
            return self::saveImage($mainImage, $userId);
        }

        // Get sticker image
        $stickerImage = self::getStickerImage($stickerData);
        if (!$stickerImage) {
            // If sticker fails, just save the main image without sticker
            return self::saveImage($mainImage, $userId);
        }

        // Merge images
        $mergedImage = self::mergeImages($mainImage, $stickerImage, $position);
        
        // Clean up
        imagedestroy($mainImage);
        imagedestroy($stickerImage);

        if (!$mergedImage) {
            return false;
        }

        // Save merged image
        $result = self::saveImage($mergedImage, $userId);
        imagedestroy($mergedImage);

        return $result;
    }

    /**
     * Decode base64 image data
     */
    private static function decodeBase64Image($imageData)
    {
        // Check if it's base64
        if (preg_match('/^data:image\/(\w+);base64,/', $imageData, $type)) {
            $imageData = substr($imageData, strpos($imageData, ',') + 1);
            $imageData = base64_decode($imageData);

            if ($imageData === false) {
                return false;
            }

            return imagecreatefromstring($imageData);
        }

        // If not base64, try to load from file path
        if (file_exists($imageData)) {
            return self::createImageFromFile($imageData);
        }

        return false;
    }

    /**
     * Get sticker image resource
     */
    private static function getStickerImage($stickerData)
    {
        // Check if sticker is a predefined sticker name
        $stickerDir = __DIR__ . "/../uploads/stickers/";
        
        // If it's a sticker name/ID, load from stickers directory
        if (file_exists($stickerDir . $stickerData)) {
            return self::createImageFromFile($stickerDir . $stickerData);
        }

        // If it's base64, decode it
        if (preg_match('/^data:image\/(\w+);base64,/', $stickerData)) {
            return self::decodeBase64Image($stickerData);
        }

        // If it's a file path
        if (file_exists($stickerData)) {
            return self::createImageFromFile($stickerData);
        }

        return false;
    }

    /**
     * Create GD image resource from file
     */
    private static function createImageFromFile($filepath)
    {
        $imageInfo = getimagesize($filepath);
        if (!$imageInfo) {
            return false;
        }

        $mimeType = $imageInfo['mime'];

        switch ($mimeType) {
            case 'image/jpeg':
                return imagecreatefromjpeg($filepath);
            case 'image/png':
                return imagecreatefrompng($filepath);
            case 'image/gif':
                return imagecreatefromgif($filepath);
            case 'image/webp':
                return imagecreatefromwebp($filepath);
            default:
                return false;
        }
    }

    /**
     * Merge main image with sticker
     * 
     * @param resource $mainImage GD image resource
     * @param resource $stickerImage GD image resource
     * @param array|null $position Position data {x, y, scale}
     * @return resource|false Merged image or false
     */
    private static function mergeImages($mainImage, $stickerImage, $position)
    {
        // Get dimensions
        $mainWidth = imagesx($mainImage);
        $mainHeight = imagesy($mainImage);
        $stickerWidth = imagesx($stickerImage);
        $stickerHeight = imagesy($stickerImage);

        // Default position (center) and scale
        $scale = isset($position['scale']) ? floatval($position['scale']) : 1.0;
        $x = isset($position['x']) ? intval($position['x']) : ($mainWidth - $stickerWidth * $scale) / 2;
        $y = isset($position['y']) ? intval($position['y']) : ($mainHeight - $stickerHeight * $scale) / 2;

        // Calculate scaled dimensions
        $scaledWidth = $stickerWidth * $scale;
        $scaledHeight = $stickerHeight * $scale;

        // Create a copy of main image to work with
        $mergedImage = imagecreatetruecolor($mainWidth, $mainHeight);
        
        // Preserve transparency
        imagealphablending($mergedImage, false);
        imagesavealpha($mergedImage, true);
        
        // Copy main image to merged image
        imagecopy($mergedImage, $mainImage, 0, 0, 0, 0, $mainWidth, $mainHeight);

        // Enable alpha blending for overlay
        imagealphablending($mergedImage, true);

        // Resize and merge sticker onto main image
        imagecopyresampled(
            $mergedImage,           // Destination
            $stickerImage,          // Source
            $x,                     // Destination X
            $y,                     // Destination Y
            0,                      // Source X
            0,                      // Source Y
            $scaledWidth,           // Destination width
            $scaledHeight,          // Destination height
            $stickerWidth,          // Source width
            $stickerHeight          // Source height
        );

        return $mergedImage;
    }

    /**
     * Save image to file
     * 
     * @param resource $image GD image resource
     * @param int $userId User ID
     * @return string|false File path or false
     */
    private static function saveImage($image, $userId)
    {
        $uploadDir = __DIR__ . "/../uploads/images/";
        $filename = 'image_' . $userId . '_' . time() . '_' . uniqid() . '.png';
        $filepath = $uploadDir . $filename;

        // Save as PNG to preserve quality and transparency
        if (imagepng($image, $filepath, 9)) {
            return 'uploads/images/' . $filename;
        }

        return false;
    }

    /**
     * Get available stickers
     */
    public static function getStickers()
    {
        $stickerDir = __DIR__ . "/../uploads/stickers/";
        
        if (!file_exists($stickerDir)) {
            mkdir($stickerDir, 0777, true);
        }

        $stickers = [];
        $files = scandir($stickerDir);

        foreach ($files as $file) {
            if ($file === '.' || $file === '..') {
                continue;
            }

            $filepath = $stickerDir . $file;
            if (is_file($filepath)) {
                $stickers[] = [
                    'id' => $file,
                    'name' => pathinfo($file, PATHINFO_FILENAME),
                    'url' => '/uploads/stickers/' . $file
                ];
            }
        }

        return [
            "status" => "success",
            "stickers" => $stickers,
            "count" => count($stickers)
        ];
    }
}
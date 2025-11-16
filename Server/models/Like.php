<?php

require_once __DIR__ . "/../config/database.php";

class Like
{
    private $conn;
    private $table = "likes";

    public function __construct()
    {
        $database = new Database();
        $this->conn = $database->connect();
    }

    public function toggle($userId, $imageId)
    {
        // Check if like exists
        $existing = $this->findLike($userId, $imageId);

        if ($existing) {
            // Unlike
            return $this->unlike($userId, $imageId);
        } else {
            // Like
            return $this->like($userId, $imageId);
        }
    }

    private function like($userId, $imageId)
    {
        $query = "INSERT INTO " . $this->table . " (userId, imageId) VALUES (?, ?)";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("ii", $userId, $imageId);

        if ($stmt->execute()) {
            return ["status" => "success", "message" => "Post liked", "action" => "liked"];
        }

        return ["status" => "error", "message" => "Failed to like post"];
    }

    private function unlike($userId, $imageId)
    {
        $query = "DELETE FROM " . $this->table . " WHERE userId = ? AND imageId = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("ii", $userId, $imageId);

        if ($stmt->execute()) {
            return ["status" => "success", "message" => "Post unliked", "action" => "unliked"];
        }

        return ["status" => "error", "message" => "Failed to unlike post"];
    }

    public function findLike($userId, $imageId)
    {
        $query = "SELECT * FROM " . $this->table . " WHERE userId = ? AND imageId = ? LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("ii", $userId, $imageId);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_assoc();
    }

    public function getImageLikes($imageId)
    {
        $query = "SELECT l.*, u.username 
                  FROM " . $this->table . " l 
                  JOIN users u ON l.userId = u.id 
                  WHERE l.imageId = ? 
                  ORDER BY l.created_at DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $imageId);
        $stmt->execute();
        $result = $stmt->get_result();

        $likes = [];
        while ($row = $result->fetch_assoc()) {
            $likes[] = $row;
        }

        return $likes;
    }
}
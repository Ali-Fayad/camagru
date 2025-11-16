<?php

require_once __DIR__ . "/../config/database.php";

class Image
{
    private $conn;
    private $table = "images";

    public function __construct()
    {
        $database = new Database();
        $this->conn = $database->connect();
    }

    public function create($userId, $photo, $caption)
    {
        $query = "INSERT INTO " . $this->table . " (userId, photo, caption, likesCount, commentsCount) 
                  VALUES (?, ?, ?, 0, 0)";

        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("iss", $userId, $photo, $caption);

        if ($stmt->execute()) {
            return [
                "status" => "success",
                "message" => "Post created successfully",
                "imageId" => $this->conn->insert_id
            ];
        }

        return ["status" => "error", "message" => "Failed to create post"];
    }

    public function getLatest($limit = 5, $offset = 0)
    {
        $query = "SELECT i.*, u.username 
                  FROM " . $this->table . " i 
                  JOIN users u ON i.userId = u.id 
                  ORDER BY i.created_at DESC 
                  LIMIT ? OFFSET ?";

        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("ii", $limit, $offset);
        $stmt->execute();
        $result = $stmt->get_result();

        $images = [];
        while ($row = $result->fetch_assoc()) {
            $images[] = $row;
        }

        return $images;
    }

    public function findById($id)
    {
        $query = "SELECT * FROM " . $this->table . " WHERE id = ? LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_assoc();
    }

    public function incrementLikes($imageId)
    {
        $query = "UPDATE " . $this->table . " SET likesCount = likesCount + 1 WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $imageId);
        return $stmt->execute();
    }

    public function decrementLikes($imageId)
    {
        $query = "UPDATE " . $this->table . " SET likesCount = likesCount - 1 WHERE id = ? AND likesCount > 0";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $imageId);
        return $stmt->execute();
    }

    public function incrementComments($imageId)
    {
        $query = "UPDATE " . $this->table . " SET commentsCount = commentsCount + 1 WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $imageId);
        return $stmt->execute();
    }
}
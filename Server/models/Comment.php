<?php

require_once __DIR__ . "/../config/database.php";

class Comment
{
    private $conn;
    private $table = "comments";

    public function __construct()
    {
        $database = new Database();
        $this->conn = $database->connect();
    }

    public function create($userId, $imageId, $description)
    {
        if (empty(trim($description))) {
            return ["status" => "error", "message" => "Comment cannot be empty"];
        }

        $query = "INSERT INTO " . $this->table . " (userId, imageId, description) VALUES (?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("iis", $userId, $imageId, $description);

        if ($stmt->execute()) {
            return [
                "status" => "success",
                "message" => "Comment added successfully",
                "commentId" => $this->conn->insert_id
            ];
        }

        return ["status" => "error", "message" => "Failed to add comment"];
    }

    public function getImageComments($imageId)
    {
        $query = "SELECT c.*, u.username 
                  FROM " . $this->table . " c 
                  JOIN users u ON c.userId = u.id 
                  WHERE c.imageId = ? 
                  ORDER BY c.created_at DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $imageId);
        $stmt->execute();
        $result = $stmt->get_result();

        $comments = [];
        while ($row = $result->fetch_assoc()) {
            $comments[] = $row;
        }

        return $comments;
    }
}
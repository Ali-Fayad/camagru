<?php

require_once __DIR__ . "/../config/database.php";

class User
{
    private $conn;
    private $table = "users";

    public function __construct()
    {
        $database = new Database();
        $this->conn = $database->connect();
    }

    public function create($email, $username, $password)
    {
        $username = strtolower($username);
        
        // Validate username (letters and digits only)
        if (!preg_match('/^[a-z0-9]+$/', $username)) {
            return ["status" => "error", "message" => "Username must contain only letters and digits"];
        }

        // Validate email
        if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strpos($email, '@') === false) {
            return ["status" => "error", "message" => "Invalid email address"];
        }

        // Check if user exists
        if ($this->findByUsername($username)) {
            return ["status" => "error", "message" => "Username already exists"];
        }

        if ($this->findByEmail($email)) {
            return ["status" => "error", "message" => "Email already exists"];
        }

        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

        $query = "INSERT INTO " . $this->table . " 
                  (email, username, password, enableNotification, isVerified) 
                  VALUES (?, ?, ?, 1, 0)";

        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("sss", $email, $username, $hashedPassword);

        if ($stmt->execute()) {
            return [
                "status" => "success",
                "message" => "User created successfully",
                "userId" => $this->conn->insert_id
            ];
        }

        return ["status" => "error", "message" => "Failed to create user"];
    }

    public function findByUsername($username)
    {
        $username = strtolower($username);
        $query = "SELECT * FROM " . $this->table . " WHERE username = ? LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_assoc();
    }

    public function findByEmail($email)
    {
        $query = "SELECT * FROM " . $this->table . " WHERE email = ? LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_assoc();
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

    public function update($userId, $data)
    {
        $user = $this->findById($userId);
        if (!$user) {
            return ["status" => "error", "message" => "User not found"];
        }

        $updates = [];
        $params = [];
        $types = "";

        if (isset($data['email']) && $data['email'] !== $user['email']) {
            if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL) || strpos($data['email'], '@') === false) {
                return ["status" => "error", "message" => "Invalid email address"];
            }
            if ($this->findByEmail($data['email'])) {
                return ["status" => "error", "message" => "Email already exists"];
            }
            $updates[] = "email = ?";
            $params[] = $data['email'];
            $types .= "s";
        }

        if (isset($data['username']) && $data['username'] !== $user['username']) {
            $username = strtolower($data['username']);
            if (!preg_match('/^[a-z0-9]+$/', $username)) {
                return ["status" => "error", "message" => "Username must contain only letters and digits"];
            }
            if ($this->findByUsername($username)) {
                return ["status" => "error", "message" => "Username already exists"];
            }
            $updates[] = "username = ?";
            $params[] = $username;
            $types .= "s";
        }

        if (isset($data['password']) && !empty($data['password'])) {
            $updates[] = "password = ?";
            $params[] = password_hash($data['password'], PASSWORD_BCRYPT);
            $types .= "s";
        }

        if (isset($data['enableNotification'])) {
            $updates[] = "enableNotification = ?";
            $params[] = (bool)$data['enableNotification'] ? 1 : 0;
            $types .= "i";
        }

        if (empty($updates)) {
            return ["status" => "error", "message" => "No fields to update"];
        }

        $updates[] = "updated_at = NOW()";
        $query = "UPDATE " . $this->table . " SET " . implode(", ", $updates) . " WHERE id = ?";
        $params[] = $userId;
        $types .= "i";

        $stmt = $this->conn->prepare($query);
        $stmt->bind_param($types, ...$params);

        if ($stmt->execute()) {
            return ["status" => "success", "message" => "User updated successfully"];
        }

        return ["status" => "error", "message" => "Failed to update user"];
    }

    public function delete($userId)
    {
        $query = "DELETE FROM " . $this->table . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $userId);

        if ($stmt->execute()) {
            return ["status" => "success", "message" => "User deleted successfully"];
        }

        return ["status" => "error", "message" => "Failed to delete user"];
    }

    public function verifyEmail($email)
    {
        $query = "UPDATE " . $this->table . " SET isVerified = 1 WHERE email = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("s", $email);

        if ($stmt->execute() && $stmt->affected_rows > 0) {
            return ["status" => "success", "message" => "Email verified successfully"];
        }

        return ["status" => "error", "message" => "User not found or already verified"];
    }

    public function getVerificationStatus($email)
    {
        $user = $this->findByEmail($email);
        
        if (!$user) {
            return ["status" => "error", "message" => "User not found"];
        }

        return [
            "status" => "success",
            "isVerified" => (bool)$user['isVerified'],
            "email" => $user['email']
        ];
    }
}
<?php

class Database
{
    private $host;
    private $db_name;
    private $username;
    private $password;
    private $conn;

    public function __construct()
    {
        // Read environment variables
        $this->host = getenv('DB_HOST') ?: 'db'; // Default to 'db' if not set
        $this->db_name = getenv('DB_NAME') ?: 'camagru'; // Default to 'camagru' if not set
        $this->username = getenv('DB_USER') ?: 'root'; // Default to 'root' if not set
        $this->password = getenv('DB_PASSWORD') ?: ''; // Default to '' if not set

        $this->conn = null;
    }

    public function connect()
    {
        $this->conn = null;

        try {
            // Attempt to establish a connection to the database
            $this->conn = new mysqli($this->host, $this->username, $this->password, $this->db_name);

            // Check for connection errors
            if ($this->conn->connect_error) {
                throw new Exception("Connection failed: " . $this->conn->connect_error);
            }

            // Set charset to utf8mb4 for better support of multilingual content
            $this->conn->set_charset("utf8mb4");

        } catch (Exception $e) {
            echo "Connection error: " . $e->getMessage();
        }

        return $this->conn;
    }
}

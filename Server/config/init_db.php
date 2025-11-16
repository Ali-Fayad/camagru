<?php

// Simple script to create the `camagru` database if it does not exist yet.
// Usage from terminal:  php Server/config/init_db.php

$host = '127.0.0.1';
$user = 'root';
$pass = 'afayad123';
$dbName = 'camagru';

$mysqli = new mysqli($host, $user, $pass);

if ($mysqli->connect_error) {
    die('Connection failed: ' . $mysqli->connect_error . PHP_EOL);
}

$sql = "CREATE DATABASE IF NOT EXISTS `$dbName` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci";

if ($mysqli->query($sql) === true) {
    echo "Database `$dbName` is ready." . PHP_EOL;
} else {
    echo 'Error creating database: ' . $mysqli->error . PHP_EOL;
}

$mysqli->close();

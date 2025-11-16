<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS")
{
    exit(0);
}

require_once __DIR__ . "/../routes/api.php";

$method = $_SERVER["REQUEST_METHOD"];
$uri = trim($_SERVER["REQUEST_URI"], "/");

// remove query parameters
$uri = explode("?", $uri)[0];

// normalize API prefix
$uri = str_replace("public/", "", $uri);

$uri = preg_replace('#^index\.php/#', '', $uri);

// read JSON body
$input = json_decode(file_get_contents("php://input"), true) ?? [];

$response = Router::handle($method, $uri, $input);

header("Content-Type: application/json");
echo json_encode($response);

<?php

require_once __DIR__ . "/../Controller/UserController.php";
require_once __DIR__ . "/../Controller/MailerController.php";
require_once __DIR__ . "/../Controller/PostController.php";
require_once __DIR__ . "/../Controller/LikeController.php";
require_once __DIR__ . "/../Controller/CommentController.php";

class Router
{
    public static function handle($method, $uri, $data)
    {
        switch ($uri) {

            // ---------- USER ----------
            case "user/login":
                return UserController::login($data);

            case "user/signup":
                return UserController::signup($data);

            case "user/update":
                return UserController::update($data);

            case "user/delete":
                return UserController::delete($data);


            // ---------- MAILER ----------
            case "mailer/verify":
                return MailerController::verifyEmail($data);

            case "mailer":
                return MailerController::sendCode($data);


            // ---------- POSTS ----------
            case "posts/get":
                return PostController::getLatest();

            case "posts/add":
                return PostController::add($data);

            case "posts/stickers":
                return PostController::getStickers();


            // ---------- LIKES ----------
            case "like":
                return LikeController::like($data);


            // ---------- COMMENTS ----------
            case "comment":
                return CommentController::add($data);


            default:
                return [
                    "status" => "error",
                    "message" => "Endpoint not found",
                    "endpoint" => $uri
                ];
        }
    }
}
<?php

require_once __DIR__ . "/../models/Comment.php";
require_once __DIR__ . "/../models/Image.php";
require_once __DIR__ . "/../models/User.php";
require_once __DIR__ . "/MailerController.php";

class CommentController
{
    public static function add($data)
    {
        if (!isset($data['userId']) || !isset($data['imageId']) || !isset($data['comment'])) {
            return ["status" => "error", "message" => "Missing required fields"];
        }

        // Verify image exists
        $imageModel = new Image();
        $image = $imageModel->findById($data['imageId']);

        if (!$image) {
            return ["status" => "error", "message" => "Image not found"];
        }

        // Verify user exists
        $userModel = new User();
        $user = $userModel->findById($data['userId']);

        if (!$user) {
            return ["status" => "error", "message" => "User not found"];
        }

        // Create comment
        $commentModel = new Comment();
        $result = $commentModel->create($data['userId'], $data['imageId'], $data['comment']);

        if ($result['status'] === 'success') {
            // Update image comments count
            $imageModel->incrementComments($data['imageId']);

            // Send notification to image owner if they're not the one who commented
            if ($image['userId'] != $data['userId']) {
                $imageOwner = $userModel->findById($image['userId']);
                if ($imageOwner && $imageOwner['enableNotification']) {
                    $message = $user['username'] . " commented on your post: " . $data['comment'];
                    MailerController::sendNotification($imageOwner['email'], $message);
                }
            }
        }

        return $result;
    }

    public static function getComments($imageId)
    {
        $commentModel = new Comment();
        $comments = $commentModel->getImageComments($imageId);

        return [
            "status" => "success",
            "comments" => $comments,
            "count" => count($comments)
        ];
    }
}
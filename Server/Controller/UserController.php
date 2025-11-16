<?php

require_once __DIR__ . "/../models/User.php";

class UserController
{
    public static function signup($data)
    {
        if (!isset($data['email']) || !isset($data['username']) || !isset($data['password'])) {
            return ["status" => "error", "message" => "Missing required fields"];
        }

        $user = new User();
        $result = $user->create($data['email'], $data['username'], $data['password']);

        if ($result['status'] === 'success') {
            // Send verification email
            $mailerResult = MailerController::sendVerificationCode($data['email'], $result['verificationCode']);
            
            return [
                "status" => "success",
                "message" => "User created successfully. Please verify your email.",
                "userId" => $result['userId']
            ];
        }

        return $result;
    }

    public static function login($data)
    {
        if (!isset($data['username']) || !isset($data['password'])) {
            return ["status" => "error", "message" => "Invalid credentials"];
        }

        $user = new User();
        $userData = $user->findByUsername($data['username']);

        if (!$userData) {
            return ["status" => "error", "message" => "Invalid credentials"];
        }

        if (!password_verify($data['password'], $userData['password'])) {
            return ["status" => "error", "message" => "Invalid credentials"];
        }

        if (!$userData['isVerified']) {
            return ["status" => "error", "message" => "Please verify your email before logging in"];
        }

        // Remove sensitive data
        unset($userData['password']);
        unset($userData['verification_code']);

        return [
            "status" => "success",
            "message" => "Login successful",
            "user" => $userData
        ];
    }

    public static function update($data)
    {
        if (!isset($data['userId'])) {
            return ["status" => "error", "message" => "User ID is required"];
        }

        $user = new User();
        return $user->update($data['userId'], $data);
    }

    public static function delete($data)
    {
        if (!isset($data['userId'])) {
            return ["status" => "error", "message" => "User ID is required"];
        }

        $user = new User();
        return $user->delete($data['userId']);
    }
}
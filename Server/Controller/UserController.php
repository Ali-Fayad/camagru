<?php

require_once __DIR__ . "/../models/User.php";
// Ensure MailerController is available when sending verification emails
require_once __DIR__ . "/../Controller/MailerController.php";

class UserController
{
    public static function signup($data)
    {
        if (!isset($data['email']) || !isset($data['username']) || !isset($data['password'])) {
            return ["status" => "error", "message" => "Missing required fields"];
        }

        $user = new User();
        $result = $user->create($data['email'], $data['username'], $data['password']);

        if (isset($result['status']) && $result['status'] === 'success') {
            // Try to obtain a verification code safely (avoid undefined index warnings)
            $verificationCode = $result['verificationCode'] ?? $result['verification_code'] ?? null;

            // If not returned by create(), try to read it from the DB using the returned userId
            if (empty($verificationCode) && isset($result['userId'])) {
                $dbUser = $user->findById($result['userId']);
                $verificationCode = $dbUser['verification_code'] ?? null;
            }

            if (!empty($verificationCode)) {
                // Send verification email (MailerController::sendVerificationCode logs the code when mail not configured)
                MailerController::sendVerificationCode($data['email'], $verificationCode);
            }

            return [
                "status" => "success",
                "message" => "User created successfully. Please verify your email.",
                "userId" => $result['userId'] ?? null
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

        // NOTE: allow login even if the user hasn't verified their email yet.
        // Previously: if (!$userData['isVerified']) { return ["status"=>"error","message"=>"Please verify your email before logging in"]; }

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

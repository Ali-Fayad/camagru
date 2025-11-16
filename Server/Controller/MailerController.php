<?php

require_once __DIR__ . "/../models/User.php";

class MailerController
{
    public static function sendCode($data)
    {
        if (!isset($data['email'])) {
            return ["status" => "error", "message" => "Email is required"];
        }

        $user = new User();
        $userData = $user->findByEmail($data['email']);

        if (!$userData) {
            return ["status" => "error", "message" => "User not found"];
        }

        $verificationCode = rand(100000, 999999);
        $user->updateVerificationCode($data['email'], $verificationCode);

        // Send email with verification code
        self::sendVerificationCode($data['email'], $verificationCode);

        return [
            "status" => "success",
            "message" => "Verification code sent to email"
        ];
    }

    public static function verifyEmail($data)
    {
        if (!isset($data['email']) || !isset($data['code'])) {
            return ["status" => "error", "message" => "Email and code are required"];
        }

        $user = new User();
        return $user->verifyEmail($data['email'], $data['code']);
    }

    public static function sendVerificationCode($email, $code)
    {
        // Basic email sending
        // You should use a proper email library like PHPMailer for production
        $subject = "Email Verification Code";
        $message = "Your verification code is: " . $code;
        $headers = "From: noreply@yourdomain.com\r\n";
        $headers .= "Content-Type: text/html; charset=UTF-8\r\n";

        $htmlMessage = "
            <html>
            <head><title>Email Verification</title></head>
            <body>
                <h2>Email Verification</h2>
                <p>Your verification code is: <strong>" . $code . "</strong></p>
                <p>Please enter this code to verify your email address.</p>
            </body>
            </html>
        ";

        // Uncomment this line when you have a working mail server
        // mail($email, $subject, $htmlMessage, $headers);

        // For development, you can log the code instead
        error_log("Verification code for $email: $code");

        return ["status" => "success", "message" => "Email sent"];
    }

    public static function sendNotification($email, $message)
    {
        $user = new User();
        $userData = $user->findByEmail($email);

        if (!$userData || !$userData['enableNotification']) {
            return ["status" => "skipped", "message" => "Notifications disabled"];
        }

        // Send notification email
        $subject = "New Notification";
        $headers = "From: noreply@yourdomain.com\r\n";
        $headers .= "Content-Type: text/html; charset=UTF-8\r\n";

        // Uncomment this line when you have a working mail server
        // mail($email, $subject, $message, $headers);

        error_log("Notification sent to $email: $message");

        return ["status" => "success", "message" => "Notification sent"];
    }
}
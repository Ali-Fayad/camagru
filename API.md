📡 Camagru API Documentation
Base URL

http://localhost:8080/api

All responses are JSON format
🔐 Authentication Endpoints
1. Register New User

    URL: /register

    Method: POST

    Content-Type: application/json

Request Body:
json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}

Validation Rules:

    username: 3-20 chars, letters, numbers, underscores only

    email: Valid email format

    password: Min 8 chars, 1 uppercase, 1 lowercase, 1 number

Success Response (201):
json

{
  "success": true,
  "message": "Registration successful. Check email for verification code.",
  "data": {
    "userId": 1,
    "username": "john_doe",
    "email": "john@example.com"
  }
}

Error Responses:

    400 VALIDATION_ERROR: Invalid input

    409 EMAIL_EXISTS: Email already registered

    409 USERNAME_EXISTS: Username already taken

    500 EMAIL_SEND_ERROR: Failed to send verification email

2. Verify Email with 6-Digit Code

    URL: /verify

    Method: POST

    Content-Type: application/json

Request Body:
json

{
  "email": "john@example.com",
  "code": "123456"
}

Success Response (200):
json

{
  "success": true,
  "message": "Email verified successfully"
}

Error Responses:

    400 INVALID_VERIFICATION: Invalid or expired code

    404 USER_NOT_FOUND: Email not registered

    409 ALREADY_VERIFIED: User already verified

3. Login

    URL: /login

    Method: POST

    Content-Type: application/json

Request Body:
json

{
  "username": "john_doe",
  "password": "SecurePass123"
}

Success Response (200):
json

{
  "success": true,
  "message": "Login successful",
  "data": {
    "userId": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "isVerified": true,
    "sessionId": "abc123def456..."
  }
}

Sets Cookie: sessionId=abc123def456...; HttpOnly; Secure

Error Responses:

    400 INVALID_CREDENTIALS: Wrong username/password

    403 NOT_VERIFIED: Email not verified

    404 USER_NOT_FOUND: Username not found

4. Logout

    URL: /logout

    Method: POST

    Requires Auth: ✅

Success Response (200):
json

{
  "success": true,
  "message": "Logged out successfully"
}

Clears Session Cookie
5. Forgot Password

    URL: /forgot-password

    Method: POST

    Content-Type: application/json

Request Body:
json

{
  "email": "john@example.com"
}

Success Response (200):
json

{
  "success": true,
  "message": "Password reset email sent"
}

Error Responses:

    404 USER_NOT_FOUND: Email not registered

6. Reset Password

    URL: /reset-password

    Method: POST

    Content-Type: application/json

Request Body:
json

{
  "token": "reset_token_from_email",
  "newPassword": "NewSecurePass123"
}

Success Response (200):
json

{
  "success": true,
  "message": "Password updated successfully"
}

Error Responses:

    400 INVALID_TOKEN: Invalid or expired reset token

    400 VALIDATION_ERROR: Weak password

👤 User Profile Endpoints
7. Get Current User Profile

    URL: /user/profile

    Method: GET

    Requires Auth: ✅

Success Response (200):
json

{
  "success": true,
  "data": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "isVerified": true,
    "receiveNotifications": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "imageCount": 12,
    "likeCount": 45
  }
}

8. Update Profile

    URL: /user/profile

    Method: PUT

    Requires Auth: ✅

    Content-Type: application/json

Request Body (any combination):
json

{
  "username": "john_new",
  "email": "john.new@example.com"
}

Note: Changing email requires re-verification

Success Response (200):
json

{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "username": "john_new",
    "email": "john.new@example.com",
    "needsVerification": true  // if email changed
  }
}

Error Responses:

    409 USERNAME_EXISTS: Username taken

    409 EMAIL_EXISTS: Email already registered

9. Change Password

    URL: /user/password

    Method: PUT

    Requires Auth: ✅

    Content-Type: application/json

Request Body:
json

{
  "currentPassword": "OldPass123",
  "newPassword": "NewPass456"
}

Success Response (200):
json

{
  "success": true,
  "message": "Password changed successfully"
}

Error Responses:

    400 INVALID_PASSWORD: Current password incorrect

10. Toggle Notifications

    URL: /user/notifications

    Method: PUT

    Requires Auth: ✅

    Content-Type: application/json

Request Body:
json

{
  "enabled": false
}

Success Response (200):
json

{
  "success": true,
  "message": "Notifications updated",
  "data": {
    "receiveNotifications": false
  }
}

🖼️ Image Creation & Management
11. Get Available Stickers

    URL: /stickers

    Method: GET

    Requires Auth: ❌

Success Response (200):
json

{
  "success": true,
  "data": [
    {
      "id": 0,
      "name": "Cat Ears",
      "thumbnailUrl": "/stickers/thumbs/0_cat_ears.png",
      "previewUrl": "/stickers/previews/0_cat_ears.png"
    },
    {
      "id": 1,
      "name": "Sunglasses",
      "thumbnailUrl": "/stickers/thumbs/1_sunglasses.png",
      "previewUrl": "/stickers/previews/1_sunglasses.png"
    }
    // ... more stickers
  ]
}

12. Create Image (Upload or Webcam)

    URL: /images

    Method: POST

    Requires Auth: ✅

    Content-Type: multipart/form-data OR application/json

Option A: Webcam Capture (JSON):
json

{
  "imageData": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ...", // base64
  "stickerIndex": 2,
  "useWebcam": true
}

Option B: File Upload (Form Data):
text

image: [binary file]
stickerIndex: 2
useWebcam: false

Parameters:

    stickerIndex: 0-based index of sticker (0 to N-1)

    useWebcam: boolean, affects validation

    imageData or image: Base64 string OR file (max 5MB, JPEG/PNG)

Success Response (201):
json

{
  "success": true,
  "message": "Image created successfully",
  "data": {
    "id": 42,
    "imageUrl": "/uploads/abc123def456.jpg",
    "stickerIndex": 2,
    "createdAt": "2024-01-15T10:30:00Z",
    "likeCount": 0,
    "commentCount": 0
  }
}

Error Responses:

    400 INVALID_STICKER: Invalid sticker index

    400 INVALID_IMAGE: Invalid image format/size

    500 IMAGE_PROCESSING_ERROR: Failed to merge images

13. Delete Image

    URL: /images/{imageId}

    Method: DELETE

    Requires Auth: ✅

Success Response (200):
json

{
  "success": true,
  "message": "Image deleted successfully"
}

Error Responses:

    404 IMAGE_NOT_FOUND

    403 NOT_OWNER: User doesn't own this image

14. Get Single Image

    URL: /images/{imageId}

    Method: GET

    Requires Auth: ❌

Success Response (200):
json

{
  "success": true,
  "data": {
    "id": 42,
    "userId": 1,
    "username": "john_doe",
    "imageUrl": "/uploads/abc123def456.jpg",
    "stickerIndex": 2,
    "stickerName": "Sunglasses",
    "createdAt": "2024-01-15T10:30:00Z",
    "likeCount": 15,
    "commentCount": 3,
    "userLiked": true,  // only if authenticated
    "isOwner": false    // only if authenticated
  }
}

📸 Gallery Endpoints (Infinite Scroll)
15. Get Gallery Images

    URL: /gallery

    Method: GET

    Requires Auth: ❌

    Infinite Scroll: Uses cursor-based pagination

Query Parameters:
text

cursor=2024-01-14T10:30:00Z  // Optional: timestamp of last loaded image
limit=5                      // Optional: images per request (min 5, max 20)

Success Response (200):
json

{
  "success": true,
  "data": {
    "images": [
      {
        "id": 42,
        "userId": 1,
        "username": "john_doe",
        "imageUrl": "/uploads/abc123def456.jpg",
        "thumbnailUrl": "/uploads/thumbs/abc123def456.jpg",
        "stickerName": "Sunglasses",
        "createdAt": "2024-01-15T10:30:00Z",
        "likeCount": 15,
        "commentCount": 3,
        "userLiked": false  // only if authenticated
      }
      // ... 4 more images (total 5)
    ],
    "nextCursor": "2024-01-14T09:15:00Z",  // null if no more images
    "hasMore": true
  }
}

Sorting: Always createdAt DESC (newest first)
16. Like/Unlike Image

    URL: /gallery/{imageId}/like

    Method: POST

    Requires Auth: ✅

Success Response (200):
json

{
  "success": true,
  "message": "Image liked",
  "data": {
    "liked": true,
    "likeCount": 16
  }
}

Toggles: If already liked, unlike (returns liked: false)

Error Responses:

    404 IMAGE_NOT_FOUND

17. Post Comment

    URL: /gallery/{imageId}/comments

    Method: POST

    Requires Auth: ✅

    Content-Type: application/json

Request Body:
json

{
  "content": "Great photo! 😍"
}

Validation: 1-500 characters

Success Response (201):
json

{
  "success": true,
  "message": "Comment posted",
  "data": {
    "id": 123,
    "userId": 2,
    "username": "jane_doe",
    "content": "Great photo! 😍",
    "createdAt": "2024-01-15T10:35:00Z"
  }
}

Triggers: Email notification to image owner (if notifications enabled)

Error Responses:

    404 IMAGE_NOT_FOUND

    400 VALIDATION_ERROR: Invalid comment content

18. Get Image Comments

    URL: /gallery/{imageId}/comments

    Method: GET

    Requires Auth: ❌

Query Parameters:
text

page=1          // Optional, default 1
limit=20        // Optional, default 20

Success Response (200):
json

{
  "success": true,
  "data": {
    "comments": [
      {
        "id": 123,
        "userId": 2,
        "username": "jane_doe",
        "content": "Great photo! 😍",
        "createdAt": "2024-01-15T10:35:00Z"
      }
      // ... more comments
    ],
    "total": 45,
    "page": 1,
    "totalPages": 3,
    "hasMore": true
  }
}

📊 Statistics (Optional/Bonus)
19. Get User Stats

    URL: /user/stats

    Method: GET

    Requires Auth: ✅

Success Response (200):
json

{
  "success": true,
  "data": {
    "imagesCreated": 12,
    "totalLikesReceived": 45,
    "totalCommentsReceived": 23,
    "likesGiven": 18,
    "commentsGiven": 9
  }
}

⚙️ System Endpoints
20. Health Check

    URL: /health

    Method: GET

    Requires Auth: ❌

Success Response (200):
json

{
  "success": true,
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "database": "connected",
  "diskSpace": "85% free"
}

🔐 Authentication Methods
Session-Based Auth

All authenticated endpoints require:

    Session Cookie (automatically set on login):
    text

Cookie: sessionId=abc123def456...

OR Session Header (for AJAX calls):
text

X-Session-Id: abc123def456...

CSRF Protection

State-changing operations (POST, PUT, DELETE) require:
text

X-CSRF-Token: csrf_token_from_session

📤 Request Headers
http

Content-Type: application/json
Accept: application/json
X-Requested-With: XMLHttpRequest  # For AJAX detection
X-CSRF-Token: abc123def...        # For state-changing requests

📥 Response Headers
http

Content-Type: application/json; charset=utf-8
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1642230000

⏱️ Rate Limiting

    Public endpoints: 100 requests/hour

    Authenticated endpoints: 1000 requests/hour

    Image uploads: 10 requests/hour

📝 Notes

    All dates in ISO 8601 format: YYYY-MM-DDTHH:MM:SSZ

    File URLs are relative to the web server root

    Sticker IDs are 0-based indexes corresponding to static files

    Infinite scroll uses cursor-based pagination (not page numbers)

    Error responses always include success: false and error details

    Session timeout: 30 minutes of inactivity
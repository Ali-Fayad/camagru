# API Testing Examples

Quick reference for testing Camagru API endpoints using curl.

## Prerequisites

Start the application:
```bash
docker-compose up
```

## Authentication Flow

### 1. Register New User

```bash
curl -X POST http://localhost:8080/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Registration successful! Check your email for verification code.",
  "data": {
    "userId": 1
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### 2. Verify Email

```bash
curl -X POST http://localhost:8080/api/verify \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "code": "123456"
  }'
```

### 3. Login

```bash
curl -X POST http://localhost:8080/api/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

**Save cookies for authenticated requests!**

## User Profile

### Get Profile

```bash
curl http://localhost:8080/api/user/profile \
  -H "Content-Type: application/json" \
  -b cookies.txt
```

### Update Profile

```bash
curl -X PUT http://localhost:8080/api/user/profile \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "username": "john_updated"
  }'
```

### Change Password

```bash
curl -X PUT http://localhost:8080/api/user/password \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "oldPassword": "SecurePass123",
    "newPassword": "NewPass456"
  }'
```

### Toggle Notifications

```bash
curl -X PUT http://localhost:8080/api/user/notifications \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "receiveNotifications": false
  }'
```

## Images

### Upload Image with Sticker

```bash
# First, encode an image to base64
IMAGE_BASE64=$(base64 -w 0 sample.jpg)

curl -X POST http://localhost:8080/api/images/upload \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d "{
    \"imageData\": \"data:image/jpeg;base64,$IMAGE_BASE64\",
    \"stickerIndex\": 0,
    \"useWebcam\": false
  }"
```

### Get Image Details

```bash
curl http://localhost:8080/api/images/1 \
  -H "Content-Type: application/json" \
  -b cookies.txt
```

### Delete Image

```bash
curl -X DELETE http://localhost:8080/api/images/1 \
  -H "Content-Type: application/json" \
  -b cookies.txt
```

## Gallery

### Get Gallery Images (First Page)

```bash
curl "http://localhost:8080/api/gallery?limit=5" \
  -H "Content-Type: application/json"
```

**Response includes images with metadata:**
```json
{
  "success": true,
  "message": "Gallery loaded",
  "data": [
    {
      "id": 1,
      "userId": 1,
      "username": "johndoe",
      "imageUrl": "/uploads/abc123.jpg",
      "stickerIndex": 0,
      "likeCount": 5,
      "commentCount": 3,
      "likedByCurrentUser": false,
      "createdAt": "2024-01-15T10:30:00.000"
    }
  ]
}
```

### Get Gallery Images (Next Page)

Use the `createdAt` timestamp from the last image as cursor:

```bash
curl "http://localhost:8080/api/gallery?cursor=2024-01-15T10:30:00.000&limit=5" \
  -H "Content-Type: application/json"
```

### Get Comments for Image

```bash
curl http://localhost:8080/api/gallery/1/comments \
  -H "Content-Type: application/json"
```

### Like/Unlike Image

```bash
curl -X POST http://localhost:8080/api/gallery/1/like \
  -H "Content-Type: application/json" \
  -b cookies.txt
```

**Response:**
```json
{
  "success": true,
  "message": "Image liked",
  "data": {
    "liked": true,
    "likeCount": 6
  }
}
```

### Post Comment

```bash
curl -X POST http://localhost:8080/api/gallery/1/comments \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "content": "Great photo!"
  }'
```

## Password Reset

### Request Password Reset

```bash
curl -X POST http://localhost:8080/api/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com"
  }'
```

### Reset Password with Token

```bash
curl -X POST http://localhost:8080/api/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "abc123...",
    "newPassword": "NewSecurePass789"
  }'
```

## Logout

```bash
curl -X POST http://localhost:8080/api/logout \
  -H "Content-Type: application/json" \
  -b cookies.txt
```

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

Common error codes:
- `VALIDATION_ERROR` - Invalid input
- `AUTH_REQUIRED` - Authentication needed
- `INVALID_CREDENTIALS` - Wrong email/password
- `EMAIL_EXISTS` - Email already registered
- `USERNAME_EXISTS` - Username already taken
- `NOT_FOUND` - Resource not found
- `FORBIDDEN` - Unauthorized action
- `SERVER_ERROR` - Internal error

## Testing with Postman

Import these examples into Postman:
1. Create new collection "Camagru API"
2. Add environment with `baseUrl = http://localhost:8080`
3. Copy these curl commands and convert to Postman requests
4. Use Postman cookie jar for session management

## Database Direct Testing

Check data directly:
```bash
docker exec -it camagru-db psql -U camagru -d camagru
```

```sql
-- View users
SELECT id, username, email, is_verified FROM users;

-- View images
SELECT id, user_id, stored_filename, sticker_index FROM images;

-- View comments
SELECT c.id, u.username, c.content 
FROM comments c 
JOIN users u ON c.user_id = u.id;

-- View likes count
SELECT image_id, COUNT(*) as likes 
FROM likes 
GROUP BY image_id;
```

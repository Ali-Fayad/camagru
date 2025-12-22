# Camagru - Photo Editing Web Application

A pure Java web application for photo editing with sticker overlays, built without frameworks using Servlet API, JDBC, and Java2D.

## 🎯 Features

- **User Management**: Registration with email verification (6-digit code), login, password reset
- **Image Upload**: Upload images or capture from webcam
- **Sticker Overlay**: Superimpose predefined stickers on images using Java2D
- **Gallery**: Browse all edited images with infinite scroll pagination
- **Social Features**: Like and comment on images, with email notifications
- **Database Sessions**: PostgreSQL-backed session storage
- **RESTful JSON API**: All endpoints return JSON responses

## 🔧 Technology Stack

- **Java 11** (SE only, no frameworks)
- **Servlet 4.0 API** (Jakarta EE)
- **PostgreSQL 13+** with JDBC
- **JavaMail API** for email (SMTP)
- **Java2D** for image processing (equivalent to PHP GD)
- **BCrypt** for password hashing
- **Maven** for build management
- **Docker & Docker Compose** for deployment

## 📁 Project Structure

```
src/main/java/com/camagru/
├── config/              # Database, Email, App configuration
├── controllers/         # REST API servlets
├── services/            # Business logic layer
├── repositories/        # DAO pattern with JDBC
├── models/              # Entity POJOs
├── dtos/                # Request/Response DTOs
├── utils/               # Utilities (validation, JSON, image processing)
└── filters/             # CORS and JSON filters
```

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Java 11+ (for local development)
- Maven 3.8+ (for local development)

### Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   cd /home/afayad/java-web-app
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your SMTP credentials
   ```

3. **Build and run**
   ```bash
   docker-compose up --build
   ```

4. **Access the application**
   - Application: http://localhost:8080
   - Database: localhost:5432

### Local Development

1. **Set up PostgreSQL database**
   ```bash
   psql -U postgres
   CREATE DATABASE camagru;
   CREATE USER camagru WITH PASSWORD 'camagrupwd';
   GRANT ALL PRIVILEGES ON DATABASE camagru TO camagru;
   \q
   
   psql -U camagru -d camagru -f sql/schema.sql
   ```

2. **Set environment variables**
   ```bash
   export DB_URL=jdbc:postgresql://localhost:5432/camagru
   export DB_USER=camagru
   export DB_PASSWORD=camagrupwd
   export SMTP_HOST=smtp.gmail.com
   export SMTP_USER=your-email@gmail.com
   export SMTP_PASSWORD=your-app-password
   ```

3. **Build and run**
   ```bash
   mvn clean package
   # Deploy target/camagru.war to Tomcat or use embedded server
   ```

## 📡 API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/verify` - Verify email with 6-digit code
- `POST /api/login` - Login
- `POST /api/logout` - Logout
- `POST /api/forgot-password` - Request password reset
- `POST /api/reset-password` - Reset password with token

### User Profile
- `GET /api/user/profile` - Get current user profile
- `PUT /api/user/profile` - Update username/email
- `PUT /api/user/password` - Change password
- `PUT /api/user/notifications` - Toggle email notifications

### Images
- `POST /api/images/upload` - Upload image with sticker
- `GET /api/images/{id}` - Get image details
- `DELETE /api/images/{id}` - Delete own image

### Gallery
- `GET /api/gallery?cursor={timestamp}&limit=5` - Get gallery images (infinite scroll)
- `GET /api/gallery/{id}/comments` - Get comments for image
- `POST /api/gallery/{id}/like` - Toggle like on image
- `POST /api/gallery/{id}/comments` - Post comment (sends notification)

## 🎨 Adding Stickers

Place PNG images with alpha channel in `src/main/webapp/stickers/`:

```
stickers/
├── 0_cat_ears.png
├── 0_cat_ears_thumb.png
├── 1_glasses.png
├── 1_glasses_thumb.png
└── ...
```

Naming convention: `{index}_{name}.png`

## 🔒 Security Features

- ✅ BCrypt password hashing (PHP `password_hash()` equivalent)
- ✅ Prepared statements for SQL injection prevention
- ✅ HTML escaping for XSS protection
- ✅ File upload validation (type, size)
- ✅ Session fixation protection
- ✅ Database-backed sessions
- ✅ HTTP-only cookies

## 📧 Email Configuration

For Gmail, create an App Password:
1. Go to Google Account settings
2. Security → 2-Step Verification → App passwords
3. Generate password for "Mail"
4. Use in `SMTP_PASSWORD` environment variable

## 🧪 Testing

```bash
# Test registration
curl -X POST http://localhost:8080/api/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"Test1234"}'

# Test login
curl -X POST http://localhost:8080/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234"}'

# Test gallery
curl http://localhost:8080/api/gallery?limit=5
```

## 📝 PHP Equivalence

| Java | PHP Equivalent |
|------|----------------|
| BCrypt.hashpw() | password_hash() |
| BCrypt.checkpw() | password_verify() |
| PreparedStatement | PDO::prepare() |
| Java2D (BufferedImage) | GD library |
| JavaMail | mail() or PHPMailer |
| Files.write() | file_put_contents() |
| ResultSet | PDO fetch |

## 🐛 Troubleshooting

**Database connection failed**
- Ensure PostgreSQL is running
- Check `DB_URL`, `DB_USER`, `DB_PASSWORD` environment variables

**Email not sending**
- Verify SMTP credentials
- For Gmail, use App Password, not regular password
- Check firewall allows port 587

**Images not processing**
- Ensure stickers exist in `/stickers/` directory
- Check file permissions on `/uploads/` directory

## 📄 License

This project is part of the 42 curriculum.

## 👥 Author

Created as a pure Java implementation following the Camagru project specifications.

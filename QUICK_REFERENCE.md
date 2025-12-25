# Quick Reference - Camagru MVC Update

## Application URLs
- **Frontend**: http://localhost:8080/
- **API Base**: http://localhost:8080/api

## New API Endpoints

### GET /api/user/stats
Get user statistics (requires authentication)
```bash
curl http://localhost:8080/api/user/stats \
  -H "Cookie: CAMAGRU_SESSION=your-session-id"
```
Response:
```json
{
  "success": true,
  "data": {
    "imageCount": 12,
    "totalLikesReceived": 450,
    "totalCommentsReceived": 89
  }
}
```

### GET /api/stickers
List all available stickers (public)
```bash
curl http://localhost:8080/api/stickers
```
Response:
```json
{
  "success": true,
  "data": [
    {
      "id": 0,
      "name": "Cat Ears",
      "url": "/stickers/0_cat_ears.png",
      "thumbnailUrl": "/stickers/0_cat_ears_thumb.png"
    }
  ]
}
```
Note: Currently returns empty array due to path issue.

### DELETE /api/user
Delete user account (requires authentication)
```bash
curl -X DELETE http://localhost:8080/api/user \
  -H "Cookie: CAMAGRU_SESSION=your-session-id"
```

### PUT /api/user/notifications
Toggle email notifications (requires authentication)
```bash
curl -X PUT http://localhost:8080/api/user/notifications \
  -H "Cookie: CAMAGRU_SESSION=your-session-id" \
  -H "Content-Type: application/json" \
  -d '{"receiveNotifications": true}'
```

## Frontend Features

### Profile Page
- Real user statistics from `/api/user/stats`
- Shows imageCount, totalLikesReceived, totalCommentsReceived
- No more mock data

### Settings Page - Account Tab
- Update username
- Update email
- Real data from localStorage/API

### Settings Page - Security Tab
1. **Change Password**
   - Current password validation
   - New password requirements check

2. **Email Notifications** (NEW)
   - Toggle switch for comment notifications
   - Calls `/api/user/notifications` endpoint

3. **Delete Account** (NEW)
   - Red danger zone
   - Requires typing "DELETE" to confirm
   - Permanently deletes all user data

### Logout
- Click logout icon in sidebar
- Immediate logout without confirmation
- Clears auth data and redirects to login

## Docker Commands

### Rebuild & Deploy
```bash
# Full rebuild
cd /home/afayad/java-web-app
mvn clean package -DskipTests
docker compose build app
docker compose up -d app

# Check status
docker compose ps

# View logs
docker logs camagru-app --tail 50
```

### Database Migration
```bash
# Run notifications migration
docker exec -i camagru-db psql -U camagru -d camagru < sql/migrate_notifications.sql

# Backup database
docker exec camagru-db pg_dump -U camagru camagru > backup.sql

# Access database console
docker exec -it camagru-db psql -U camagru -d camagru
```

## Development Workflow

### Make Backend Changes
1. Edit Java files in `src/main/java/`
2. `mvn clean package`
3. `docker compose build app`
4. `docker compose up -d app`

### Make Frontend Changes
1. Edit JS files in `src/main/webapp/js/`
2. `mvn package` (copies to target)
3. `docker compose build app`
4. `docker compose up -d app`
5. **Important**: Hard refresh browser (Ctrl+Shift+R)

### View Changes
- Frontend: http://localhost:8080/
- Clear browser cache: Ctrl+Shift+R (hard refresh)
- Check console for API logs: `[API] GET /api/user/stats -> 200`

## Troubleshooting

### Build Fails
```bash
# Check Java syntax
mvn compile

# Check dependencies
mvn dependency:tree
```

### Container Not Starting
```bash
# Check logs
docker logs camagru-app

# Check if port is in use
lsof -i :8080
```

### Database Issues
```bash
# Check connection
docker exec camagru-db pg_isready -U camagru

# View tables
docker exec camagru-db psql -U camagru -d camagru -c "\dt"
```

### Frontend Not Updating
1. Hard refresh: Ctrl+Shift+R
2. Clear browser cache
3. Check browser console for errors
4. Verify files copied to target: `ls target/camagru/js/`

## Testing Checklist

- [ ] Login/Register/Verify flow works
- [ ] Logout button immediately logs out
- [ ] Profile shows real stats (after uploading images)
- [ ] Settings Account tab updates username/email
- [ ] Settings Security tab changes password
- [ ] Settings Notifications toggle works
- [ ] Settings Delete Account requires confirmation
- [ ] Gallery shows real posts
- [ ] Upload page loads (stickers may be empty)

## File Locations

### Backend
- Controllers: `src/main/java/com/camagru/controllers/`
- Services: `src/main/java/com/camagru/services/`
- Repositories: `src/main/java/com/camagru/repositories/`

### Frontend
- Services: `src/main/webapp/js/services/`
- Pages: `src/main/webapp/js/pages/`
- Components: `src/main/webapp/js/components/`

### Deployed
- WAR file: `target/camagru.war`
- Container: `/usr/local/tomcat/webapps/ROOT/`

## Quick Fixes

### Stickers Not Loading
The path resolution needs fixing. Temporary solution:
```java
// In StickerUtil.java line ~15
public static String getStickerDirectory() {
    return "/usr/local/tomcat/webapps/ROOT/stickers";
}
```

### Stats Not Showing
User needs to:
1. Be logged in
2. Have uploaded images
3. Have received likes/comments

### Session Expired
Clear cookies and re-login:
```javascript
// In browser console
localStorage.clear();
location.reload();
```

---

**Last Updated**: 2025-12-25
**Build Status**: ✅ Success
**Container**: ✅ Running
**Database**: ✅ Healthy with notifications column

# Pending Tasks - Camagru MVC

## Recent Completions

### ✅ Post Detail Page Implementation
**Status**: COMPLETED  
**Implementation**:
- Backend: `PostController.java`, `LikeController.java`, `CommentController.java`
- Service: `NotificationService.java` (console logging - see SMTP task below)
- Frontend: `PostPage.js` with full UI, likes, comments
- Routing: Dynamic route support (`/post/:id`)
- Features: Like/unlike, add comments, view post details, authentication checks
- Deployed: Successfully built and running

**Known Limitation**: Email notifications currently log to console (SMTP implementation pending below)

## High Priority

### 1. SMTP Email Implementation
**Issue**: NotificationService only logs to console  
**Location**: `NotificationService.java` sendEmail() method  
**Current State**: Console output instead of actual email sending  
**Required**:
- Add JavaMail dependency to pom.xml (jakarta.mail 2.0.1)
- Add SMTP config to AppConfig or environment variables
- Implement actual email sending with javax.mail API
- Test with real SMTP server (Gmail, SendGrid, etc.)

### 2. Sticker Path Resolution
**Issue**: `/api/stickers` endpoint returns empty array  
**Location**: `StickerUtil.java` line ~20-35  
**Problem**: Path resolution logic not finding sticker files in `/usr/local/tomcat/webapps/ROOT/stickers/`  
**Files Exist**: Verified 5 stickers (0-4) with thumbnails  
**Solution**: Fix `getStickerDirectory()` to correctly resolve deployed webapp path

### 3. User's Own Posts on Profile
**Issue**: Profile page doesn't show user's uploaded images  
**Location**: `ProfilePage.js` afterRender() method  
**Current State**: `this.posts = [];` - hardcoded empty array  
**Required**:
- Add backend endpoint: `GET /api/user/images` or `GET /api/images/user/{userId}`
- Frontend: Fetch and display user's images with delete buttons
- Show empty state if no posts

### 3. Infinite Scroll for Gallery
**Issue**: Gallery loads all images at once, no pagination  
**Location**: `GalleryPage.js`  
**Required**:
- Implement cursor-based pagination on backend (already has `cursor` parameter)
- Frontend: Detect scroll position, load more when near bottom
- Show loading indicator during fetch
- Handle end of results gracefully

## Medium Priority

### 4. Comment Email Notifications
**Issue**: Backend doesn't send emails when comments are posted  
**Location**: `CommentService.java` or create `CommentController`  
**Required**:
- Check `notifications_enabled` flag when creating comment
- Get image owner's email and preference
- Send email via `EmailService` if enabled
- Template: "User X commented on your post: [comment text]"

### 5. Real-time Camera Permissions Check
**Issue**: Upload page doesn't check camera permissions before showing UI  
**Location**: `UploadPage.js` setupWebcam() method  
**Required**:
- Check `navigator.mediaDevices.getUserMedia` availability
- Show permission request UI if needed
- Handle permission denied gracefully
- Display helpful error messages

### 6. Individual Post View Page
**Issue**: No dedicated page to view single post with all comments  
**Required**:
- Create `PostPage.js` (route: `#/post/:id`)
- Backend: Already has `GET /api/images/:id`
- Show image, caption, user info, all comments
- Allow commenting directly from post page
- Add to router in `main.js`

## Low Priority

### 7. Post Editing/Deletion UI
**Issue**: Users can't delete their own posts from gallery view  
**Current State**: Delete endpoint exists (`DELETE /api/images/:id`)  
**Required**:
- Add delete button to image cards (only for owner)
- Confirmation modal before delete
- Refresh gallery after successful deletion

### 8. Username Already Exists - Better Error Display
**Issue**: Backend returns "Username already exists" error correctly  
**Location**: `UserService.java` line 35  
**Frontend**: `SettingsPage.js` - error displays in message div  
**Enhancement**: Could add real-time username availability check (debounced)

### 9. Password Strength Indicator
**Issue**: Users don't see password requirements until error  
**Location**: `SettingsPage.js` Security tab  
**Enhancement**: 
- Add visual password strength meter
- Show requirements checklist (✓/✗) in real-time
- Green/yellow/red indicator

### 10. Image Preview with Sticker Overlay
**Issue**: Upload page shows image and sticker separately, no preview of merged result  
**Location**: `UploadPage.js`  
**Enhancement**:
- Overlay selected sticker on preview image using canvas
- Allow drag/resize of sticker position
- Show final result before publish

## Completed ✅

- ✅ Email read-only in Settings (cannot be modified)
- ✅ Username validation (backend checks duplicates)
- ✅ Post publishing (real API integration, saves to database)
- ✅ Stats endpoint (`/api/user/stats`)
- ✅ Stickers endpoint (`/api/stickers`) - created but empty due to path issue
- ✅ Delete account endpoint with cascade
- ✅ Notifications toggle in settings
- ✅ Database migration for `notifications_enabled` column
- ✅ Logout button immediate action
- ✅ MVC compliance for all controllers/services

## Known Bugs

### 1. Stickers Selector Shows "4 available"
**Location**: `UploadPage.js` line ~94  
**Issue**: Hardcoded count should be dynamic from API  
**Fix**: `const count = await this.stickerService.getStickers(); span.textContent = count.length`

### 2. Upload Form Not Clearing After Success
**Location**: `UploadPage.js` setupPublish()  
**Issue**: After successful upload, image preview stays, caption not cleared  
**Fix**: Add cleanup: reset form, clear preview, stop camera

## Testing Checklist

After fixes, verify:
- [ ] Settings: Email is grayed out, username updates work, duplicate username shows error
- [ ] Upload: Webcam capture works, file upload works, sticker selection works, caption saves
- [ ] Gallery: New posts appear immediately after upload
- [ ] Profile: Stats update after new post (imageCount increments)
- [ ] Gallery: Posts show with correct caption and sticker overlay
- [ ] Profile: User's own posts section shows their uploads
- [ ] Database: Check `images` table has new rows with correct data

## Database Schema Notes

### Current Schema
```sql
images (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  original_filename VARCHAR(255),
  stored_filename VARCHAR(255) UNIQUE,
  caption TEXT,
  sticker_index INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

All required columns exist. No schema changes needed for current features.

---

**Last Updated**: 2025-12-25  
**Priority**: Focus on #1 (sticker path) and #2 (user posts) first  
**Status**: Post publishing now works! Email readonly, username validation working.

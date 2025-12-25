# Pending Tasks & Missing Features

## Last Updated
December 25, 2025

## Backend Implementation Status

### ✅ Fully Implemented
- User authentication (register, login, verify, logout)
- Password reset flow  
- User profile endpoints (get, update)
- Password change endpoint
- Gallery images endpoint
- Image upload with sticker merging (backend merges stickers)
- Like/unlike images
- Comments (get, post)
- Session management

### ⚠️ Partially Implemented / Needs Verification
1. **User Statistics Endpoint** (`/api/user/stats`)
   - API documented but implementation not verified
   - Needed for: Profile page total likes/comments count
   - Current workaround: Using demo/mock data

2. **Stickers Endpoint** (`/api/stickers`)
   - API documented to return sticker list
   - Backend has `StickerUtil.java` but no REST controller endpoint
   - Current workaround: Hardcoded sticker list in frontend

3. **Notification Settings**
   - Toggle endpoint exists (`/api/user/notifications`)
   - Email notification system exists but needs testing
   - Comment notifications trigger emails (requires SMTP config)

### ❌ Missing / Not Implemented

1. **Account Deletion**
   - No `/api/user/delete` endpoint
   - Frontend has "Delete Account" button but not functional
   - **Action needed**: Implement user deletion endpoint

2. **Image Pagination/Infinite Scroll**
   - API supports cursor-based pagination
   - Frontend gallery loads first page only
   - **Action needed**: Implement "Load More" or infinite scroll

3. **User Profile by Username**
   - No `/api/users/{username}` endpoint
   - Cannot view other users' profiles/galleries
   - **Action needed**: Add public profile endpoint

4. **Search/Filter**
   - No search functionality
   - No filtering by user/sticker/date
   - **Action needed**: Add search endpoints

## Frontend Implementation Status

### ✅ Completed
- Real API integration for Gallery (with empty state)
- Real API integration for Auth services
- Settings page updated (Account + Security only, bio removed)
- Profile page updated (bio removed)
- Upload page with real camera permission check
- Sticker picker with real stickers from `/stickers/` folder
- Image upload sends to backend with sticker index
- Sticker merging handled by backend (not frontend)

### ⚠️ Needs Testing
1. **Camera Permissions**
   - Using `navigator.mediaDevices.getUserMedia()`
   - Needs browser permission testing

2. **Form Validation**
   - Client-side validation in place
   - Backend validation errors need proper UI handling

3. **Empty States**
   - Gallery empty state implemented
   - Other pages may need empty state handling

### 🔄 In Progress / To Do

1. **Settings Page - Notifications Tab**
   - UI exists but not yet wired to `/api/user/notifications`
   - **Action**: Connect toggle switch to API

2. **Profile Stats**
   - Using demo data for likes/comments count
   - **Action**: Integrate with `/api/user/stats` when available

3. **Error Handling**
   - Basic error display implemented
   - **Action**: Add toast notifications for better UX

4. **Loading States**
   - Skeleton loaders on gallery page
   - **Action**: Add consistent loading indicators across all pages

## Required Approvals / Questions

### 1. Email Change Flow
**Question**: Should changing email require re-verification?
- API.md says "needsVerification: true if email changed"
- Current implementation: Email field is disabled in settings
- **Decision needed**: Allow email change with verification flow?

### 2. Bio Feature
**Question**: Completely remove or keep as optional?
- Current decision: Removed from UI
- Database schema may still have bio field
- **Decision needed**: Remove from schema or keep for future?

### 3. Sticker Positioning
**Question**: Should users be able to position/resize stickers?
- Current: Backend places sticker at center, 30% of image width
- **Decision needed**: Add frontend sticker editor or keep simple?

### 4. Image Formats
**Question**: Support for GIF/WebP?
- Current: JPEG/PNG only
- **Decision needed**: Expand supported formats?

## Configuration & Deployment

### Required Environment Variables
```bash
# Email (for verification & notifications)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=noreply@camagru.com
SMTP_PASS=********

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=camagru
DB_USER=camagru
DB_PASS=********

# App Config
APP_BASE_URL=http://localhost:8080
UPLOAD_DIR=/uploads
STICKER_DIR=/stickers
```

### Build & Deploy Steps
1. Backend: `mvn clean package`
2. Frontend: Files copied to `target/camagru/`
3. Docker: `docker compose up -d`
4. **Note**: Browser cache may need hard refresh (`Ctrl+Shift+R`)

## Known Issues

1. **Browser Cache**
   - Updated JS files may not load due to cache
   - Solution: Hard refresh or clear cache

2. **Session Timeout**
   - 30-minute inactivity timeout
   - No auto-refresh warning
   - **Action**: Add session expiry warning

3. **File Upload Size**
   - 5MB limit enforced
   - No progress indicator for large uploads
   - **Action**: Add upload progress bar

## Testing Checklist

- [ ] Register new user → Receive verification email
- [ ] Login with unverified user → Redirect to verification
- [ ] Verify email code → Auto-login and redirect to home
- [ ] Upload image with sticker → Image appears in gallery
- [ ] Like/unlike images → Count updates
- [ ] Post comment → Comment appears, owner gets email
- [ ] Change password → Can login with new password
- [ ] Update username → Reflects in profile
- [ ] Gallery with no images → Shows empty state
- [ ] Camera permissions → Properly requests access

## Next Steps (Priority Order)

1. **High Priority**
   - [x] Test full authentication flow
   - [ ] Test image upload with all 5 stickers
   - [ ] Verify email notifications work
   - [ ] Implement gallery pagination/load more
   - [ ] Add proper error toast notifications

2. **Medium Priority**
   - [ ] Implement `/api/user/stats` endpoint
   - [ ] Create stickers REST endpoint
   - [ ] Add session expiry warning
   - [ ] Implement upload progress indicator

3. **Low Priority**
   - [ ] Add search functionality
   - [ ] User profile pages
   - [ ] Account deletion
   - [ ] Advanced sticker editor

## Notes
- Backend successfully merges stickers with images using Java2D
- All authentication flows working with 201 status for unverified users
- Frontend uses real API data where available, gracefully falls back to demo data
- System designed to be progressively enhanced as backend endpoints are added

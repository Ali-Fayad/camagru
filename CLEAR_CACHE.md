# Browser Cache Issue - Clear Cache Instructions

The frontend code has been updated but your browser is using old cached JavaScript files.

## Quick Fix - Hard Refresh

### Chrome/Edge/Brave (Linux):
```
Ctrl + Shift + R
```
or
```
Ctrl + F5
```

### Firefox (Linux):
```
Ctrl + Shift + R
```
or
```
Ctrl + F5
```

## Complete Fix - Clear All Cache

### Chrome/Edge/Brave:
1. Press `Ctrl + Shift + Delete`
2. Select "Cached images and files"
3. Click "Clear data"
4. Refresh the page

### Firefox:
1. Press `Ctrl + Shift + Delete`
2. Select "Cache"
3. Click "Clear Now"
4. Refresh the page

## Verify It's Working

After clearing cache, open browser console (F12) and check:
1. When you login with unverified user, you should see:
   ```
   [API] POST /api/login -> 201
   ```
2. The page should automatically redirect to `#/verify`

## Alternative - Open in Incognito/Private Window
- Chrome/Brave: `Ctrl + Shift + N`
- Firefox: `Ctrl + Shift + P`

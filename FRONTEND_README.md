# Camagru Frontend

A vanilla JavaScript Single Page Application (SPA) for the Camagru photo editing platform.

## Setup & Running

1. **Backend Requirement**: Ensure the Java backend is running on `http://localhost:8080`.
2. **Serve Frontend**: The frontend is served by the backend WAR file from `src/main/webapp`.
   - If running via Maven/Tomcat, access `http://localhost:8080/`.
   - The `index.html` is the entry point.

## Architecture

- **No Frameworks**: Pure ES6+ JavaScript.
- **Styling**: Tailwind CSS (via CDN).
- **Routing**: Hash-based routing (`#/`, `#/login`, etc.).
- **State Management**: `Storage.js` handles local/session storage and auth state.
- **Services**: All API calls are encapsulated in `js/services/`.
- **Components**: Reusable UI parts in `js/components/`.
- **Pages**: View logic in `js/pages/`.

## Browser Compatibility

- Designed for modern browsers (Chrome, Firefox, Safari, Edge).
- Uses ES6 features (Classes, Promises, Fetch, Arrow Functions).
- **Note**: Firefox 41 support requires polyfills or transpilation for `class` syntax (native support started in FF 45). This implementation uses `class` syntax per ES6 standards.

## Development

- **File Structure**:
  - `js/main.js`: Entry point, initializes app.
  - `js/router.js`: Handles navigation.
  - `js/services/`: API integration.
  - `js/pages/`: Page views.

- **Adding a Page**:
  1. Create `js/pages/NewPage.js`.
  2. Add script tag in `index.html`.
  3. Register route in `js/main.js`.

## Security

- **CSRF**: Tokens are handled in `ApiService.js`.
- **XSS**: Content is escaped using `Validators.escapeHtml`.
- **Auth**: Session-based authentication (HTTP-only cookies).

## Mobile Responsiveness

- Uses Tailwind's responsive prefixes (`md:`, `lg:`).
- Sidebar becomes a bottom navigation bar on mobile devices.

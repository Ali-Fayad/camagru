# Camagru SPA Frontend

Single Page Application built with vanilla TypeScript/JavaScript and Tailwind (CDN) that lives inside the PHP backend's `public/` directory.

## Structure

```
public/
├── index.html          # SPA shell loaded by the browser
├── js/                 # Transpiled ES modules consumed by the SPA
│   ├── api.js
│   ├── app.js
│   ├── auth.js
│   ├── constants.js
│   ├── router.js
│   ├── ui.js
│   └── pages/
│       ├── gallery.js
│       ├── home.js
│       ├── login.js
│       ├── post.js
│       ├── settings.js
│       └── signup.js
└── ts/                 # Authoring sources (mirrors js/ structure)
    ├── api.ts
    ├── app.ts
    ├── auth.ts
    ├── constants.ts
    ├── router.ts
    ├── ui.ts
    └── pages/
        ├── gallery.ts
        ├── home.ts
        ├── login.ts
        ├── post.ts
        ├── settings.ts
        └── signup.ts
```

`index.php` remains untouched and keeps handling API calls through `routes/api.php`.

## Running the SPA

1. Serve the `Server/public/` directory as usual (e.g., `php -S localhost:8000 -t Server/public`).
2. Visit `/index.html` for the SPA UI.
3. API calls automatically target `/index.php/<endpoint>` as expected by the PHP router.

## TypeScript Workflow (optional)

The transpiled JavaScript files in `js/` are ready to use. If you want to edit the TypeScript sources:

```powershell
cd Server/public
npx tsc
```

This recompiles everything according to `tsconfig.json`. Any other TypeScript compiler (global `tsc`, VS Code build task, etc.) works as long as it respects the same `rootDir`/`outDir`.

## Notes

- Session data relies on `sessionStorage` keys defined in `constants.ts`/`constants.js`.
- All network calls are centralized in `api.ts`/`api.js`. If the backend changes endpoints or payloads, update the constants once and the rest of the UI will follow.
- Authentication guards live in the router; unauthenticated users are redirected to the login page whenever they attempt to open a protected route.
- Buttons for likes, comments, stickers, and destructive actions are wired to API placeholders, but backend responses/errors are surfaced through toast notifications so server-side work can proceed independently.

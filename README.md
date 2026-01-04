# Camagru

A small image-editing / social web application (SPA frontend + PHP backend).  
Frontend: vanilla JavaScript + HTML + Tailwind.  
Backend: vanilla PHP (no framework) + MariaDB.  
This project was built as part of the 42 Advanced Web & Mobile curriculum (optional note included in Credits).

Repository: https://github.com/Ali-Fayad/camagru

> I inspected key repository files (docker-compose.yml, docker/web/Dockerfile, .env, Makefile, Server/public/index.html, Server/public/index.php, Server/config/database.php, Server/routes/api.php, and several controllers). The repository search results used may be incomplete — view the full repo in GitHub for everything.

---

## Quick facts

- Languages (approximate composition):
  - HTML ~44% • JavaScript ~33% • PHP ~22% • Other ~1%
- Main features:
  - User signup/login (email verification)
  - Create posts (image + stickers)
  - Like and comment on posts
  - SPA served from Server/public, PHP API routes under Server/routes

---

## Visual concepts — architecture & flows

High-level architecture
```
[Browser SPA]
    |
    | -- (HTTP requests / fetch) --> [Apache + PHP container]
                                      - DocumentRoot: /var/www/html/public
                                      - index.php (Front controller) -> Router
                                          -> Controller(s) -> Model(s) -> Database (MariaDB)
    |
    `-- static assets (index.html, js/*.js, css)
```

Docker view
```
[Host]
  ├─ docker-compose.yml
  │
  ├─ camagru_web  (container)
  │    ├─ Apache + PHP 8.1
  │    └─ Serves /var/www/html/public (SPA) & API (index.php -> Router)
  │
  └─ camagru_db   (MariaDB)
       └─ data volume: camagru_db_data
```

Request sequence (signup -> verify -> login)
```
1. Browser (SPA) --POST /api/user/signup--> Apache/PHP index.php
2. index.php -> Router -> UserController::signup
3. UserController -> User model inserts user (verification_code stored)
4. MailerController sends/verifies code (or logs it)
5. Browser --POST /api/mailer/verify--> Router -> MailerController::verifyEmail
6. Browser --POST /api/user/login--> Router -> UserController::login
```

Frontend layout (SPA structure - simplified wireframe)
```
+----------------------------------------------------+
| Header: [Logo]                      [Login | Logout]|
+----------------------------------------------------+
|                            |                       |
| Sidebar (right)            |       Main content     |
| - Home                     |  - Feed / Editor /     |
| - Gallery                  |    Gallery / Settings  |
| - New post                 |                       |
| - Settings                 |                       |
+----------------------------------------------------+
| Footer / Toast notifications                       |
+----------------------------------------------------+
```

---

## Basic project structure (important folders & files)
```
/ (repo root)
├─ .env
├─ docker-compose.yml
├─ docker/
│  └─ web/Dockerfile
├─ Makefile
├─ Server/
│  ├─ public/
│  │  ├─ index.html      ← SPA entry point
│  │  ├─ index.php       ← API front controller
│  │  └─ js/             ← client JS code (app.js, modules)
│  ├─ Controller/        ← Controllers (UserController, PostController, ...)
│  ├─ models/            ← Models (User, Post, ...)
│  ├─ routes/
│  │  └─ api.php         ← Router mapping URIs -> controllers
│  └─ config/
│     ├─ database.php    ← DB wrapper (mysqli)
│     └─ init_db.php     ← DB init script used by Makefile
└─ Stitch/               ← (assets for sticker composition)
```

---

## API (main endpoints)
(Calls are routed by Server/routes/api.php — the SPA uses these.)

- POST /api/user/signup       — create a user (JSON: email, username, password)
- POST /api/user/login        — login (JSON: username, password)
- POST /api/user/update       — update user (JSON including userId)
- POST /api/user/delete       — delete user
- POST /api/mailer            — send verification or code
- POST /api/mailer/verify     — verify an email with a code
- GET  /api/posts/get         — get latest posts
- POST /api/posts/add         — add a post (image + stickers meta)
- GET  /api/posts/stickers    — list available stickers
- POST /api/like              — like a post
- POST /api/comment           — create a comment

Examples:
- curl -X POST http://localhost:8081/api/user/signup -H "Content-Type: application/json" -d '{"email":"you@example.com","username":"you","password":"secret"}'
- curl http://localhost:8081/api/posts/get

Adjust port/host to how you run the app (Docker maps host:8081 -> container:80 in the included compose).

---

## Run locally (Docker recommended)

1. Copy / edit `.env` at repo root and set secure credentials:
   - DB_USER, DB_PASSWORD, DB_NAME, MYSQL_ROOT_PASSWORD, etc.

2. Start containers (from repo root):
   - docker-compose up --build

3. Visit:
   - http://localhost:8081

4. Initialize DB (if needed):
   - make init_db
   - or inside container: php Server/config/init_db.php

Tip: The docker/web/Dockerfile sets APACHE_DOCUMENT_ROOT to /var/www/html/public and copies Server/ into the image.

---

## Run without Docker (quick)
1. Ensure PHP & MariaDB are available locally.
2. Configure .env.
3. Create DB / run Server/config/init_db.php.
4. Run PHP built-in server (from repo root):
   - make run
   - or: php -S 127.0.0.1:8000 -t Server/public

---

## Visual checklist for contributors (how code is organized)
- Frontend: modify files in Server/public (index.html, js/)
- Backend routes: Server/routes/api.php (add new endpoints)
- Controllers: Server/Controller/* (business logic)
- Models: Server/models/* (DB access)
- DB config: Server/config/database.php and .env
- Docker adjustments: docker/web/Dockerfile and docker-compose.yml

---

## Security & production reminders (visual checklist)
- [ ] Change example passwords in .env
- [ ] Use prepared statements or parameterized queries
- [ ] Limit CORS origins (index.php currently uses *)
- [ ] Configure HTTPS and mail provider for real verification emails
- [ ] Protect uploads (type checking, size restrictions, storage permissions)

---

## Credits & notes

- Author: Ali-Fayad — repo: https://github.com/Ali-Fayad/camagru  
- Project context: built as part of the 42 Advanced "Web & Mobile" curriculum. It is appropriate to mention that in the README's Credits/Project info section if you want to highlight the educational origin.

---

If you want, I can:
- add an SVG or PNG architecture image you can include in the README,
- produce a shorter "quickstart" README for the repo root,
- or generate a CONTRIBUTING.md that lists code style and PR process.

---
name: Audio upload URL routing
description: Why uploaded files need to be served under /api/uploads/ not /uploads/
---

The shared proxy only routes `/api/*` to the API server. `app.use("/uploads", static)` is served at the raw server port — unreachable through the proxy at `/uploads/filename`.

**Fix applied in app.ts:**
```js
app.use("/api/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads"))); // kept for direct access
```

**Why:** Upload handler returns `{ url: '/uploads/filename' }`. Frontend prepends `/api` to get `/api/uploads/filename`. The proxy routes `/api/uploads/filename` → API server → static middleware serves the file.

**How to apply:** Any new file storage that needs to be browser-accessible must be mounted under `/api/` in app.ts, not at root level.

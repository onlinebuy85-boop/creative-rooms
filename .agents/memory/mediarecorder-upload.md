---
name: MediaRecorder blob upload
description: Browser-recorded audio blobs arrive at multer with originalname="blob" (no extension). Both fileFilter and filename derivation must handle this.
---

## Rule
When multer receives an audio file, it must accept the file based on MIME type (not just extension), and derive the saved filename extension from MIME when the originalname has none.

**Why:** MediaRecorder.stop() produces a Blob. When appended to FormData as a File, browsers use the generic filename "blob" with no extension. multer's fileFilter checking `path.extname("blob")` returns `""` which fails the allowed-extensions check, silently rejecting the recording upload.

**How to apply:**
```ts
// Accept by extension OR by MIME
const ALLOWED_EXTS  = new Set([".mp3", ".wav", ".m4a", ".ogg", ".flac", ".aac", ".webm", ".mp4"]);
const ALLOWED_MIMES = new Set(["audio/webm","audio/ogg","audio/mp4","audio/x-m4a","audio/aac","audio/mpeg","audio/wav","audio/flac"]);

fileFilter: (_req, file, cb) => {
  const ext  = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype.split(";")[0].trim().toLowerCase();
  cb(null, ALLOWED_EXTS.has(ext) || ALLOWED_MIMES.has(mime) ? true : false);
}

// Derive extension from MIME when missing
filename: (_req, file, cb) => {
  let ext = path.extname(file.originalname).toLowerCase();
  if (!ext) ext = mimeToExt(file.mimetype); // see uploads.ts for mimeToExt
  cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
}
```

Also: capture `recorder.mimeType` AFTER `recorder.start()` (not before) — the browser commits to its actual MIME only after start.

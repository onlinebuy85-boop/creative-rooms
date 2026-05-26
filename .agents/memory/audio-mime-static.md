---
name: Audio static MIME override
description: express.static uses mime-db which maps .m4a to audio/x-m4a — browsers reject this MIME type with MEDIA_ERR_DECODE (error code 3).
---

## Rule
Always use `setHeaders` on `express.static` when serving audio uploads. Override every audio extension to the correct IANA MIME type.

**Why:** Node.js mime-db maps `.m4a` → `audio/x-m4a`, which is an old Apple-proprietary type. Chrome on Android and Safari reject it with MEDIA_ERR_DECODE (error code 3, "audio could not be decoded") even though the file itself is valid. The correct MIME is `audio/mp4`.

**How to apply:**
```ts
const AUDIO_CONTENT_TYPES: Record<string, string> = {
  ".m4a":  "audio/mp4",
  ".mp3":  "audio/mpeg",
  ".wav":  "audio/wav",
  ".ogg":  "audio/ogg",
  ".webm": "audio/webm",
  ".aac":  "audio/aac",
  ".flac": "audio/flac",
  ".mp4":  "video/mp4",
};
express.static(root, {
  setHeaders(res, filePath) {
    const ct = AUDIO_CONTENT_TYPES[path.extname(filePath).toLowerCase()];
    if (ct) { res.setHeader("Content-Type", ct); res.setHeader("Accept-Ranges", "bytes"); }
  },
});
```

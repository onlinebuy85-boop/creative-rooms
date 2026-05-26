import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

export const uploadDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/* Derive a file extension from a MIME type.
   Used when a browser-recorded blob has no filename extension (originalname = "blob"). */
function mimeToExt(mime: string): string {
  const base = mime.split(";")[0].trim().toLowerCase();
  const map: Record<string, string> = {
    "audio/webm": ".webm",
    "audio/ogg":  ".ogg",
    "audio/mp4":  ".m4a",
    "audio/x-m4a": ".m4a",
    "audio/aac":  ".aac",
    "audio/mpeg": ".mp3",
    "audio/wav":  ".wav",
    "audio/flac": ".flac",
  };
  return map[base] ?? ".webm";
}

const ALLOWED_EXTS  = new Set([".mp3", ".wav", ".m4a", ".ogg", ".flac", ".aac", ".webm", ".mp4"]);
const ALLOWED_MIMES = new Set([
  "audio/webm", "audio/ogg", "audio/mp4", "audio/x-m4a",
  "audio/aac",  "audio/mpeg", "audio/wav", "audio/flac",
]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    /* Use the original extension if present; otherwise derive from MIME type.
       MediaRecorder blobs arrive with originalname "blob" (no extension). */
    let ext = path.extname(file.originalname).toLowerCase();
    if (!ext) ext = mimeToExt(file.mimetype);
    cb(null, `${unique}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext      = path.extname(file.originalname).toLowerCase();
    const baseMime = file.mimetype.split(";")[0].trim().toLowerCase();
    if (ALLOWED_EXTS.has(ext) || ALLOWED_MIMES.has(baseMime)) {
      cb(null, true);
    } else {
      cb(new Error(`Only audio files are allowed (got ext="${ext}", mime="${file.mimetype}")`));
    }
  },
});

const router = Router();

router.post("/uploads", upload.single("file"), (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "No file provided" });
    return;
  }
  res.json({ url: `/uploads/${req.file.filename}` });
});

export default router;

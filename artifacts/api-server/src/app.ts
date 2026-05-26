import express, { type Express } from "express";
import path from "path";
import cors from "cors";
import pinoHttp from "pino-http";
import { clerkMiddleware } from "@clerk/express";
import { publishableKeyFromHost } from "@clerk/shared/keys";
import {
  CLERK_PROXY_PATH,
  clerkProxyMiddleware,
  getClerkProxyHost,
} from "./middlewares/clerkProxyMiddleware";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

app.use(CLERK_PROXY_PATH, clerkProxyMiddleware());

app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  clerkMiddleware((req) => ({
    publishableKey: publishableKeyFromHost(
      getClerkProxyHost(req) ?? "",
      process.env.CLERK_PUBLISHABLE_KEY,
    ),
  })),
);

app.use("/api", router);

/* ── Serve uploads with correct Content-Type for all audio formats ── */
/* express.static uses mime-db which maps .m4a to audio/x-m4a — browsers reject it.
   We override every audio extension to the correct IANA MIME type. */
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

function makeAudioStatic(root: string) {
  return express.static(root, {
    setHeaders(res, filePath) {
      const ext = path.extname(filePath).toLowerCase();
      const ct = AUDIO_CONTENT_TYPES[ext];
      if (ct) {
        res.setHeader("Content-Type", ct);
        res.setHeader("Accept-Ranges", "bytes");
      }
    },
  });
}

app.use("/api/uploads", makeAudioStatic(path.join(process.cwd(), "uploads")));
app.use("/uploads",     makeAudioStatic(path.join(process.cwd(), "uploads")));

export default app;

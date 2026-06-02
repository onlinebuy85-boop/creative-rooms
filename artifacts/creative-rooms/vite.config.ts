import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

const configDir = path.resolve(import.meta.dirname);

function resolvePort(mode: string): number {
  const env = loadEnv(mode, configDir, "");
  const rawPort = process.env.PORT ?? env.PORT ?? "5173";
  const port = Number(rawPort);

  if (Number.isNaN(port) || port <= 0) {
    throw new Error(`Invalid PORT value: "${rawPort}"`);
  }

  return port;
}

function resolveBasePath(mode: string): string {
  const env = loadEnv(mode, configDir, "");
  const basePath = process.env.BASE_PATH ?? env.BASE_PATH ?? "/";

  if (!basePath) {
    throw new Error(
      "BASE_PATH environment variable is required but was not provided.",
    );
  }

  return basePath;
}

export default defineConfig(async ({ mode }) => {
  const port = resolvePort(mode);
  const basePath = resolveBasePath(mode);

  return {
    base: basePath,
    plugins: [
    react(),
    tailwindcss({ optimize: false }),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, ".."),
            }),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
    ],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "src"),
        ...(mode === "development"
          ? {
              "@clerk/react": path.resolve(
                import.meta.dirname,
                "src/dev/clerk-react-shim.tsx",
              ),
              "@clerk/react/internal": path.resolve(
                import.meta.dirname,
                "src/dev/clerk-internal-shim.ts",
              ),
            }
          : {}),
      },
      dedupe: ["react", "react-dom"],
    },
    root: path.resolve(import.meta.dirname),
    build: {
      outDir: path.resolve(import.meta.dirname, "dist"),
      emptyOutDir: true,
    },
    server: {
      port,
      strictPort: true,
      host: "0.0.0.0",
      allowedHosts: true,
      fs: {
        strict: true,
      },
    },
    preview: {
      port,
      host: "0.0.0.0",
      allowedHosts: true,
    },
  };
});

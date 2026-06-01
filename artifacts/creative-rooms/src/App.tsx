import { lazy, Suspense } from "react";
import { Router } from "wouter";
import { DevAppRoutes } from "@/dev/app-routes";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

/** Production Clerk app — not loaded in dev (tree-shaken when import.meta.env.DEV) */
const ProductionRoot = import.meta.env.DEV
  ? null
  : lazy(() => import("./app-production"));

export default function Root() {
  if (import.meta.env.DEV) {
    return (
      <Router base={basePath}>
        <DevAppRoutes />
      </Router>
    );
  }

  const Prod = ProductionRoot!;

  return (
    <Router base={basePath}>
      <Suspense fallback={null}>
        <Prod />
      </Suspense>
    </Router>
  );
}

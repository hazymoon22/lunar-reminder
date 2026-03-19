import type { APIContext, MiddlewareNext } from "astro";
import { defineMiddleware, sequence } from "astro:middleware";
import { auth } from "../lib/auth.ts";

const ASSET_CACHE_CONTROL = "public, max-age=31536000, immutable";
const INDEX_CACHE_CONTROL = "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400";

const isAssetPath = (path: string) =>
  path.startsWith("/assets/") ||
  path.startsWith("/src/assets/") ||
  path.endsWith(".png") ||
  path.endsWith(".jpg") ||
  path.endsWith(".jpeg") ||
  path.endsWith(".gif") ||
  path.endsWith(".webp") ||
  path.endsWith(".avif") ||
  path.endsWith(".svg") ||
  path.endsWith(".ico") ||
  path.endsWith(".css") ||
  path.endsWith(".js") ||
  path.endsWith(".mjs") ||
  path.endsWith(".woff") ||
  path.endsWith(".woff2") ||
  path.endsWith(".ttf") ||
  path.endsWith(".otf") ||
  path.endsWith(".eot");

const withCacheHeaders = (response: Response, path: string) => {
  if (path === "/") {
    response.headers.set("Cache-Control", INDEX_CACHE_CONTROL);
  } else if (isAssetPath(path)) {
    response.headers.set("Cache-Control", ASSET_CACHE_CONTROL);
  }

  return response;
};

const authenticate = defineMiddleware(async (context: APIContext, next: MiddlewareNext) => {
  /**
   * This middleware only protects public page routes.
   * Hono API routes will be protected by Hono middleware.
   */
  const path = context.url.pathname;

  const isHomepage = path === "/"; // Home page (exact match)
  const isApiPath = path.startsWith("/api"); // Better Auth API and Hono API routes
  const isAdminPath = path.startsWith("/admin");

  // Allow api paths
  // Hono API routes will be protected by Hono middleware.
  if (isHomepage || isApiPath) {
    const response = await next();
    return withCacheHeaders(response, path);
  }

  // Fetch session for all requests (makes it available in pages)
  const session = await auth.api.getSession({
    headers: context.request.headers,
  });

  if (!session) return context.redirect("/");

  const isAdmin = session.user.role === "admin";
  if (isAdminPath && !isAdmin) return context.redirect("/");

  // Store session in context.locals for use in pages
  context.locals.user = session.user ?? null;
  context.locals.session = session.session ?? null;

  const response = await next();
  return withCacheHeaders(response, path);
});

export const onRequest = sequence(authenticate);

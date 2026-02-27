import { defineMiddleware, sequence } from 'astro:middleware'
import { auth } from '../lib/auth.ts'

const authenticate = defineMiddleware(async (context, next) => {
  /**
   * This middleware only protects public page routes.
   * Hono API routes will be protected by Hono middleware.
   */
  const path = context.url.pathname

  // Check if current path is public
  const isPublicPath =
    path === '/' || // Home page (exact match)
    path.startsWith('/api') // Better Auth API and Hono API routes

  // Allow public paths without authentication
  if (isPublicPath) {
    return next()
  }

  // Fetch session for all requests (makes it available in pages)
  const session = await auth.api.getSession({
    headers: context.request.headers
  })

  if (!session) return context.redirect('/')

  const isAdmin = session.user.role === 'admin'
  if (path.startsWith('/admin') && !isAdmin) return context.redirect('/')

  // Store session in context.locals for use in pages
  context.locals.user = session.user ?? null
  context.locals.session = session.session ?? null

  return next()
})

export const onRequest = sequence(authenticate)

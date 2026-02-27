import { defineMiddleware, sequence } from 'astro:middleware'
import { auth } from '../lib/auth.ts'

const authenticate = defineMiddleware(async (context, next) => {
  /**
   * This middleware only protects public page routes.
   * Hono API routes will be protected by Hono middleware.
   */
  const path = context.url.pathname

  const isHomepage = path === '/' // Home page (exact match)
  const isApiPath = path.startsWith('/api') // Better Auth API and Hono API routes
  const isAdminPath = path.startsWith('/admin')

  // Allow api paths
  // Hono API routes will be protected by Hono middleware.
  if (isApiPath) return next()

  // Fetch session for all requests (makes it available in pages)
  const session = await auth.api.getSession({
    headers: context.request.headers
  })

  if (!session) {
    if (isHomepage) return next()

    return context.redirect('/')
  }

  if (isHomepage) return context.redirect('/reminders')

  const isAdmin = session.user.role === 'admin'
  if (isAdminPath && !isAdmin) return context.redirect('/')

  // Store session in context.locals for use in pages
  context.locals.user = session.user ?? null
  context.locals.session = session.session ?? null

  return next()
})

export const onRequest = sequence(authenticate)

import { ALLOWED_EMAILS } from 'astro:env/server'
import { defineMiddleware, sequence } from 'astro:middleware'
import { auth, getAllowedEmails } from '../lib/auth.ts'

const authenticate = defineMiddleware(async (context, next) => {
  const path = context.url.pathname

  // Check if current path is public
  const isPublicPath =
    path === '/' || // Home page (exact match)
    path.startsWith('/api') // Better Auth API routes

  // Allow public paths without authentication
  if (isPublicPath) {
    return next()
  }

  // Fetch session for all requests (makes it available in pages)
  const session = await auth.api.getSession({
    headers: context.request.headers
  })

  if (!session) {
    return context.redirect('/')
  }

  // Store session in context.locals for use in pages
  context.locals.user = session.user ?? null
  context.locals.session = session.session ?? null

  // Optional: Enforce email whitelist (if configured)
  const allowedEmails = getAllowedEmails()
  if (allowedEmails) {
    const allowedEmails = ALLOWED_EMAILS.split(',').map((email) => email.trim())
    if (!allowedEmails.includes(session.user.email)) {
      console.warn(`Unauthorized access attempt by: ${session.user.email}`)
      return context.redirect('/')
    }
  }

  return next()
})

export const onRequest = sequence(authenticate)

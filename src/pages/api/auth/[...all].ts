import type { APIRoute } from 'astro'
import { auth } from '../../../lib/auth.ts'

export const prerender = false

export const ALL: APIRoute = (ctx) => {
  return auth.handler(ctx.request)
}

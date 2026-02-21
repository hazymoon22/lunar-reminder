import type { APIRoute } from 'astro'
import app from '../../server/index.ts'

export const prerender = false

export const ALL: APIRoute = (context) => {
  return app.fetch(context.request)
}

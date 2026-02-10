import { APP_URL } from 'astro:env/client'
import {
  ALLOWED_EMAILS,
  BETTER_AUTH_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET
} from 'astro:env/server'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '../db'
import * as schema from '../db/schema.ts'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema
  }),
  baseURL: APP_URL,
  secret: BETTER_AUTH_SECRET,
  trustedOrigins: [APP_URL],
  emailAndPassword: {
    enabled: false
  },
  socialProviders: {
    google: {
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET
    }
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const allowedEmails = getAllowedEmails()
          return allowedEmails.includes(user.email)
        }
      }
    }
  }
})

export function getAllowedEmails() {
  const allowedEmails = ALLOWED_EMAILS.split(',')
  return allowedEmails.map((email) => email.trim())
}

import { APP_URL } from 'astro:env/client'
import {
  BETTER_AUTH_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET
} from 'astro:env/server'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { admin } from 'better-auth/plugins'
import { db } from '../db/index.ts'
import * as schema from '../db/schemas/auth.ts'

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
      clientSecret: GOOGLE_CLIENT_SECRET,
      disableSignUp: true,
      overrideUserInfoOnSignIn: true
    }
  },
  plugins: [admin()]
})

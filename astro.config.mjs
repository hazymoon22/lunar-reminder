// @ts-check
import deno from '@deno/astro-adapter'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, envField } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: deno(),
  vite: {
    plugins: [tailwindcss()]
  },
  env: {
    schema: {
      GOOGLE_CLIENT_ID: envField.string({
        context: 'server',
        access: 'secret'
      }),
      GOOGLE_CLIENT_SECRET: envField.string({
        context: 'server',
        access: 'secret'
      }),
      DATABASE_URL: envField.string({ context: 'server', access: 'secret' }),
      BETTER_AUTH_URL: envField.string({
        context: 'server',
        access: 'public',
        default: 'http://localhost:4321'
      }),
      BETTER_AUTH_SECRET: envField.string({
        context: 'server',
        access: 'secret'
      }),
      ALLOWED_EMAILS: envField.string({ context: 'server', access: 'secret' })
    }
  }
})

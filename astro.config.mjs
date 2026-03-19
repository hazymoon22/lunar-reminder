// @ts-check
import cloudflare from "@astrojs/cloudflare";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, envField } from "astro/config";

import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: cloudflare(),

  vite: {
    plugins: [tailwindcss()],
  },

  env: {
    schema: {
      GOOGLE_CLIENT_ID: envField.string({
        context: "server",
        access: "secret",
      }),
      GOOGLE_CLIENT_SECRET: envField.string({
        context: "server",
        access: "secret",
      }),
      DATABASE_URL: envField.string({ context: "server", access: "secret" }),
      APP_URL: envField.string({
        context: "client",
        access: "public",
        default: "http://localhost:4321",
      }),
      BETTER_AUTH_SECRET: envField.string({
        context: "server",
        access: "secret",
      }),
    },
  },

  integrations: [svelte()],
});

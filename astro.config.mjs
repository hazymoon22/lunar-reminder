// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import deno from '@astrojs/deno';

// https://astro.build/config
export default defineConfig({
  output: 'hybrid', // Static by default, SSR when prerender: false
  adapter: deno(),
  vite: {
    plugins: [tailwindcss()],
  },
});

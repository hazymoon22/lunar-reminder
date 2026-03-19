import { defineConfig } from "vite-plus";

export default defineConfig({
  staged: {
    "*.astro": "prettier --write",
    "*": "vp check --fix",
  },
  lint: { options: { typeAware: true, typeCheck: true } },
  test: {
    environment: "node",
    globals: true,
  },
  resolve: {
    alias: {
      "astro:env/server": new URL("./test/shims/astro-env-server.ts", import.meta.url).pathname,
      "astro:env/client": new URL("./test/shims/astro-env-client.ts", import.meta.url).pathname,
    },
  },
});

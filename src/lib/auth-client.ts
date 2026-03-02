import { APP_URL } from "astro:env/client";
import { createAuthClient } from "better-auth/client";
import { adminClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: APP_URL,
  plugins: [adminClient()],
});

export async function signOut() {
  try {
    // This calls the server AND clears the cache
    await authClient.signOut();
  } catch (error) {
    console.error("Sign out failed:", error);

    // Force clear everything and redirect anyway
    // Clear any remaining cookies
    document.cookie.split(";").forEach((cookie) => {
      const name = cookie.split("=")[0].trim();
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    });
  } finally {
    location.href = "/";
  }
}

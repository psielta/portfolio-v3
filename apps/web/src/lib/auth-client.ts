import type { auth } from "@portfolio/auth";
import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

// Get base URL - use relative path in production to avoid CORS issues
// better-auth will automatically append /api/auth to the baseURL
const getBaseURL = () => {
	// If NEXT_PUBLIC_APP_URL is explicitly set, use it
	if (process.env.NEXT_PUBLIC_APP_URL) {
		return process.env.NEXT_PUBLIC_APP_URL;
	}

	// In browser, use current origin (works in both dev and prod)
	if (typeof window !== "undefined") {
		return window.location.origin;
	}

	// Server-side fallback (SSR)
	return "http://localhost:3001";
};

export const authClient = createAuthClient({
	baseURL: getBaseURL(),
	plugins: [inferAdditionalFields<typeof auth>()],
});

export const { signIn, signOut, signUp, useSession } = authClient;

import { nextCookies } from 'better-auth/next-js';
import { betterAuth, type BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@portfolio/db";

// Parse CORS origins from environment variable (comma-separated)
// Supports multiple origins for flexibility
const getTrustedOrigins = (): string[] => {
	const origins: string[] = [];

	// Add CORS_ORIGIN if set (can be comma-separated)
	if (process.env.CORS_ORIGIN) {
		origins.push(...process.env.CORS_ORIGIN.split(',').map(o => o.trim()).filter(Boolean));
	}

	// Add NEXT_PUBLIC_APP_URL if set (for consistency)
	if (process.env.NEXT_PUBLIC_APP_URL) {
		const url = process.env.NEXT_PUBLIC_APP_URL.trim();
		if (!origins.includes(url)) {
			origins.push(url);
		}
	}

	// Add localhost for development (if not already present)
	const localhostOrigins = ['http://localhost:3001', 'http://127.0.0.1:3001'];
	for (const origin of localhostOrigins) {
		if (!origins.includes(origin)) {
			origins.push(origin);
		}
	}

	return origins;
};

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: "sqlite",
	}),
	trustedOrigins: getTrustedOrigins(),
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false,
	},
	user: {
		additionalFields: {
			isAdmin: {
				type: "boolean",
				required: false,
				defaultValue: false,
				input: false,
			}
		}
	},
	plugins: [nextCookies()]
});

export type Session = typeof auth.$Infer.Session;

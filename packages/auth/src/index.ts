import { nextCookies } from 'better-auth/next-js';
import { betterAuth, type BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@portfolio/db";

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: "sqlite",
	}),
	trustedOrigins: [process.env.CORS_ORIGIN || ""],
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

import path from "node:path";
import { defineConfig, env } from "prisma/config";
import dotenv from "dotenv";

// Prioridade: .env.production > .env.local > .env
for (const file of [".env.production", ".env.local", ".env"]) {
	const p = path.resolve("../../apps/web", file);
	if (require("fs").existsSync(p)) {
		dotenv.config({ path: p });
		break;
	}
}

export default defineConfig({
	schema: path.join("prisma", "schema"),
	migrations: {
		path: path.join("prisma", "migrations"),
	},
	datasource: {
		url: env("DATABASE_URL"),
	},
});

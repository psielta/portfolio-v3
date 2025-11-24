import { publicProcedure, router } from "../index";
import { todoRouter } from "./todo";
import { commentRouter } from "./comment";

export const appRouter = router({
	healthCheck: publicProcedure.query(() => {
		return "OK";
	}),
	todo: todoRouter,
	comment: commentRouter,
});
export type AppRouter = typeof appRouter;

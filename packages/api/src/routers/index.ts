import { publicProcedure, router } from "../index";
import { todoRouter } from "./todo";
import { commentRouter } from "./comment";
import { chatRouter } from "./chat";

export const appRouter = router({
	healthCheck: publicProcedure.query(() => {
		return "OK";
	}),
	todo: todoRouter,
	comment: commentRouter,
	chat: chatRouter,
});
export type AppRouter = typeof appRouter;

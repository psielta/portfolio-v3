import { TRPCError } from "@trpc/server";
import { z } from "zod";
import prisma from "@portfolio/db";
import { publicProcedure, protectedProcedure, router } from "../index";

export const commentRouter = router({
	// Public: Get all comments for an article
	getByArticleSlug: publicProcedure
		.input(z.object({ slug: z.string() }))
		.query(async ({ input }) => {
			const comments = await prisma.comment.findMany({
				where: {
					articleSlug: input.slug,
					isDeleted: false,
					parentId: null, // Only get top-level comments
				},
				include: {
					user: {
						select: {
							id: true,
							name: true,
							email: true,
							image: true,
						},
					},
					likes: {
						select: {
							userId: true,
						},
					},
					replies: {
						where: {
							isDeleted: false,
						},
						include: {
							user: {
								select: {
									id: true,
									name: true,
									email: true,
									image: true,
								},
							},
							likes: {
								select: {
									userId: true,
								},
							},
						},
						orderBy: {
							createdAt: 'asc',
						},
					},
				},
				orderBy: {
					createdAt: 'desc',
				},
			});

			return comments;
		}),

	// Public: Get comment count for an article
	getCount: publicProcedure
		.input(z.object({ slug: z.string() }))
		.query(async ({ input }) => {
			const count = await prisma.comment.count({
				where: {
					articleSlug: input.slug,
					isDeleted: false,
				},
			});

			return count;
		}),

	// Public: Get comment counts for multiple articles
	getCountsBySlug: publicProcedure
		.input(z.object({ slugs: z.array(z.string()) }))
		.query(async ({ input }) => {
			const counts = await Promise.all(
				input.slugs.map(async (slug) => {
					const count = await prisma.comment.count({
						where: {
							articleSlug: slug,
							isDeleted: false,
						},
					});
					return { slug, count };
				})
			);

			return counts.reduce((acc, { slug, count }) => {
				acc[slug] = count;
				return acc;
			}, {} as Record<string, number>);
		}),

	// Protected: Create a new comment or reply
	create: protectedProcedure
		.input(
			z.object({
				content: z.string().min(1, "Comentário não pode estar vazio").max(1000, "Comentário muito longo (máximo 1000 caracteres)"),
				articleSlug: z.string(),
				parentId: z.string().optional(),
			})
		)
		.mutation(async ({ input, ctx }) => {
			const comment = await prisma.comment.create({
				data: {
					content: input.content,
					articleSlug: input.articleSlug,
					userId: ctx.session.user.id,
					parentId: input.parentId,
				},
				include: {
					user: {
						select: {
							id: true,
							name: true,
							email: true,
							image: true,
						},
					},
				},
			});

			return comment;
		}),

	// Protected: Update own comment
	update: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				content: z.string().min(1, "Comentário não pode estar vazio").max(1000, "Comentário muito longo"),
			})
		)
		.mutation(async ({ input, ctx }) => {
			const comment = await prisma.comment.findUnique({
				where: { id: input.id },
			});

			if (!comment) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Comentário não encontrado",
				});
			}

			if (comment.userId !== ctx.session.user.id) {
				throw new TRPCError({
					code: "FORBIDDEN",
					message: "Você não tem permissão para editar este comentário",
				});
			}

			const updatedComment = await prisma.comment.update({
				where: { id: input.id },
				data: {
					content: input.content,
					isEdited: true,
				},
				include: {
					user: {
						select: {
							id: true,
							name: true,
							email: true,
							image: true,
						},
					},
				},
			});

			return updatedComment;
		}),

	// Protected: Delete own comment (soft delete)
	delete: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ input, ctx }) => {
			const comment = await prisma.comment.findUnique({
				where: { id: input.id },
			});

			if (!comment) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Comentário não encontrado",
				});
			}

			if (comment.userId !== ctx.session.user.id) {
				throw new TRPCError({
					code: "FORBIDDEN",
					message: "Você não tem permissão para deletar este comentário",
				});
			}

			await prisma.comment.update({
				where: { id: input.id },
				data: { isDeleted: true },
			});

			return { success: true };
		}),

	// Protected: Toggle like on a comment
	toggleLike: protectedProcedure
		.input(z.object({ commentId: z.string() }))
		.mutation(async ({ input, ctx }) => {
			const existingLike = await prisma.commentLike.findUnique({
				where: {
					commentId_userId: {
						commentId: input.commentId,
						userId: ctx.session.user.id,
					},
				},
			});

			if (existingLike) {
				// Unlike: Remove like and decrement count
				await prisma.$transaction([
					prisma.commentLike.delete({
						where: { id: existingLike.id },
					}),
					prisma.comment.update({
						where: { id: input.commentId },
						data: { likeCount: { decrement: 1 } },
					}),
				]);

				return { liked: false };
			} else {
				// Like: Create like and increment count
				await prisma.$transaction([
					prisma.commentLike.create({
						data: {
							commentId: input.commentId,
							userId: ctx.session.user.id,
						},
					}),
					prisma.comment.update({
						where: { id: input.commentId },
						data: { likeCount: { increment: 1 } },
					}),
				]);

				return { liked: true };
			}
		}),
});

import { TRPCError } from "@trpc/server";
import { z } from "zod";
import prisma from "@portfolio/db";
import { publicProcedure, protectedProcedure, router } from "../index";

export const chatRouter = router({
	// Protected: Get or create conversation with admin
	getOrCreateConversation: protectedProcedure.query(async ({ ctx }) => {
		// Find existing conversation for this user
		let conversation = await prisma.conversation.findFirst({
			where: {
				userId: ctx.session.user.id,
				isDeleted: false,
			},
			include: {
				messages: {
					where: { isDeleted: false },
					orderBy: { createdAt: 'asc' },
					include: {
						sender: {
							select: {
								id: true,
								name: true,
								email: true,
								image: true,
							},
						},
					},
				},
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

		// Create if doesn't exist
		if (!conversation) {
			conversation = await prisma.conversation.create({
				data: {
					userId: ctx.session.user.id,
					isAdminChat: true,
				},
				include: {
					messages: {
						include: {
							sender: {
								select: {
									id: true,
									name: true,
									email: true,
									image: true,
								},
							},
						},
					},
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
		}

		return conversation;
	}),

	// Protected: Send message
	sendMessage: protectedProcedure
		.input(
			z.object({
				conversationId: z.string(),
				content: z.string().min(1).max(2000),
			})
		)
		.mutation(async ({ ctx, input }) => {
			// Verify user has access to this conversation
			const conversation = await prisma.conversation.findUnique({
				where: { id: input.conversationId },
			});

			if (!conversation) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Conversation not found",
				});
			}

			const isParticipant = conversation.userId === ctx.session.user.id;
			const isAdmin = ctx.session.user.isAdmin;

			if (!isParticipant && !isAdmin) {
				throw new TRPCError({
					code: "FORBIDDEN",
					message: "Not authorized",
				});
			}

			// Create message
			const message = await prisma.message.create({
				data: {
					conversationId: input.conversationId,
					senderId: ctx.session.user.id,
					content: input.content,
					status: 'SENT',
				},
				include: {
					sender: {
						select: {
							id: true,
							name: true,
							email: true,
							image: true,
						},
					},
				},
			});

			// Update conversation lastMessageAt
			await prisma.conversation.update({
				where: { id: input.conversationId },
				data: { lastMessageAt: new Date() },
			});

			return message;
		}),

	// Protected: Mark messages as read
	markAsRead: protectedProcedure
		.input(
			z.object({
				conversationId: z.string(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			// Verify access
			const conversation = await prisma.conversation.findUnique({
				where: { id: input.conversationId },
			});

			if (!conversation) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Conversation not found",
				});
			}

			const isParticipant = conversation.userId === ctx.session.user.id;
			const isAdmin = ctx.session.user.isAdmin;

			if (!isParticipant && !isAdmin) {
				throw new TRPCError({
					code: "FORBIDDEN",
					message: "Not authorized",
				});
			}

			// Mark all unread messages as read
			await prisma.message.updateMany({
				where: {
					conversationId: input.conversationId,
					senderId: { not: ctx.session.user.id }, // Not own messages
					readAt: null,
				},
				data: {
					status: 'READ',
					readAt: new Date(),
				},
			});

			return { success: true };
		}),

	// Protected: Get unread count for user
	getUnreadCount: protectedProcedure.query(async ({ ctx }) => {
		const conversation = await prisma.conversation.findFirst({
			where: {
				userId: ctx.session.user.id,
				isDeleted: false,
			},
		});

		if (!conversation) return 0;

		const count = await prisma.message.count({
			where: {
				conversationId: conversation.id,
				senderId: { not: ctx.session.user.id },
				readAt: null,
				isDeleted: false,
			},
		});

		return count;
	}),

	// Admin only: Get all conversations
	getAllConversations: protectedProcedure.query(async ({ ctx }) => {
		if (!ctx.session.user.isAdmin) {
			throw new TRPCError({
				code: "FORBIDDEN",
				message: "Admin access required",
			});
		}

		const conversations = await prisma.conversation.findMany({
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
				messages: {
					where: { isDeleted: false },
					orderBy: { createdAt: 'desc' },
					take: 1,
					include: {
						sender: {
							select: {
								id: true,
								name: true,
							},
						},
					},
				},
				_count: {
					select: {
						messages: {
							where: {
								isDeleted: false,
								readAt: null,
								senderId: { not: ctx.session.user.id },
							},
						},
					},
				},
			},
			orderBy: {
				lastMessageAt: 'desc',
			},
		});

		return conversations;
	}),

	// Admin only: Get conversation by ID
	getConversationById: protectedProcedure
		.input(z.object({ conversationId: z.string() }))
		.query(async ({ ctx, input }) => {
			const conversation = await prisma.conversation.findUnique({
				where: { id: input.conversationId },
				include: {
					user: {
						select: {
							id: true,
							name: true,
							email: true,
							image: true,
						},
					},
					messages: {
						where: { isDeleted: false },
						orderBy: { createdAt: 'asc' },
						include: {
							sender: {
								select: {
									id: true,
									name: true,
									email: true,
									image: true,
								},
							},
						},
					},
				},
			});

			if (!conversation) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Conversation not found",
				});
			}

			const isParticipant = conversation.userId === ctx.session.user.id;
			const isAdmin = ctx.session.user.isAdmin;

			if (!isParticipant && !isAdmin) {
				throw new TRPCError({
					code: "FORBIDDEN",
					message: "Not authorized",
				});
			}

			return conversation;
		}),

	// Admin only: Get total unread count across all conversations
	getAdminUnreadCount: protectedProcedure.query(async ({ ctx }) => {
		if (!ctx.session.user.isAdmin) {
			throw new TRPCError({
				code: "FORBIDDEN",
				message: "Admin access required",
			});
		}

		const count = await prisma.message.count({
			where: {
				senderId: { not: ctx.session.user.id },
				readAt: null,
				isDeleted: false,
			},
		});

		return count;
	}),
});

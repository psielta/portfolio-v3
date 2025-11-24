'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Loader2, LogIn } from 'lucide-react';
import Link from 'next/link';
import { useSession } from '@/lib/auth-client';
import { trpc, queryClient } from '@/utils/trpc';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import CommentForm from './comment-form';
import CommentItem from './comment-item';

interface CommentsSectionProps {
  articleSlug: string;
}

export default function CommentsSection({ articleSlug }: CommentsSectionProps) {
  const { data: session } = useSession();

  // Fetch comments
  const { data: comments, isLoading } = useQuery({
    queryKey: ['comment.getByArticleSlug', articleSlug],
    queryFn: () => trpc.comment.getByArticleSlug.query({ slug: articleSlug }),
  });

  // Mutations
  const createComment = useMutation({
    mutationFn: (input: { content: string; articleSlug: string; parentId?: string }) =>
      trpc.comment.create.mutate(input),
    onSuccess: () => {
      toast.success('Comentário publicado!');
      queryClient.invalidateQueries({
        queryKey: ['comment.getByArticleSlug', articleSlug]
      });
      queryClient.invalidateQueries({
        queryKey: ['comment.getCount', articleSlug]
      });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao publicar comentário');
    },
  });

  const updateComment = useMutation({
    mutationFn: (input: { id: string; content: string }) =>
      trpc.comment.update.mutate(input),
    onSuccess: () => {
      toast.success('Comentário atualizado!');
      queryClient.invalidateQueries({
        queryKey: ['comment.getByArticleSlug', articleSlug]
      });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao atualizar comentário');
    },
  });

  const deleteComment = useMutation({
    mutationFn: (input: { id: string }) =>
      trpc.comment.delete.mutate(input),
    onSuccess: () => {
      toast.success('Comentário deletado!');
      queryClient.invalidateQueries({
        queryKey: ['comment.getByArticleSlug', articleSlug]
      });
      queryClient.invalidateQueries({
        queryKey: ['comment.getCount', articleSlug]
      });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao deletar comentário');
    },
  });

  const toggleLike = useMutation({
    mutationFn: (input: { commentId: string }) =>
      trpc.comment.toggleLike.mutate(input),
    onSuccess: (data: any) => {
      toast.success(data.liked ? 'Comentário curtido!' : 'Curtida removida');
      queryClient.invalidateQueries({
        queryKey: ['comment.getByArticleSlug', articleSlug]
      });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao curtir comentário');
    },
  });

  // Handlers
  const handleCreateComment = async (content: string) => {
    await createComment.mutateAsync({
      content,
      articleSlug,
    });
  };

  const handleReply = async (parentId: string, content: string) => {
    await createComment.mutateAsync({
      content,
      articleSlug,
      parentId,
    });
  };

  const handleEdit = async (id: string, content: string) => {
    await updateComment.mutateAsync({
      id,
      content,
    });
  };

  const handleDelete = async (id: string) => {
    await deleteComment.mutateAsync({ id });
  };

  const handleToggleLike = async (commentId: string) => {
    await toggleLike.mutateAsync({ commentId });
  };

  const totalComments = comments?.reduce((total, comment) => {
    return total + 1 + (comment.replies?.length || 0);
  }, 0) || 0;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mt-16 pt-8 border-t border-white/10"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg">
          <MessageSquare className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Comentários</h2>
          <p className="text-white/50 text-sm">
            {totalComments} {totalComments === 1 ? 'comentário' : 'comentários'}
          </p>
        </div>
      </div>

      {/* Comment Form or Login Prompt */}
      {session?.user ? (
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || 'User'}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                session.user.name?.charAt(0).toUpperCase()
              )}
            </div>
            <span className="text-white/70 text-sm">
              Comentando como <strong className="text-white">{session.user.name}</strong>
            </span>
          </div>
          <CommentForm onSubmit={handleCreateComment} />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8 p-6 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">
                Faça login para comentar
              </h3>
              <p className="text-white/60 text-sm">
                Compartilhe suas opiniões e participe da discussão
              </p>
            </div>
            <Link href="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 hover:from-blue-600 hover:via-purple-700 hover:to-pink-700 text-white font-medium rounded-lg transition-all"
              >
                <LogIn className="w-4 h-4" />
                Login
              </motion.button>
            </Link>
          </div>
        </motion.div>
      )}

      {/* Comments List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
        </div>
      ) : comments && comments.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <AnimatePresence mode="popLayout">
            {comments.map((comment, index) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <CommentItem
                  comment={comment}
                  onReply={handleReply}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleLike={handleToggleLike}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12 px-4 rounded-xl bg-white/5 border border-white/10"
        >
          <MessageSquare className="w-12 h-12 text-white/30 mx-auto mb-4" />
          <p className="text-white/50 text-lg mb-2">Nenhum comentário ainda</p>
          <p className="text-white/40 text-sm">
            Seja o primeiro a compartilhar sua opinião!
          </p>
        </motion.div>
      )}
    </motion.section>
  );
}

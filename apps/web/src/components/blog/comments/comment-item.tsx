'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Reply,
  Edit,
  Trash2,
  MoreVertical,
  Check,
  X
} from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useSession } from '@/lib/auth-client';
import { toast } from 'sonner';
import CommentForm from './comment-form';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CommentUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
}

interface CommentData {
  id: string;
  content: string;
  articleSlug: string;
  userId: string;
  user: CommentUser;
  parentId?: string | null;
  replies?: CommentData[];
  likes: { userId: string }[];
  likeCount: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  isDeleted: boolean;
  isEdited: boolean;
}

interface CommentItemProps {
  comment: CommentData;
  onReply?: (commentId: string, content: string) => Promise<void>;
  onEdit?: (commentId: string, content: string) => Promise<void>;
  onDelete?: (commentId: string) => Promise<void>;
  onToggleLike?: (commentId: string) => Promise<void>;
  isNested?: boolean;
}

export default function CommentItem({
  comment,
  onReply,
  onEdit,
  onDelete,
  onToggleLike,
  isNested = false,
}: CommentItemProps) {
  const { data: session } = useSession();
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showReplies, setShowReplies] = useState(true);

  const isOwnComment = session?.user?.id === comment.userId;
  const hasLiked = comment.likes.some((like) => like.userId === session?.user?.id);
  const avatarLetter = comment.user.name.charAt(0).toUpperCase();

  const handleReply = async (content: string) => {
    if (onReply) {
      await onReply(comment.id, content);
      setIsReplying(false);
    }
  };

  const handleEdit = async (content: string) => {
    if (onEdit) {
      await onEdit(comment.id, content);
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja deletar este comentário?')) {
      return;
    }
    if (onDelete) {
      await onDelete(comment.id);
    }
  };

  const handleToggleLike = async () => {
    if (!session?.user) {
      toast.error('Faça login para curtir comentários');
      return;
    }
    if (onToggleLike) {
      await onToggleLike(comment.id);
    }
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'agora mesmo';
    if (minutes < 60) return `${minutes}min atrás`;
    if (hours < 24) return `${hours}h atrás`;
    if (days < 7) return `${days}d atrás`;
    return d.toLocaleDateString('pt-BR');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`${isNested ? 'ml-8 md:ml-12' : ''}`}
    >
      <div className="relative bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 hover:border-white/20 transition-all">
        {/* User Info */}
        <div className="flex items-start gap-3 mb-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-sm">
              {comment.user.image ? (
                <img
                  src={comment.user.image}
                  alt={comment.user.name}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                avatarLetter
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">
                  {comment.user.name}
                </span>
                {comment.isEdited && (
                  <span className="text-xs text-white/40">(editado)</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-white/50">
                  {formatDate(comment.createdAt)}
                </span>

                {isOwnComment && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="text-white/50 hover:text-white/80 transition-colors p-1">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-lg"
                    >
                      <DropdownMenuItem
                        onClick={() => setIsEditing(true)}
                        className="text-white/80 hover:text-white hover:bg-white/5 cursor-pointer"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={handleDelete}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Deletar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Comment Content */}
        {isEditing ? (
          <div className="mb-3">
            <CommentForm
              onSubmit={handleEdit}
              onCancel={() => setIsEditing(false)}
              initialValue={comment.content}
              submitLabel="Salvar"
              placeholder="Edite seu comentário..."
            />
          </div>
        ) : (
          <div className="prose prose-invert prose-sm max-w-none mb-3 ml-13">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                a: ({ node, ...props }) => (
                  <a
                    {...props}
                    className="text-purple-400 hover:text-purple-300 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                ),
                p: ({ node, ...props }) => (
                  <p {...props} className="text-white/80 leading-relaxed mb-2" />
                ),
                strong: ({ node, ...props }) => (
                  <strong {...props} className="text-white font-semibold" />
                ),
                em: ({ node, ...props }) => (
                  <em {...props} className="text-white/90 italic" />
                ),
                code: ({ node, ...props }) => (
                  <code
                    {...props}
                    className="bg-white/10 px-1.5 py-0.5 rounded text-purple-300 text-sm font-mono"
                  />
                ),
              }}
            >
              {comment.content}
            </ReactMarkdown>
          </div>
        )}

        {/* Actions */}
        {!isEditing && (
          <div className="flex items-center gap-4 ml-13">
            {/* Like Button */}
            <motion.button
              onClick={handleToggleLike}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                hasLiked
                  ? 'bg-pink-500/20 text-pink-400'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80'
              }`}
            >
              <Heart
                className={`w-4 h-4 ${hasLiked ? 'fill-pink-400' : ''}`}
              />
              <span className="text-sm font-medium">{comment.likeCount}</span>
            </motion.button>

            {/* Reply Button */}
            {!isNested && onReply && session?.user && (
              <button
                onClick={() => setIsReplying(!isReplying)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80 transition-all"
              >
                <Reply className="w-4 h-4" />
                <span className="text-sm font-medium">Responder</span>
              </button>
            )}

            {/* Show/Hide Replies */}
            {comment.replies && comment.replies.length > 0 && (
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
              >
                {showReplies ? 'Ocultar' : 'Ver'} {comment.replies.length}{' '}
                {comment.replies.length === 1 ? 'resposta' : 'respostas'}
              </button>
            )}
          </div>
        )}

        {/* Reply Form */}
        <AnimatePresence>
          {isReplying && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 ml-13"
            >
              <CommentForm
                onSubmit={handleReply}
                onCancel={() => setIsReplying(false)}
                placeholder="Escreva sua resposta..."
                submitLabel="Responder"
                isReply
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nested Replies */}
      <AnimatePresence>
        {showReplies && comment.replies && comment.replies.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 space-y-3"
          >
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleLike={onToggleLike}
                isNested
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

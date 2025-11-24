'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { authClient, useSession } from '@/lib/auth-client';
import { motion } from 'framer-motion';
import {
  LogIn,
  LogOut,
  MessageCircle,
  UserCircle
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function UserMenu() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const handleSignOut = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success('Logout realizado com sucesso!');
            router.push('/');
            router.refresh();
          },
          onError: (ctx) => {
            toast.error('Erro ao fazer logout');
            console.error(ctx.error);
          },
        },
      });
    } catch (error) {
      console.error('Erro no logout:', error);
      toast.error('Erro ao fazer logout');
    }
  };

  if (isPending) {
    return (
      <Skeleton className="h-10 w-10 rounded-full bg-white/10" />
    );
  }

  if (!session) {
    return (
      <Link href="/login">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 hover:from-blue-600 hover:via-purple-700 hover:to-pink-700 text-white font-medium rounded-lg transition-all duration-300"
        >
          <LogIn className="w-4 h-4" />
          Login
        </motion.button>
      </Link>
    );
  }

  // Get first letter of name for avatar
  const avatarLetter = session.user?.name?.charAt(0).toUpperCase() || 'U';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 text-white font-bold overflow-hidden ring-2 ring-white/20 hover:ring-white/40 transition-all duration-300"
        >
          {session.user?.image ? (
            <img
              src={session.user.image}
              alt={session.user.name || 'User'}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-lg">{avatarLetter}</span>
          )}
        </motion.button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-64 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl p-2"
      >
        <DropdownMenuLabel className="px-3 py-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 text-white font-bold text-sm">
              {avatarLetter}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {session.user?.name || 'Usuário'}
              </p>
              <p className="text-xs text-white/60 truncate">
                {session.user?.email || ''}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-white/10 my-2" />

        <DropdownMenuItem asChild>
          <Link
            href="/profile"
            className="flex items-center gap-3 px-3 py-2 text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-all cursor-pointer"
          >
            <UserCircle className="w-4 h-4" />
            <span>Meu Perfil</span>
          </Link>
        </DropdownMenuItem>

        {session.user?.isAdmin ? (
          <>
          <DropdownMenuItem asChild>
            <Link
              href="/admin/chat"
              className="flex items-center gap-3 px-3 py-2 text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat Admin</span>
            </Link>
          </DropdownMenuItem>
          </>
        ) : null}

        <DropdownMenuSeparator className="bg-white/10 my-2" />

        <DropdownMenuItem asChild>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair</span>
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

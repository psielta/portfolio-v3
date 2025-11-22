import Image from 'next/image';
import Link from 'next/link';
import type { ComponentProps } from 'react';

// Componentes customizados para MDX com tema espacial
export const mdxComponents = {
  // Headers com gradiente
  h1: (props: ComponentProps<'h1'>) => (
    <h1
      className="mt-8 mb-4 text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
      {...props}
    />
  ),
  h2: (props: ComponentProps<'h2'>) => (
    <h2
      className="mt-8 mb-4 text-3xl font-bold text-white"
      {...props}
    />
  ),
  h3: (props: ComponentProps<'h3'>) => (
    <h3
      className="mt-6 mb-3 text-2xl font-semibold text-white"
      {...props}
    />
  ),
  h4: (props: ComponentProps<'h4'>) => (
    <h4
      className="mt-6 mb-3 text-xl font-semibold text-white/90"
      {...props}
    />
  ),

  // Parágrafos
  p: (props: ComponentProps<'p'>) => (
    <p className="mb-4 text-white/80 leading-relaxed" {...props} />
  ),

  // Links com hover gradient
  a: ({ href, ...props }: ComponentProps<'a'>) => {
    const isInternal = href && (href.startsWith('/') || href.startsWith('#'));

    if (isInternal && href) {
      return (
        <Link
          href={href as any}
          className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors"
          {...props}
        />
      );
    }

    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors"
        {...props}
      />
    );
  },

  // Listas
  ul: (props: ComponentProps<'ul'>) => (
    <ul className="mb-4 ml-6 list-disc text-white/80" {...props} />
  ),
  ol: (props: ComponentProps<'ol'>) => (
    <ol className="mb-4 ml-6 list-decimal text-white/80" {...props} />
  ),
  li: (props: ComponentProps<'li'>) => (
    <li className="mb-2 pl-1" {...props} />
  ),

  // Blockquotes com borda neon
  blockquote: (props: ComponentProps<'blockquote'>) => (
    <blockquote
      className="my-6 border-l-4 border-blue-500 bg-white/5 pl-4 py-3 italic text-white/70"
      {...props}
    />
  ),

  // Code blocks com tema espacial
  pre: (props: ComponentProps<'pre'>) => (
    <pre
      className="my-6 overflow-x-auto rounded-lg bg-black/60 backdrop-blur-sm border border-white/10 p-4"
      {...props}
    />
  ),
  code: ({ className, ...props }: ComponentProps<'code'>) => {
    // Inline code
    if (!className) {
      return (
        <code
          className="px-1.5 py-0.5 rounded bg-white/10 text-blue-400 text-sm font-mono"
          {...props}
        />
      );
    }
    // Block code (dentro de pre)
    return (
      <code
        className={`${className} text-sm font-mono`}
        {...props}
      />
    );
  },

  // Tabelas
  table: (props: ComponentProps<'table'>) => (
    <div className="my-6 overflow-x-auto">
      <table
        className="w-full border-collapse border border-white/20"
        {...props}
      />
    </div>
  ),
  thead: (props: ComponentProps<'thead'>) => (
    <thead className="bg-white/10" {...props} />
  ),
  th: (props: ComponentProps<'th'>) => (
    <th
      className="border border-white/20 px-4 py-2 text-left font-semibold text-white"
      {...props}
    />
  ),
  td: (props: ComponentProps<'td'>) => (
    <td
      className="border border-white/20 px-4 py-2 text-white/80"
      {...props}
    />
  ),

  // Linha horizontal
  hr: (props: ComponentProps<'hr'>) => (
    <hr
      className="my-8 h-px border-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
      {...props}
    />
  ),

  // Imagens com borda iluminada
  img: ({ src, alt, width, height, ...props }: ComponentProps<'img'>) => {
    if (!src) return null;

    // Verifica se src é uma string antes de usar startsWith
    const srcString = typeof src === 'string' ? src : '';

    // Se for uma URL relativa, usar Next Image
    if (srcString.startsWith('/')) {
      return (
        <div className="my-6 overflow-hidden rounded-lg border border-white/20 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
          <Image
            src={srcString}
            alt={alt || ''}
            width={800}
            height={400}
            className="w-full h-auto"
          />
        </div>
      );
    }

    // Imagem externa
    return (
      <div className="my-6 overflow-hidden rounded-lg border border-white/20 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-auto"
          {...props}
        />
      </div>
    );
  },

  // Strong/Bold
  strong: (props: ComponentProps<'strong'>) => (
    <strong className="font-bold text-white" {...props} />
  ),

  // Emphasis/Italic
  em: (props: ComponentProps<'em'>) => (
    <em className="italic text-white/90" {...props} />
  ),

  // Detalhes/Summary (para conteúdo colapsável)
  details: (props: ComponentProps<'details'>) => (
    <details
      className="my-4 rounded-lg border border-white/20 bg-white/5 p-4 group"
      {...props}
    />
  ),
  summary: (props: ComponentProps<'summary'>) => (
    <summary
      className="cursor-pointer font-semibold text-white hover:text-blue-400 transition-colors"
      {...props}
    />
  ),
};
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote-client/rsc';
import { ArticleLayout } from '@/components/blog/article-layout';
import { mdxComponents } from '@/components/blog/mdx-components';
import { getArticleBySlug, getArticleSlugs, getRelatedArticles } from '@/lib/blog';
import { ArticleCard } from '@/components/blog/article-card';
import CommentsSection from '@/components/blog/comments/comments-section';

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Gera metadados dinâmicos para SEO
export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const article = getArticleBySlug(resolvedParams.slug);

  if (!article) {
    return {
      title: 'Artigo não encontrado',
    };
  }

  return {
    title: `${article.title} - Mateus Salgueiro`,
    description: article.description,
    authors: [{ name: article.author }],
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      publishedTime: article.publishedAt,
      authors: [article.author],
      tags: article.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
    },
  };
}

// Gera paths estáticos para build-time rendering
export async function generateStaticParams() {
  const slugs = getArticleSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const resolvedParams = await params;
  const article = getArticleBySlug(resolvedParams.slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = getRelatedArticles(article.slug);

  return (
    <>
      <ArticleLayout article={article}>
        {/* Renderiza o conteúdo MDX */}
        <MDXRemote
          source={article.content}
          components={mdxComponents}
          options={{
            mdxOptions: {
              // Opções de processamento MDX
              format: 'mdx',
            },
          }}
        />

        {/* Artigos relacionados */}
        {relatedArticles.length > 0 && (
          <section className="mt-16 pt-8 border-t border-white/10">
            <h2 className="mb-6 text-2xl font-bold text-white">
              Artigos Relacionados
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedArticles.map((related) => (
                <ArticleCard key={related.slug} article={related} />
              ))}
            </div>
          </section>
        )}
      </ArticleLayout>

      {/* Comments Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <CommentsSection articleSlug={article.slug} />
      </div>

      {/* Schema.org structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: article.title,
            description: article.description,
            author: {
              '@type': 'Person',
              name: article.author,
            },
            datePublished: article.publishedAt,
            dateModified: article.publishedAt,
            keywords: article.tags?.join(', '),
          }),
        }}
      />
    </>
  );
}